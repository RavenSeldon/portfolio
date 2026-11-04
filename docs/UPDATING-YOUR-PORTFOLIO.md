# Updating your portfolio for dummies

You do not need a web framework, a build command, or a new design every time you add a project. This site is a small set of files. Edit the English page, add translations, check it locally, then publish.

## The five-minute map

| What you want to change | File |
| --- | --- |
| Projects, descriptions, links, order, English text | `portfolio/index.html` |
| Colours, spacing, sizes, mobile layout | `portfolio/styles.css` |
| French, Dutch, Simplified Chinese and Japanese wording | `portfolio/translations.js` |
| Language selection and English fallback | `portfolio/i18n.js` — usually leave this alone |
| Theme button and active section navigation | `portfolio/script.js` — usually leave this alone |
| Images | `portfolio/assets/` |
| Downloadable résumé | `portfolio/resume.pdf` |
| Checks before publishing | `tools/check_portfolio.py` |

All paths in this guide are relative to `/Users/theda/Root/portfolio`. Only the inner `portfolio/` folder is published. This guide, the templates and the checker are maintenance tools, not public navigation items.

## 1. Start with a clean, current copy

Open Terminal and run:

```bash
cd /Users/theda/Root/portfolio
git status
git pull --ff-only
```

If `git status` lists unfinished edits, keep them: finish or commit them before pulling. If the pull says the branches diverged, use the troubleshooting section below. Do not discard changes to make the message disappear.

## 2. Add a project by copying a template

Choose the bucket based on what the project does:

| Bucket | Find this in `index.html` | What goes there |
| --- | --- | --- |
| AI Safety and Governance | `id="ai-safety"` | AI incidents, accountability, governance and safety research |
| Civic and Community Systems | `id="civic"` | Public-interest tools and community initiatives |
| Featured Research | `id="research"` | Research programmes, studies, protocols and results |
| Other Projects | `id="other-projects"` | Creative tools, experiments and companions |
| Inspiration and Imagination | `id="inspiration"` | Play, language, ideas and useful everyday resources |
| Beyond the Work | `id="beyond"` | Personal writing, interests and profiles |

### Quickest option: add a link card

For a link that does not need a full project description, use **05 / Inspiration and Imagination**:

1. Copy the whole [link-card.html](templates/link-card.html) template into the `<div class="link-grid">` inside `id="inspiration"`, before that grid’s closing `</div>`.
2. Replace the destination URL, category, title, displayed domain, and `your-project` prefix. Use a unique prefix, such as `new-idea`.
3. Add the two matching keys (`new-idea.category` and `new-idea.title`) to each of the four language dictionaries, then run the checks below.

That is all the layout work: a fourth, fifth, or sixth card automatically flows into new rows and stacks on smaller screens. Reorder whole `<a class="link-card">…</a>` blocks to reorder cards. To remove one, delete its entire block. No CSS, JavaScript, or navigation edits are needed for individual cards.

You can reuse the same cards in any section by putting them inside `<div class="link-grid">…</div>`. Keep existing links unless you deliberately intend to remove them. Check that shared documents allow the intended audience to view them; a portfolio link does not change the document’s permissions.

### When a project needs more detail

For a simple project, copy the entire `<article>…</article>` from [project-row.html](templates/project-row.html). Paste it inside the relevant section, after an existing article and before that section’s closing `</section>`. In Civic, it will inherit the existing row layout automatically.

For a card like First Notice, copy [project-card.html](templates/project-card.html) into the existing `<div class="safety-grid">`, beside the other cards. For cards in another section, surround the articles with `<div class="safety-grid">…</div>`.

Replace:

1. `Project Name` with the actual name. Brand names can remain the same in every language.
2. Every `https://example.com` and `example.com` with the real destination and domain.
3. The category, short description and personal contribution.
4. Every `your-project.` key with a unique prefix, such as `river-map.`.
5. Technology tags with the real tools. Delete the contribution paragraph or tags if unnecessary.

Keep descriptions useful: **what it does → who it helps → what you contributed**. Use one or two sentences. Avoid duplicating a project in two sections unless each entry adds something different.

HTML basics: keep opening and closing tags together. Use `&amp;` for an ampersand in HTML. Keep `target="_blank" rel="noopener noreferrer"` on external links. An `href` changes the destination; visible text changes only the label.

## 3. Translate the new text

