// State for Hearth & Ledger: loads the seed data on first run, keeps every change
// in localStorage, and offers the small operations the views need. Nothing here
// touches the network; the household's figures stay in this browser.
import {
  BUDGETS, TRANSACTIONS, GOALS, BILLS, INCOME, CURRENT_MONTH, MONTHS,
} from './data.js';

const KEY = 'hearth-and-ledger-v1';

function seed() {
  return {
    month: CURRENT_MONTH,
    income: INCOME.map((x) => ({ ...x })),
    transactions: TRANSACTIONS.map((x) => ({ ...x })),
    budgets: BUDGETS.map((x) => ({ ...x })),
    goals: GOALS.map((x) => ({ ...x })),
    bills: BILLS.map((x) => ({ ...x })),
  };
}

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

let state = load();

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or a full store: the site still works for this visit.
  }
}

export function getState() {
  return state;
}

export function getMonths() {
  return MONTHS;
}

export function setMonth(month) {
  if (MONTHS.includes(month)) state.month = month;
}

export function resetDemo() {
  state = seed();
  save();
}

export function monthIncome() {
  return state.income.reduce((sum, line) => sum + line.amount, 0);
}

export function monthTransactions() {
  return [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function monthSpent() {
  return state.transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function spentByCategory(categoryId) {
  return state.transactions
    .filter((t) => t.category === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function budgetFor(categoryId) {
  const row = state.budgets.find((b) => b.category === categoryId);
  return row ? row.amount : 0;
}

export function setBudget(categoryId, cents) {
  const row = state.budgets.find((b) => b.category === categoryId);
  if (row && Number.isFinite(cents) && cents >= 0) {
    row.amount = Math.round(cents);
    save();
    return true;
  }
  return false;
}

export function addTransaction({ date, payee, category, amount, note }) {
  const cents = Math.round(Number(amount) * 100);
  if (!date || !payee || !category || !Number.isFinite(cents) || cents <= 0) return null;
  const tx = {
    id: 'u' + Date.now().toString(36),
    date, payee: payee.trim(), category, amount: cents, note: (note || '').trim(),
  };
  state.transactions.push(tx);
  save();
  return tx;
}

export function removeTransaction(id) {
  const before = state.transactions.length;
  state.transactions = state.transactions.filter((t) => t.id !== id);
  if (state.transactions.length !== before) save();
}

export function addToGoal(goalId, dollars) {
  const cents = Math.round(Number(dollars) * 100);
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal || !Number.isFinite(cents) || cents <= 0) return false;
  goal.saved = Math.min(goal.target, goal.saved + cents);
  save();
  return true;
}

export function markBillPaid(billId) {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) return false;
  bill.status = 'paid';
  save();
  return true;
}

export function upcomingBills() {
  return [...state.bills].sort((a, b) => a.dueDay - b.dueDay);
}

export function totalBudgeted() {
  return state.budgets.reduce((sum, b) => sum + b.amount, 0);
}
