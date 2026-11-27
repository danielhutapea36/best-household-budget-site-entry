// The other Hearth pages: transactions, budgets, goals and insights.
// Each page is a function of the state; forms write through the store and
// the router re-renders, so every control does what it says.

import { CATEGORIES, MONTH, MONTH_DAYS, SEED_TIPS, TODAY_DAY } from './data.js';
import {
  addGoal, addToGoal, addTransaction, categoryById, deleteTransaction,
  resetState, setBudget, spentByCategory, totalIncome, totalSpent,
} from './store.js';
import { escapeHtml, money, monthDay, pct } from './format.js';
import { barRow } from './charts.js';

function categoryOptions(selected) {
  return CATEGORIES.map((c) => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('');
}

export function transactionsPage(state, filter = 'all') {
  const byCat = spentByCategory(state);
  const list = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .filter((t) => filter === 'all' || (filter === 'income' ? t.kind === 'income' : filter === 'expense' ? t.kind === 'expense' : t.category === filter));
  const rows = list.map((t) => {
    const label = t.kind === 'income' ? 'Income' : categoryById(t.category).name;
    return `<tr>
      <td>${monthDay(t.date)}</td>
      <td>${escapeHtml(t.note)}</td>
      <td class="hide-phone"><span class="pill cat-${t.category}">${escapeHtml(label)}</span></td>
      <td class="amt num ${t.kind === 'income' ? 'in' : 'out'}">${t.kind === 'income' ? '+' : '−'}${money(t.amountCents)}</td>
      <td><button class="btn danger small" data-delete="${t.id}" type="button">Delete</button></td>
    </tr>`;
  }).join('');

  const chips = [['all', 'All'], ['income', 'Income'], ['expense', 'Spending'],
    ...CATEGORIES.filter((c) => c.id !== 'savings').map((c) => [c.id, c.name])]
    .map(([id, name]) => `<a href="#/transactions/${id}" class="${filter === id ? 'active' : ''}">${escapeHtml(name)}</a>`)
    .join('');

  return `
  <div class="page-head">
    <div><h1>Transactions</h1>
    <p class="lede">Every payment in and out for ${MONTH}. Add one below and it counts everywhere at once.</p></div>
    <span class="month-chip">${list.length} shown</span>
  </div>

  <div class="filters" role="group" aria-label="Filter transactions">${chips}</div>

  <div class="grid grid-2">
    <section class="card">
      <h2>Add a transaction</h2>
      <form id="add-form">
        <div class="form-grid">
          <div class="field"><label for="f-date">Date</label><input id="f-date" name="date" type="date" value="2026-11-27" required></div>
          <div class="field"><label for="f-amount">Amount ($)</label><input id="f-amount" name="amount" type="number" min="0.01" step="0.01" placeholder="25.00" required></div>
          <div class="field"><label for="f-kind">Type</label><select id="f-kind" name="kind"><option value="expense">Spending</option><option value="income">Income</option></select></div>
          <div class="field"><label for="f-cat">Category</label><select id="f-cat" name="category">${categoryOptions('groceries')}</select></div>
        </div>
        <div class="field"><label for="f-note">What was it?</label><input id="f-note" name="note" type="text" maxlength="80" placeholder="e.g. Weekly shop — Riverside Market" required></div>
        <button class="btn" type="submit">Add transaction</button>
      </form>
    </section>
    <section class="card">
      <h2>Month totals</h2>
      <p><strong class="num">${money(totalIncome(state))}</strong> came in and <strong class="num">${money(totalSpent(state, { includeSavings: true }))}</strong> went out, including <strong class="num">${money(totalSpent(state, { includeSavings: true }) - totalSpent(state))}</strong> moved to savings.</p>
      <p class="muted">Groceries are the biggest day-to-day cost at <strong class="num">${money(byCat.groceries || 0)}</strong>. Housing is the biggest single line at <strong class="num">${money(byCat.housing || 0)}</strong> — rent on the 1st.</p>
      <p class="small">Everything is stored in this browser only. Use “Delete” to remove a line; the totals update straight away.</p>
    </section>
  </div>

  <section class="card" style="margin-top:16px">
    <table>
      <thead><tr><th>Date</th><th>What</th><th class="hide-phone">Category</th><th class="amt">Amount</th><th><span class="small">Remove</span></th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5"><p class="empty">Nothing here yet — add the first one above.</p></td></tr>'}</tbody>
    </table>
  </section>`;
}

export function budgetsPage(state) {
  const byCat = spentByCategory(state);
  const rows = CATEGORIES.filter((c) => c.id !== 'savings')
    .map((c) => {
      const spent = byCat[c.id] || 0;
      const budget = state.budgets[c.id] || 0;
      const remaining = budget - spent;
      return `<div class="card" style="margin-bottom:16px">
        <div class="goal-head"><h2>${escapeHtml(c.name)}</h2>
        <span class="goal-amt num">${money(spent)} <span class="muted" style="font-size:15px">of ${money(budget)}</span></span></div>
        ${barRow(c.name, spent, budget, c.color, '', false)}
        <p class="small" style="margin-top:8px">${remaining >= 0
          ? `<span class="under">${money(remaining)} left</span> for the rest of the month.`
          : `<span class="over">${money(-remaining)} over budget</span> — move money from another category or trim next week’s shop.`}</p>
        <form class="inline-form" data-budget="${c.id}">
          <label for="b-${c.id}">Monthly budget ($)</label>
          <input id="b-${c.id}" name="budget" type="number" min="0" step="1" value="${Math.round(budget / 100)}" style="width:110px">
          <button class="btn secondary small" type="submit">Save</button>
        </form>
      </div>`;
    }).join('');

  const totalBudget = CATEGORIES.filter((c) => c.id !== 'savings').reduce((s, c) => s + (state.budgets[c.id] || 0), 0);
  const totalSpentNow = totalSpent(state);
  return `
  <div class="page-head">
    <div><h1>Monthly budgets</h1>
    <p class="lede">A limit for each category, set once and checked all month. Change any figure — the bars and the dashboard follow.</p></div>
    <span class="month-chip">${money(totalSpentNow)} of ${money(totalBudget)} spent</span>
  </div>
  <div class="callout" style="margin-bottom:16px"><strong>How it works:</strong> the bar fills as spending lands. Amber means nearly there, red means over. Groceries are the one to watch this month.</div>
  ${rows}`;
}

export function goalsPage(state) {
  const cards = state.goals.map((g) => {
    const p = pct(g.savedCents, g.targetCents);
    return `<div class="card">
      <div class="goal-head"><h2>${escapeHtml(g.name)}</h2><span class="goal-amt num">${money(g.savedCents)}</span></div>
      <p class="goal-meta">Goal ${money(g.targetCents)} · ${p}% there · ${money(g.targetCents - g.savedCents)} to go</p>
      <div class="bar-track"><div class="bar-fill teal" style="width:${Math.min(p, 100)}%"></div></div>
      ${g.note ? `<p class="small" style="margin-top:10px">${escapeHtml(g.note)}</p>` : ''}
      <form class="inline-form" data-goal="${g.id}" style="margin-top:12px">
        <label for="a-${g.id}">Add savings ($)</label>
        <input id="a-${g.id}" name="amount" type="number" min="1" step="1" placeholder="50" style="width:100px" required>
        <button class="btn secondary small" type="submit">Add to goal</button>
      </form>
    </div>`;
  }).join('');

  const totalSaved = state.goals.reduce((s, g) => s + g.savedCents, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.targetCents, 0);
  return `
  <div class="page-head">
    <div><h1>Savings goals</h1>
    <p class="lede">What the household is saving towards, and how close each goal is.</p></div>
    <span class="month-chip num">${money(totalSaved)} of ${money(totalTarget)}</span>
  </div>
  <div class="grid grid-2">${cards}</div>
  <section class="card" style="margin-top:16px">
    <h2>Start a new goal</h2>
    <form id="goal-form" class="form-grid">
      <div class="field"><label for="g-name">Goal name</label><input id="g-name" name="name" type="text" maxlength="60" placeholder="e.g. New bikes for the kids" required></div>
      <div class="field"><label for="g-target">Target amount ($)</label><input id="g-target" name="target" type="number" min="1" step="1" placeholder="400" required></div>
      <button class="btn" type="submit" style="grid-column:1 / -1; justify-self:start">Create goal</button>
    </form>
  </section>`;
}

export function insightsPage(state) {
  const byCat = spentByCategory(state);
  const spent = totalSpent(state);
  const income = totalIncome(state);
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  const topCat = categoryById(top[0]);
  const dailyAvg = Math.round(spent / TODAY_DAY);
  const projected = Math.round((spent / TODAY_DAY) * MONTH_DAYS);
  const overCats = CATEGORIES.filter((c) => c.id !== 'savings' && (byCat[c.id] || 0) > (state.budgets[c.id] || 0));
  const daysLeft = MONTH_DAYS - TODAY_DAY;
  const tips = SEED_TIPS.map((t) => `<li>${escapeHtml(t)}</li>`).join('');

  return `
  <div class="page-head">
    <div><h1>Insights</h1>
    <p class="lede">What November’s figures actually say — and what to do about them.</p></div>
    <span class="month-chip">${daysLeft} days left</span>
  </div>

  <div class="grid grid-3">
    <section class="card"><p class="stat-label">Biggest cost</p><p class="stat-value num">${money(top[1])}</p><p class="stat-sub">${escapeHtml(topCat.name)} — ${pct(top[1], spent)}% of spending</p></section>
    <section class="card"><p class="stat-label">Daily pace</p><p class="stat-value num">${money(dailyAvg)}</p><p class="stat-sub">a day so far, on average</p></section>
    <section class="card"><p class="stat-label">Projected month</p><p class="stat-value num">${money(projected)}</p><p class="stat-sub">if the same pace holds to the 30th</p></section>
  </div>

  <section class="card" style="margin-top:16px">
    <h2>What stands out</h2>
    <div class="insight"><div class="insight-icon red" aria-hidden="true">!</div><div>
      <h3>Groceries are over budget</h3>
      <p>${money(byCat.groceries || 0)} spent against a ${money(state.budgets.groceries || 0)} budget — ${money((byCat.groceries || 0) - (state.budgets.groceries || 0))} over, with ${daysLeft} days to go. One smaller shop and a pantry week would bring it back in line.</p>
    </div></div>
    <div class="insight"><div class="insight-icon green" aria-hidden="true">&#10003;</div><div>
      <h3>Savings are on track</h3>
      <p>${money(totalSpent(state, { includeSavings: true }) - spent)} moved to the emergency fund on the 1st — ${pct(totalSpent(state, { includeSavings: true }) - spent, income)}% of income, before any spending happened.</p>
    </div></div>
    <div class="insight"><div class="insight-icon" aria-hidden="true">&#9788;</div><div>
      <h3>${overCats.length} ${overCats.length === 1 ? 'category is' : 'categories are'} over budget</h3>
      <p>${overCats.map((c) => escapeHtml(c.name)).join(', ') || 'None'} — check the Budgets page to move money between categories or raise a limit deliberately, not by accident.</p>
    </div></div>
    <div class="insight"><div class="insight-icon green" aria-hidden="true">&#8635;</div><div>
      <h3>Dining out is under control</h3>
      <p>${money(byCat.dining || 0)} of a ${money(state.budgets.dining || 0)} budget. The Friday takeaway is the household’s one planned treat — keeping it planned is what keeps it small.</p>
    </div></div>
  </section>

  <div class="grid grid-2" style="margin-top:16px">
    <section class="card">
      <h2>Five habits that work</h2>
      <ol class="tip-list">${tips}</ol>
    </section>
    <section class="card">
      <h2>How Hearth works</h2>
      <p><strong>Dashboard</strong> shows the month at a glance. <strong>Transactions</strong> records every payment. <strong>Budgets</strong> sets a limit per category. <strong>Goals</strong> tracks saving. <strong>Insights</strong> reads the figures back to you.</p>
      <p>Everything is saved in this browser, so it is here next time you open it. To start over with the demo figures, use the button below.</p>
      <div class="btn-row"><button class="btn danger" id="reset-demo" type="button">Reset demo data</button></div>
    </section>
  </div>`;
}

export function bindPageEvents(state, rerender) {
  const addForm = document.getElementById('add-form');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(addForm);
      const amount = Math.round(Number(data.get('amount')) * 100);
      if (!amount || amount <= 0) return;
      addTransaction(state, {
        date: String(data.get('date') || '2026-11-27'),
        kind: String(data.get('kind')),
        category: String(data.get('category')),
        note: String(data.get('note') || '').trim() || 'Untitled',
        amountCents: amount,
      });
      rerender();
    });
  }
  document.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteTransaction(state, btn.getAttribute('data-delete'));
      rerender();
    });
  });
  document.querySelectorAll('[data-budget]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cents = Math.round(Number(new FormData(form).get('budget')) * 100);
      if (Number.isFinite(cents) && cents >= 0) {
        setBudget(state, form.getAttribute('data-budget'), cents);
        rerender();
      }
    });
  });
  document.querySelectorAll('[data-goal]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cents = Math.round(Number(new FormData(form).get('amount')) * 100);
      if (cents > 0) {
        addToGoal(state, form.getAttribute('data-goal'), cents);
        rerender();
      }
    });
  });
  const goalForm = document.getElementById('goal-form');
  if (goalForm) {
    goalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(goalForm);
      const target = Math.round(Number(data.get('target')) * 100);
      const name = String(data.get('name') || '').trim();
      if (name && target > 0) {
        addGoal(state, { name, targetCents: target });
        rerender();
      }
    });
  }
  const reset = document.getElementById('reset-demo');
  if (reset) {
    reset.addEventListener('click', () => {
      if (window.confirm('Reset all figures back to the demo household’s November budget?')) {
        resetState();
        window.location.reload();
      }
    });
  }
}