English stays in `index.html`. A translation key joins a piece of English text to its equivalents:

```html
<p><span data-i18n="river-map.description">A map of local river restoration projects.</span></p>
```

In `portfolio/translations.js`, add the matching key inside each language object:

```js
// Inside "fr": { ... }
"river-map.description": "Une carte des projets locaux de restauration des rivières."

// Inside "nl": { ... }
"river-map.description": "Een kaart van lokale rivierherstelprojecten."

// Inside "zh-Hans": { ... }
"river-map.description": "本地河流修复项目地图。"

// Inside "ja": { ... }
"river-map.description": "地域の河川再生プロジェクトの地図。"
```

These are examples, not a block to paste at the end of the file. Each entry needs a comma between it and the next entry. Keep the existing `window.PORTFOLIO_TRANSLATIONS = { ... };` wrapper. Keep values as plain text; never put HTML in translations. Escape a literal double quote as `\"`.

Use `data-i18n-aria-label` for an accessibility label, `data-i18n-alt` for an image description, and `data-i18n-content` for a metadata value. The existing examples show the pattern. Place a translation span around the words only, so arrows, links, icons and line breaks remain intact.

**Missing translations do not break the page.** The English source text remains visible, and marked fallback text is identified as English for screen readers. The checker warns about missing keys; `--strict` makes warnings block the check. An intentional English-first release can use the checker without `--strict`, but review its warnings.

The small `en` object contains only the theme button’s changing labels. Other English wording comes directly from the HTML. When changing an existing English description, update all four translations under its existing key too: the checker cannot detect an outdated translation’s meaning.

The initial translations were drafted with AI assistance and have not been certified by native-language reviewers. Review terminology and research claims carefully. Keep uncertainty, limitations and evidence strength consistent across languages.

### How language selection works

- English is the default. Choosing another language saves the preference in that browser when storage is available.
- An explicit `?lang=` URL takes precedence over a saved preference.
- Values: `en`, `fr`, `nl`, `zh-Hans`, `ja`.
- Example: `https://www.benamuwo.com/?lang=fr#research` opens the French research section.
- The dropdown updates the current URL while preserving its section anchor and other query parameters.
- Changing language does not translate external destination sites or downloaded PDFs.
- JavaScript unavailable? The original English page and all links still work.

## 4. Preview before publishing

Run this in Terminal:

```bash
python3 -m http.server 4173 --bind 127.0.0.1 --directory portfolio
```

Open **http://127.0.0.1:4173** in your browser. Leave that Terminal window running. Open a second Terminal window for other commands. To stop the preview, press **Control+C** in its Terminal window.

After saving edits, reload the browser. A local file opened by double-clicking may display the page, but the local server is the more consistent way to test browser behaviour and remembered preferences.

Check the changed section in both themes, all five languages, and a narrow phone-sized window. Click new links, open any resource disclosures, and use Tab to reach the language and theme controls. Check that long translations fit without overlapping.

## 5. Run the pre-publish check

```bash
cd /Users/theda/Root/portfolio
python3 tools/check_portfolio.py --strict
node --check portfolio/translations.js
node --check portfolio/i18n.js
node --check portfolio/script.js
git diff --check
```

The Python check requires no installed packages. It checks HTML nesting, duplicate IDs, internal section links, referenced local files, image attributes and weight, sharing metadata, language options and translation coverage. It does not contact external sites or judge the quality of translations. The Node commands catch JavaScript syntax mistakes. `git diff --check` catches whitespace problems and conflict markers.

## 6. Publish

```bash
git diff --stat
git diff -- portfolio/index.html portfolio/styles.css
git add portfolio/
git commit -m "Add River Map project"
git push origin main
```

Review `git status` before committing; only stage changes you intend to publish. If you edited this guide or the checker, stage their paths explicitly too. A push updates GitHub. If automatic deployment is enabled on the existing host, it triggers deployment; it does not prove the live site has finished updating.

Open **https://www.benamuwo.com/** after the host reports success. Hard-refresh, check your project, and try its links. Sharing platforms can cache old previews even after a successful deployment.

## Common quality-of-life changes

### Change colours or spacing

Edit the CSS variables at the top of `styles.css`. The first group is light mode; `[data-theme="dark"]` is dark mode. Change both sets and check readability. Common controls are `--bg`, `--ink`, `--muted`, `--accent` and `--blue`.

