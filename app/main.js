// Hearth router: hash routes for each page, with the nav kept in step.
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { loadState } from './store.js';
import { dashboard } from './views.js';
import { bindPageEvents, budgetsPage, goalsPage, insightsPage, transactionsPage } from './views-pages.js';

const app = document.getElementById('app');
const state = loadState();

function notFound() {
  return `<div class="page-head"><div><h1>Page not found</h1>
  <p class="lede">There is no page at this address. Start from the dashboard instead.</p></div></div>
  <p><a class="btn" href="#/">Back to the dashboard</a></p>`;
}

function render() {
  window.__shotReady = false;
  const hash = window.location.hash || '#/';
  const match = hash.match(/^#\/([a-z]*)(\/([^/?#]+))?/);
  const page = match ? match[1] : '';
  const arg = match && match[3] ? decodeURIComponent(match[3]) : 'all';

  let html;
  let nav = 'dashboard';
  if (page === '' || page === 'dashboard') {
    html = dashboard(state);
    document.title = 'Hearth — Household Budget';
  } else if (page === 'transactions') {
    html = transactionsPage(state, arg);
    nav = 'transactions';
    document.title = 'Transactions | Hearth';
  } else if (page === 'budgets') {
    html = budgetsPage(state);
    nav = 'budgets';
    document.title = 'Budgets | Hearth';
  } else if (page === 'goals') {
    html = goalsPage(state);
    nav = 'goals';
    document.title = 'Savings goals | Hearth';
  } else if (page === 'insights') {
    html = insightsPage(state);
    nav = 'insights';
    document.title = 'Insights | Hearth';
  } else {
    html = notFound();
    document.title = 'Not found | Hearth';
  }

  app.innerHTML = html;
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-nav') === nav);
  });
  bindPageEvents(state, render);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
