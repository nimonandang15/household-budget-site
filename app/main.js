// Bootstrapping and routing for Hearth & Ledger. Hash routes keep every page a
// plain link (#/, #/transactions, #/budgets, #/goals, #/bills, #/reports), and
// one delegated click/submit handler wires every control the views render.
import { getMonths, getState, setMonth, addTransaction, removeTransaction, setBudget, addToGoal, markBillPaid, monthTransactions } from './store.js';
import { dashboard, transactionsPage, budgetsPage, goalsPage, billsPage, reportsPage } from './views.js';
import { money } from './format.js';
import { catLabel } from './views.js';

const view = document.getElementById('view');
const monthPick = document.getElementById('monthPick');

const ROUTES = {
  '': dashboard,
  transactions: transactionsPage,
  budgets: budgetsPage,
  goals: goalsPage,
  bills: billsPage,
  reports: reportsPage,
};

function route() {
  const name = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  const render = ROUTES[name] || dashboard;
  view.innerHTML = render();
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-nav') === (name || 'dashboard'));
  });
  window.scrollTo(0, 0);
}

import { monthLabel } from './format.js';

function fillMonthPicker() {
  monthPick.innerHTML = getMonths()
    .map((m) => `<option value="${m}">${monthLabel(m)}</option>`)
    .join('');
  monthPick.value = getState().month;
}

function filterTransactions() {
  const cat = document.getElementById('txFilter');
  const q = document.getElementById('txSearch');
  const body = document.getElementById('txBody');
  const empty = document.getElementById('txEmpty');
  if (!cat || !q || !body) return;
  const needle = q.value.trim().toLowerCase();
  const rows = monthTransactions().filter((t) => {
    if (cat.value && t.category !== cat.value) return false;
    if (needle && !(t.payee.toLowerCase().includes(needle) || (t.note || '').toLowerCase().includes(needle))) return false;
    return true;
  });
  body.innerHTML = rows
    .map((t) => `<tr><td>${t.date.slice(5)}</td><td><b>${t.payee}</b>${t.note ? `<br><span class="note">${t.note}</span>` : ''}</td><td>${catLabel(t.category)}</td><td class="num">${money(t.amount)}</td><td class="num"><button class="btn secondary small" data-remove-tx="${t.id}" type="button">Remove</button></td></tr>`)
    .join('');
  empty.hidden = rows.length > 0;
}

view.addEventListener('submit', (event) => {
  const form = event.target;
  if (form.id === 'addTx') {
    event.preventDefault();
    const data = new FormData(form);
    const tx = addTransaction({
      date: data.get('date'),
      payee: data.get('payee'),
      category: data.get('category'),
      amount: data.get('amount'),
      note: data.get('note'),
    });
    const msg = document.getElementById('addTxMsg');
    if (tx) {
      msg.textContent = `Added ${money(tx.amount)} at ${tx.payee}.`;
      form.reset();
      form.querySelector('[name="date"]').value = '2026-11-27';
      route();
    } else if (msg) {
      msg.textContent = 'Check the fields — an amount above $0 and a date are needed.';
    }
    return;
  }
  const goalId = form.getAttribute('data-goal-form');
  if (goalId) {
    event.preventDefault();
    const amount = new FormData(form).get('amount');
    if (addToGoal(goalId, amount)) route();
  }
});

view.addEventListener('click', (event) => {
  const removeBtn = event.target.closest('[data-remove-tx]');
  if (removeBtn) {
    removeTransaction(removeBtn.getAttribute('data-remove-tx'));
    if (document.getElementById('txBody')) filterTransactions();
    else route();
    return;
  }
  const payBtn = event.target.closest('[data-pay-bill]');
  if (payBtn) {
    markBillPaid(payBtn.getAttribute('data-pay-bill'));
    route();
    return;
  }
  const saveBtn = event.target.closest('[data-save-budget]');
  if (saveBtn) {
    const category = saveBtn.getAttribute('data-save-budget');
    const input = view.querySelector(`[data-budget="${category}"]`);
    if (input && setBudget(category, Number(input.value) * 100)) route();
  }
});

view.addEventListener('input', (event) => {
  if (event.target.id === 'txFilter' || event.target.id === 'txSearch') filterTransactions();
});

monthPick.addEventListener('change', () => {
  setMonth(monthPick.value);
  route();
});

fillMonthPicker();
window.addEventListener('hashchange', route);
route();