The `.wrap` rule controls the overall width. `.work-section` controls section spacing. Mobile overrides live in `@media` blocks; check them before deciding a change “didn’t work.”

### Add a small image without slowing everything down

Use an image you own or have permission to use. Keep a full-resolution original outside the published folder. For a 104 px logo, 312×312 gives three pixels per displayed pixel. The Hatchery image follows this pattern.

The installed WebP encoder can resize and preserve transparency:

```bash
cwebp -resize 312 312 -q 90 -alpha_q 100 /absolute/path/original.png -o portfolio/assets/project-icon.webp
```

Use explicit dimensions, an informative alt description, and lazy loading below the fold:

```html
<img src="assets/project-icon.webp" width="312" height="312"
     alt="A short description of the project image"
     loading="lazy" decoding="async">
```

CSS controls the displayed size. The checker warns above 150 KB per referenced image. Prefer a new filename when replacing an image so cached versions cannot linger. Never turn a transparent image into JPEG if transparency matters.

### Add a section

Copy a complete existing `<section>` and give it a unique `id`. Give its heading a unique `id` and match it in `aria-labelledby`. Add a navigation link in `.section-nav`, such as `<a href="#new-section">…</a>`. The active-section script discovers navigation links automatically, in document order. Keep navigation order and section order consistent.

Add translations for the heading, description and navigation label. Keep the menu short: an existing bucket is usually better than another project category. The navigation scrolls horizontally when its links need more room.

### Add a research result

Copy a block inside `.research-stages`, change the study name, status, summary and exact result URL, then translate it. “Completed” describes completion of the study, not proof of every hypothesis. Preserve inconclusive findings and limitations.

The desktop layout currently uses three columns. For a fourth study, either start a new research article or deliberately change `.research-stages` to an appropriate responsive grid and test it. Do not assume adding columns will fit on a tablet.

### Update the résumé

Replace `portfolio/resume.pdf` with the new PDF using the same filename. Open the download after deployment to confirm it is the right version.

### Update link previews

Edit the document `<title>`, description, `og:title` and `og:description`, plus their translations. Keep the canonical URL and `og:url` at `https://www.benamuwo.com/`. Language selection does not create separately indexed translated pages.

A future 1200×630 sharing card can live at `assets/social-card.jpg`. Once that real file exists, add `og:image` with its **absolute public HTTPS URL**, and add `og:image:width` / `og:image:height`. Social crawlers generally read the initial English HTML, so client-side language switching alone does not provide translated social cards.

## Troubleshooting without losing work

**Push rejected: “fetch first.”** The remote repository changed since your last pull. Commit your work, then:

```bash
git fetch origin
git rebase origin/main
```

If the rebase succeeds, run the checks and push again. If it reports conflicts, stop and inspect the named files. Keep both useful sets of changes, remove conflict markers, stage the resolved files, and run `git rebase --continue`. If unsure, `git rebase --abort` returns to the state before the rebase. Ask for help rather than using `git push --force`.

**Translation did not change.** Check that the HTML key exactly matches the dictionary key. Reload after saving. If you changed the English wording, the other languages need separate updates. Check the browser console for syntax errors and run the commands above.

**Language keeps reverting.** A `?lang=` parameter overrides saved preferences. Select the desired language or remove that parameter. Browser storage can also be restricted in private browsing or for local files.

**Image is missing.** Check spelling and case, the extension, and that the file is inside `portfolio/`. Web servers can be case-sensitive even when your Mac is not.

**Site looks unchanged.** Confirm the change was committed and pushed, check the host’s deployment, then hard-refresh. A successful Git push and a completed website deployment are separate steps.

**Undo a published mistake.** Prefer a new corrective commit. For a specific ordinary commit, `git revert COMMIT_ID` creates a new commit that reverses it while preserving history; review the result and push. Do not reset or force-push shared history.

## A reusable request for an assistant

> Update this existing static portfolio. Add [project name] to [bucket], linking to [exact URL]. Here is the accurate description and my contribution: [text]. Preserve Space Mono, both themes, every other link, and the current layout. Add French, Dutch, Simplified Chinese and Japanese translations for new text, preserving uncertainty and scope. Keep images small. Run tools/check_portfolio.py --strict and JavaScript syntax checks, preview the changed section on mobile and desktop, then [save locally / commit and push]. Update the guide only if the workflow changes.
