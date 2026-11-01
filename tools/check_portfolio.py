#!/usr/bin/env python3
"""Offline pre-publish checks. Run from any directory; no packages required."""
import json
from pathlib import Path
import sys
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'portfolio'
errors, warnings = [], []

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.refs, self.keys, self.meta = [], [], set(), {}
        self.canonical = None
        self.languages = []
        self.stack = []
        self.void = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in self.void:
            self.stack.append(tag)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for name, value in attrs.items():
            if name.startswith('data-i18n'):
                self.keys.add(value)
            if name in ('src', 'href'):
                self.refs.append(value)
        if tag == 'a' and attrs.get('target') == '_blank' and 'noopener' not in attrs.get('rel', '').split():
            errors.append(f"New-tab link needs rel=\"noopener noreferrer\": {attrs.get('href')}")
        if tag == 'meta':
            self.meta[attrs.get('property', attrs.get('name'))] = attrs.get('content')
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        if tag == 'option':
            self.languages.append(attrs.get('value'))
        if tag == 'img':
            if 'alt' not in attrs or not attrs.get('width') or not attrs.get('height'):
                errors.append('Every image needs alt, width, and height attributes.')
            asset = SITE / attrs.get('src', '')
            if asset.is_file() and asset.stat().st_size > 150_000:
                warnings.append(f'{asset.name} exceeds 150 KB; consider resizing or WebP.')

    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag:
            errors.append(f'Unexpected closing tag </{tag}>; check the surrounding HTML.')
        else:
            self.stack.pop()

page = Page()
page.feed((SITE / 'index.html').read_text())
if page.stack:
    errors.append(f'Unclosed HTML tags: {page.stack}')
if len(page.ids) != len(set(page.ids)):
    errors.append('Duplicate id attributes. Give every section a unique id.')
for ref in page.refs:
    url = urlsplit(ref)
    if url.scheme or url.netloc:
        if url.scheme and url.scheme not in ('https', 'http', 'mailto', 'tel'):
            errors.append(f'Unexpected link scheme: {ref}')
        continue
    if url.path and not (SITE / unquote(url.path).lstrip('/')).is_file():
        errors.append(f'Missing local file: {ref}')
    if not url.path and url.fragment and unquote(url.fragment) not in page.ids:
        errors.append(f'Missing section target: {ref}')
for key in ('description', 'og:title', 'og:description', 'og:url', 'og:type'):
    if not page.meta.get(key):
        errors.append(f'Missing metadata: {key}')
if page.canonical != 'https://www.benamuwo.com/' or page.meta.get('og:url') != page.canonical:
    errors.append('Canonical URL and og:url must both use https://www.benamuwo.com/.')

try:
    source = (SITE / 'translations.js').read_text()
    translations = json.loads(source.split('window.PORTFOLIO_TRANSLATIONS = ', 1)[1].strip().removesuffix(';'))
    for language in ('en', 'fr', 'nl', 'zh-Hans', 'ja'):
        if language not in page.languages:
            errors.append(f'Language menu is missing {language}.')
        required = {'dark', 'light', 'toDark', 'toLight'}
        if language != 'en':
            required |= page.keys
        missing = sorted(key for key in required if not isinstance(translations.get(language, {}).get(key), str) or not translations[language][key].strip())
        if missing:
            warnings.append(f'{language}: missing translations for {", ".join(missing)}. English will be used.')
except (ValueError, IndexError, OSError) as error:
    errors.append(f'Cannot read translations.js: {error}')

for message in errors:
    print('ERROR:', message)
for message in warnings:
    print('WARNING:', message)
if errors or ('--strict' in sys.argv and warnings):
    print('Fix the issues above before publishing.')
    sys.exit(1)
print(f'PASS: HTML, {len(page.refs)} references, metadata, images and 5 language options checked offline.')
print('Remote destinations and translation quality still need a human/browser check.')
