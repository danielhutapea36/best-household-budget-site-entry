// Dashboard view for Hearth: month summary, spending donut, budget
// progress and recent transactions. All figures come from the state.

import { CATEGORIES, MONTH, MONTH_DAYS, TODAY_DAY } from './data.js';
import { categoryById, spentByCategory, totalIncome, totalSpent } from './store.js';
import { escapeHtml, money, monthDay, pct } from './format.js';
import { barRow, donut } from './charts.js';

export function dashboard(state) {
  const income = totalIncome(state);
  const spent = totalSpent(state);
  const saved = totalSpent(state, { includeSavings: true }) - spent;
  const left = income - spent - saved;
  const byCat = spentByCategory(state);
  const daysLeft = MONTH_DAYS - TODAY_DAY;
  const totalBudget = CATEGORIES.filter((c) => c.id !== 'savings')
    .reduce((s, c) => s + (state.budgets[c.id] || 0), 0);

  const segments = CATEGORIES.filter((c) => c.id !== 'savings' && byCat[c.id])
    .map((c) => ({ name: c.name, value: byCat[c.id], color: c.color }))
    .sort((a, b) => b.value - a.value);
  const top = segments.slice(0, 6);
  const legend = top
    .map((s) => `<li><span class="swatch" style="background:${s.color}"></span>${escapeHtml(s.name)}<span class="lg-amt num">${money(s.value)} · ${pct(s.value, spent)}%</span></li>`)
    .join('');

  const budgetRows = CATEGORIES.filter((c) => c.id !== 'savings')
    .map((c) => ({ cat: c, spent: byCat[c.id] || 0, budget: state.budgets[c.id] || 0 }))
    .sort((a, b) => b.spent / Math.max(b.budget, 1) - a.spent / Math.max(a.budget, 1))
    .slice(0, 5)
    .map((x) => barRow(x.cat.name, x.spent, x.budget, x.cat.color))
    .join('');

  const recent = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6)
    .map((t) => {
      const cat = categoryById(t.category);
      const label = t.kind === 'income' ? 'Income' : cat.name;
      return `<tr><td>${monthDay(t.date)}</td><td>${escapeHtml(t.note)}</td><td class="hide-phone"><span class="pill cat-${t.category}">${escapeHtml(label)}</span></td><td class="amt num ${t.kind === 'income' ? 'in' : 'out'}">${t.kind === 'income' ? '+' : '−'}${money(t.amountCents)}</td></tr>`;
    })
    .join('');

  return `
  <div class="page-head">
    <div><h1>November at a glance</h1>
    <p class="lede">Income, spending and saving for the Alvarez household — ${daysLeft} days left in the month.</p></div>
    <span class="month-chip">${MONTH}</span>
  </div>

  <div class="grid grid-4">
    <section class="card"><p class="stat-label">Income</p><p class="stat-value income num">${money(income)}</p><p class="stat-sub">5 payments in so far</p></section>
    <section class="card"><p class="stat-label">Spent</p><p class="stat-value num">${money(spent)}</p><p class="stat-sub">${pct(spent, totalBudget)}% of the ${money(totalBudget)} plan</p></section>
    <section class="card"><p class="stat-label">Left to spend</p><p class="stat-value ${left < 0 ? 'bad' : 'good'} num">${money(left)}</p><p class="stat-sub">${money(Math.max(left, 0))} after savings</p></section>
    <section class="card"><p class="stat-label">Saved this month</p><p class="stat-value good num">${money(saved)}</p><p class="stat-sub">${pct(saved, income)}% of income · on track</p></section>
  </div>

  <div class="grid grid-2" style="margin-top:16px">
    <section class="card">
      <h2>Where the money went</h2>
      <p class="muted small">Spending by category, not counting savings.</p>
      <div class="donut-wrap">${donut(segments)}
        <ul class="legend">${legend}</ul>
      </div>
    </section>
    <section class="card">
      <h2>Budgets to watch</h2>
      <p class="muted small">Closest to — or over — their monthly limit.</p>
      ${budgetRows}
      <p style="margin-top:14px"><a class="btn secondary small" href="#/budgets">See all budgets &rarr;</a></p>
    </section>
  </div>

  <section class="card" style="margin-top:16px">
    <h2>Recent transactions</h2>
    <table>
      <thead><tr><th>Date</th><th>What</th><th class="hide-phone">Category</th><th class="amt">Amount</th></tr></thead>
      <tbody>${recent}</tbody>
    </table>
    <p style="margin-top:14px"><a class="btn secondary small" href="#/transactions">All transactions &rarr;</a></p>
  </section>`;
}
