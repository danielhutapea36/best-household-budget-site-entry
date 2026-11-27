// State for Hearth: loads the seed data, keeps it in localStorage, and
// offers the small set of changes the site's forms need. No network.

import { CATEGORIES, SEED_GOALS, SEED_TRANSACTIONS } from './data.js';

const KEY = 'hearth-budget-v1';

function freshState() {
  return {
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budgetCents])),
    goals: SEED_GOALS.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.goals)) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable: the site still works for this visit.
  }
}

export function resetState() {
  const state = freshState();
  saveState(state);
  return state;
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, name: id, color: '#57534e' };
}

export function totalIncome(state) {
  return state.transactions.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amountCents, 0);
}

export function totalSpent(state, { includeSavings = false } = {}) {
  return state.transactions
    .filter((t) => t.kind === 'expense' && (includeSavings || t.category !== 'savings'))
    .reduce((s, t) => s + t.amountCents, 0);
}

export function spentByCategory(state) {
  const out = {};
  for (const t of state.transactions) {
    if (t.kind !== 'expense' || t.category === 'savings') continue;
    out[t.category] = (out[t.category] || 0) + t.amountCents;
  }
  return out;
}

export function addTransaction(state, { date, kind, category, note, amountCents }) {
  const id = `u${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  state.transactions.push({ id, date, kind, category, note, amountCents });
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  saveState(state);
  return id;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState(state);
}

export function setBudget(state, categoryId, cents) {
  state.budgets[categoryId] = cents;
  saveState(state);
}

export function addToGoal(state, goalId, cents) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (goal) goal.savedCents += cents;
  saveState(state);
}

export function addGoal(state, { name, targetCents }) {
  const id = `g${Date.now().toString(36)}`;
  state.goals.push({ id, name, targetCents, savedCents: 0, note: '' });
  saveState(state);
  return id;
}
