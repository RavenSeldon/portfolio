# Ben Amuwo’s portfolio

A static website: HTML, CSS and small JavaScript files. No install step, build system, or runtime translation service.

**Start here:** [Updating your portfolio for dummies](docs/UPDATING-YOUR-PORTFOLIO.md).

```bash
# Preview locally, from the repository root:
python3 -m http.server 4173 --bind 127.0.0.1 --directory portfolio
# Open http://127.0.0.1:4173

# Before publishing (in another Terminal window):
python3 tools/check_portfolio.py --strict
```

Publish directory: `portfolio`. Build command: none. The existing Git-connected host receives updates pushed to `main`; verify deployment separately.
