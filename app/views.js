// Page renderers for Hearth & Ledger. Each function returns the HTML for one
// hash route. All figures come from store.js, so adding a transaction, editing a
// budget, funding a goal or paying a bill updates every page at once.
import { money, money0, pct, prettyDate, shortDate, monthLabel, monthShort } from './format.js';
import {
  getState, monthIncome, monthTransactions, monthSpent, spentByCategory,
  budgetFor, upcomingBills, totalBudgeted,
} from './store.js';
import { CATEGORIES, GOALS, MONTHLY_HISTORY, HOUSEHOLD } from './data.js';
import { donut, incomeBars, categoryRows } from './charts.js';

export function catLabel(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label : id;
}

function catColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : '#8a8a7a';
}

function esc(text) {
  return String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function txRow(t) {
  return `<tr><td>${shortDate(t.date)}</td><td><span class="who">${esc(t.payee)}</span>${t.note ? `<br><span class="note">${esc(t.note)}</span>` : ''}</td><td><span class="pill" style="background:${catColor(t.category)}22;color:${catColor(t.category)}">${esc(catLabel(t.category))}</span></td><td class="num amt-out">${money(t.amount)}</td><td class="num"><button class="btn secondary small" data-remove-tx="${t.id}" type="button">Remove</button></td></tr>`;
}

export function dashboard() {
  const s = getState();
  const income = monthIncome();
  const spent = monthSpent();
  const left = income - spent;
  const budgeted = totalBudgeted();
  const saved = spentByCategory('savings');
  const over = s.budgets
    .map((b) => ({ ...b, spent: spentByCategory(b.category) }))
    .filter((b) => b.spent > b.amount && b.amount > 0);
  const topCats = CATEGORIES.map((c) => ({ ...c, value: spentByCategory(c.id) }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const recent = monthTransactions().slice(0, 6);
  const due = upcomingBills().filter((b) => b.status === 'due');
  const goals = s.goals;

  return `
  <div class="page-head">
    <h1>November at a glance</h1>
    <p>${esc(HOUSEHOLD.name)} — ${esc(HOUSEHOLD.members)}. ${esc(HOUSEHOLD.home)}</p>
  </div>
  ${over.length ? `<p class="notice warn"><b>Over budget:</b> ${over.map((b) => `${esc(catLabel(b.category))} is ${money(b.spent - b.amount)} over its ${money0(b.amount)} budget`).join('; ')}. Thanksgiving week did it — see <a href="#/budgets">Budgets</a>.</p>` : ''}
  <div class="grid cols-3">
    <div class="card stat"><div class="label">Income in</div><div class="value">${money(income)}</div><div class="delta">5 paydays and sales this month</div></div>
    <div class="card stat"><div class="label">Spent</div><div class="value">${money(spent)}</div><div class="delta ${spent <= budgeted ? 'good' : 'warn'}">${spent <= budgeted ? 'Under' : 'Over'} the ${money0(budgeted)} planned budget</div></div>
    <div class="card stat"><div class="label">Left to assign</div><div class="value">${money(left)}</div><div class="delta ${left >= 0 ? 'good' : 'bad'}">${left >= 0 ? 'Ready to give a job — extra to savings or a goal' : 'More went out than came in'}</div></div>
  </div>
  <div class="grid cols-32" style="margin-top:18px">
    <div class="card">
      <div class="card-head"><h2>Where the money went</h2><a href="#/reports">Full report →</a></div>
      <p class="sub">November spending by category. Groceries ran hot with Thanksgiving; transport came in well under.</p>
      <div style="display:flex;gap:18px;flex-wrap:wrap;align-items:center">
        ${donut(topCats, spent)}
        <div style="flex:1;min-width:220px">
          ${topCats.map((c) => `<div class="budget-row"><div class="row-top"><span class="cat"><span class="dot" style="background:${c.color}"></span>${esc(c.label)}</span><span>${money0(c.value)}</span></div><div class="bar"><i style="width:${pct(c.value, spent)}%;background:${c.color}"></i></div><div class="row-meta"><span>${pct(c.value, spent)}% of spending</span><span>budget ${money0(budgetFor(c.id))}</span></div></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Coming up</h2><a href="#/bills">All bills →</a></div>
      <p class="sub">${due.length ? `${due.length} bill${due.length > 1 ? 's' : ''} still due before the month ends.` : 'Every November bill is paid.'}</p>
      ${due.map((b) => `<div class="bill-row"><div class="grow"><div class="b-name">${esc(b.name)}</div><div class="b-meta">Due Nov ${b.dueDay} · ${b.autopay ? 'Autopay on' : 'Pay by hand'}</div></div><b>${money(b.amount)}</b></div>`).join('') || '<p class="muted">Nothing left due — a clean month.</p>'}
      <h3 style="margin-top:18px">Savings goals</h3>
      ${goals.slice(0, 3).map((g) => `<div class="budget-row"><div class="row-top"><span>${esc(g.name)}</span><span>${money0(g.saved)} of ${money0(g.target)}</span></div><div class="bar"><i style="width:${pct(g.saved, g.target)}%"></i></div><div class="row-meta"><span>${pct(g.saved, g.target)}% there</span><span>${money0(g.target - g.saved)} to go</span></div></div>`).join('')}
      <p style="margin:12px 0 0"><a href="#/goals">Add money to a goal →</a></p>
    </div>
  </div>
  <div class="card" style="margin-top:18px">
    <div class="card-head"><h2>Latest spending</h2><a href="#/transactions">All ${monthTransactions().length} transactions →</a></div>
    <p class="sub">The newest entries first. Add one from the Transactions page and it shows up here at once.</p>
    <table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>${recent.map(txRow).join('')}</tbody></table>
    <p class="muted" style="margin:12px 0 0">Saved to the emergency fund and goals this month: <b>${money(saved)}</b> — the habit that keeps the household steady.</p>
  </div>`;
}

export function transactionsPage() {
  const s = getState();
  const options = CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('');
  return `
  <div class="page-head">
    <h1>Transactions</h1>
    <p>Every dollar in and out for ${monthLabel(s.month)}. Add spending as it happens and the budgets, dashboard and reports all update.</p>
  </div>
  <div class="card" style="margin-bottom:18px">
    <h2>Add a transaction</h2>
    <p class="sub">It saves in this browser and counts toward its category's budget right away.</p>
    <form id="addTx" class="form-grid">
      <label class="f"><span>Date</span><input type="date" name="date" value="2026-11-27" required></label>
      <label class="f"><span>Where / to whom</span><input type="text" name="payee" placeholder="e.g. Greenline Market" maxlength="80" required></label>
      <label class="f"><span>Category</span><select name="category">${options}</select></label>
      <label class="f"><span>Amount ($)</span><input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label class="f full"><span>Note (optional)</span><input type="text" name="note" placeholder="What was it for?" maxlength="120"></label>
      <div class="full"><button class="btn" type="submit">Add transaction</button> <span class="muted" id="addTxMsg" role="status"></span></div>
    </form>
  </div>
  <div class="card">
    <div class="card-head"><h2>November spending</h2><span class="muted">${monthTransactions().length} entries · ${money(monthSpent())} total</span></div>
    <div class="toolbar">
      <label class="f"><span>Category</span><select id="txFilter"><option value="">All categories</option>${options}</select></label>
      <label class="f"><span>Search</span><input type="search" id="txSearch" placeholder="Payee or note…"></label>
    </div>
    <table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody id="txBody">${monthTransactions().map(txRow).join('')}</tbody></table>
    <p class="empty" id="txEmpty" hidden>Nothing matches that filter — try clearing the search.</p>
  </div>`;
}

export function budgetsPage() {
  const s = getState();
  const rows = s.budgets.map((b) => {
    const spent = spentByCategory(b.category);
    const share = pct(spent, b.amount);
    const cls = spent > b.amount ? 'over' : share >= 85 ? 'near' : '';
    const left = b.amount - spent;
    return `<div class="budget-row">
      <div class="row-top"><span class="cat"><span class="dot" style="background:${catColor(b.category)}"></span>${esc(catLabel(b.category))}</span><span>${money(spent)} of ${money(b.amount)}</span></div>
      <div class="bar"><i class="${cls}" style="width:${Math.min(100, share)}%"></i></div>
      <div class="row-meta"><span>${share}% used · ${left >= 0 ? money(left) + ' left' : money(-left) + ' over'}</span>
      <span><label class="muted">Monthly budget $ <input type="number" data-budget="${b.category}" value="${(b.amount / 100).toFixed(0)}" min="0" step="10" style="width:90px;display:inline-block;padding:4px 8px" aria-label="Monthly budget for ${esc(catLabel(b.category))}"> <button class="btn secondary small" data-save-budget="${b.category}" type="button">Save</button></label></span></div>
    </div>`;
  }).join('');
  const total = totalBudgeted();
  const spent = monthSpent();
  return `
  <div class="page-head">
    <h1>Budgets</h1>
    <p>One envelope per category for ${monthLabel(s.month)}: ${money0(total)} planned, ${money(spent)} spent so far. Change a monthly figure and save — the dashboard follows.</p>
  </div>
  <div class="grid cols-3" style="margin-bottom:18px">
    <div class="card stat"><div class="label">Planned</div><div class="value">${money(total)}</div><div class="delta">Across ${s.budgets.length} categories</div></div>
    <div class="card stat"><div class="label">Spent</div><div class="value">${money(spent)}</div><div class="delta">${pct(spent, total)}% of the plan</div></div>
    <div class="card stat"><div class="label">Still in the envelopes</div><div class="value">${money(Math.max(0, total - spent))}</div><div class="delta">${total - spent < 0 ? 'Over the plan — trim a category' : 'Room to breathe before month-end'}</div></div>
  </div>
  <div class="card"><h2>November envelopes</h2><p class="sub">Groceries ran over with Thanksgiving; transport has the most slack left.</p>${rows}</div>
  <p class="muted" style="margin-top:14px">A household rule that works for the Marlows: when a category goes over, the extra comes from the category with the most slack — never from savings.</p>`;
}

export function goalsPage() {
  const s = getState();
  return `
  <div class="page-head">
    <h1>Savings goals</h1>
    <p>What the household is saving toward, and how close each goal is. Add money whenever there is some to spare — it moves the bar at once.</p>
  </div>
  <div class="grid cols-2">
    ${s.goals.map((g) => {
    const share = pct(g.saved, g.target);
    const left = g.target - g.saved;
    return `<div class="card">
      <div class="card-head"><h2>${esc(g.name)}</h2><span class="pill ${share >= 100 ? '' : 'tone-gold'}">${share}%</span></div>
      <p class="sub">${esc(g.note)}</p>
      <div class="goal-figure">${money(g.saved)} <span class="muted" style="font-size:16px">of ${money(g.target)}</span></div>
      <div class="bar" style="margin:10px 0 6px"><i style="width:${share}%"></i></div>
      <p class="muted">${left > 0 ? `${money(left)} to go.` : 'Goal reached — time to celebrate, then set the next one.'}</p>
      <form class="toolbar" data-goal-form="${g.id}" style="margin:10px 0 0">
        <label class="f"><span>Add to this goal ($)</span><input type="number" name="amount" min="1" step="1" placeholder="50" required></label>
        <button class="btn small" type="submit">Add money</button>
      </form>
    </div>`;
  }).join('')}
  </div>
  <div class="card" style="margin-top:18px">
    <h2>How the Marlows save</h2>
    <p class="sub">Payday first: ${money(120000)} moves to savings the day the salaries land, before any spending. Then, at month-end, whatever is left unassigned is split between the emergency fund and the next trip. That is how the emergency fund reached ${money0(GOALS[0].saved)} without ever feeling like a sacrifice.</p>
  </div>`;
}

export function billsPage() {
  const s = getState();
  const bills = upcomingBills();
  const due = bills.filter((b) => b.status === 'due');
  const paid = bills.filter((b) => b.status === 'paid');
  const dueTotal = due.reduce((sum, b) => sum + b.amount, 0);
  const row = (b) => `<div class="bill-row">
    <div class="grow"><div class="b-name">${esc(b.name)}</div><div class="b-meta">Due Nov ${b.dueDay} · ${b.autopay ? 'Autopay on' : 'Pay by hand'}</div></div>
    <b>${money(b.amount)}</b>
    ${b.status === 'due'
    ? `<button class="btn small" data-pay-bill="${b.id}" type="button">Mark paid</button>`
    : `<span class="pill">Paid</span>`}
  </div>`;
  return `
  <div class="page-head">
    <h1>Bills</h1>
    <p>The household's recurring bills for ${monthLabel(s.month)}. Mark one paid and it stays paid; the dashboard's coming-up list clears with it.</p>
  </div>
  <div class="grid cols-3" style="margin-bottom:18px">
    <div class="card stat"><div class="label">Still due</div><div class="value">${money(dueTotal)}</div><div class="delta">${due.length} bill${due.length === 1 ? '' : 's'} left this month</div></div>
    <div class="card stat"><div class="label">Paid already</div><div class="value">${money(paid.reduce((sum, b) => sum + b.amount, 0))}</div><div class="delta">${paid.length} of ${bills.length} bills settled</div></div>
    <div class="card stat"><div class="label">Next up</div><div class="value">${due.length ? 'Nov ' + due[0].dueDay : '—'}</div><div class="delta">${due.length ? esc(due[0].name) : 'Nothing left due'}</div></div>
  </div>
  <div class="grid cols-2">
    <div class="card"><h2>Still due</h2><p class="sub">Pay these before their day, or let autopay take them.</p>${due.map(row).join('') || '<p class="muted">All caught up.</p>'}</div>
    <div class="card"><h2>Paid in November</h2><p class="sub">Settled, with the dates they were due.</p>${paid.map(row).join('')}</div>
  </div>`;
}

export function reportsPage() {
  const s = getState();
  const income = monthIncome();
  const spent = monthSpent();
  const history = MONTHLY_HISTORY.map((h) => ({ label: monthShort(h.month), income: h.income, spent: h.spent }));
  const cats = CATEGORIES.map((c) => ({ label: c.label, value: spentByCategory(c.id), color: c.color }));
  const best = history.reduce((a, b) => (a.income - a.spent > b.income - b.spent ? a : b));
  const avgSpent = Math.round(history.reduce((sum, h) => sum + h.spent, 0) / history.length);
  return `
  <div class="page-head">
    <h1>Reports</h1>
    <p>Six months of the household's money, side by side. November is the lightest spending month since June — Thanksgiving groceries and all.</p>
  </div>
  <div class="grid cols-3" style="margin-bottom:18px">
    <div class="card stat"><div class="label">Average monthly spending</div><div class="value">${money(avgSpent)}</div><div class="delta">June – November 2026</div></div>
    <div class="card stat"><div class="label">Best saving month</div><div class="value">${best.label} ’26</div><div class="delta good">Kept ${money(best.income - best.spent)} of its income</div></div>
    <div class="card stat"><div class="label">November savings rate</div><div class="value">${pct(income - spent, income)}%</div><div class="delta">${money(income - spent)} of ${money(income)} stayed in the household</div></div>
  </div>
  <div class="card" style="margin-bottom:18px">
    <div class="card-head"><h2>Income vs spending, by month</h2><span class="muted">Green is income in, terracotta is spending</span></div>
    <div class="chart-wrap">${incomeBars(history)}</div>
    <div class="legend"><span><span class="dot" style="background:#1d4a38"></span> Income</span><span><span class="dot" style="background:#c96f3f"></span> Spending</span></div>
  </div>
  <div class="grid cols-2">
    <div class="card">
      <h2>November spending, by category</h2>
      <p class="sub">Housing is the fixed rock; groceries are the moving piece to watch.</p>
      ${categoryRows(cats, spent)}
    </div>
    <div class="card">
      <h2>What November taught us</h2>
      <div class="insight"><b>Groceries ran 25% over budget.</b> Thanksgiving week cost ${money(spentByCategory('groceries') - budgetFor('groceries'))} more than planned — the turkey, the pies, the extra mouths. Next year the November grocery envelope gets ${money0(20000)} more.</div>
      <div class="insight"><b>Transport has slack.</b> Only ${pct(spentByCategory('transport'), budgetFor('transport'))}% of the transport budget went out — Tom worked from home two Fridays. That slack covered the grocery overrun.</div>
      <div class="insight"><b>Savings stayed sacred.</b> The ${money(120000)} transfer went out on payday, before any spending, for the eleventh month running. The emergency fund now covers ${Math.round((GOALS[0].saved / 195000) * 10) / 10} months of mortgage.</div>
      <p class="muted">Income this month: ${money(income)} across ${s.income.length} lines — two salaries, overtime, tutoring and one sold stroller.</p>
    </div>
  </div>
  <p class="muted" style="margin-top:14px">Figures shown are for ${monthLabel(s.month)}; the six-month chart covers June – November 2026. Add a transaction on the Transactions page and every figure on this page moves with it.</p>`;
}
