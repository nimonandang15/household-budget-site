# household-budget-site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/nimonandang15/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/nimonandang15/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hearth & Ledger — a household budget site for the Marlow family. Dashboard, transactions, budgets, savings goals, bills and six-month reports, all working in the browser from static files with no network request: add a transaction and every page updates, edit a monthly budget envelope, fund a goal, mark a bill paid. Real figures for November 2026 throughout, nothing empty or placeholder.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no dependencies.

## Layout

- `app/` — the site itself: `index.html`, `style.css`, and one job per script (`data.js` seed records, `store.js` state, `format.js` money and dates, `charts.js` hand-rolled SVG charts, `views.js` pages, `main.js` routing).
- `screenshots/` — four real renders: dashboard, transactions, budgets, and the dashboard on a phone.
- `main.ts` — hands the entry in: copies `app/` and `screenshots/` to the output and writes `dossier.json` with the vendored make.fun library.
- `serve.ts` — a tiny static server for local testing.

---

<sub>Entered on [make.fun](https://make.fun/?ref=cydbk12s&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
