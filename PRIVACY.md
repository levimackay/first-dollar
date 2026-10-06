# Privacy

first-dollar is an agent skill and Claude Code plugin that runs on your machine, inside your agent. It has no server, no account and no telemetry, and it collects nothing about you.

What it does with data:

- **Files.** It reads and writes files only in the page folder you name, plus one line per page in `~/.first-dollar/history.jsonl`: the fonts and colors that page used, so later pages don't repeat them. Everything stays on your machine.
- **The lint** reads the HTML and CSS in the page folder. It makes no network requests.
- **The browser check** starts a local web server on `127.0.0.1` to render your page in your own Chrome, or Playwright's Chromium. The page loads what it links, such as its fonts and any pinned CDN script.
- **References and fonts.** When you give it a reference URL, it visits that one site to take screenshots. `--specimen` requests one font family's stylesheet from Google Fonts. These requests go straight from your machine to those sites, under their own privacy policies.
- **Nothing else leaves your machine.** It never sends your idea, your copy or your files anywhere. What your agent sends to its own model provider is between you and that provider.

Questions: open an issue at https://github.com/levimackay/first-dollar/issues.
