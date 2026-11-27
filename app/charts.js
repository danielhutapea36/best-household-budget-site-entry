// Small SVG charts for Hearth: a spending donut and horizontal bars.
// Everything is drawn from the figures passed in — no libraries.

export function donut(segments, size = 220) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const stroke = 30;
  if (!total) {
    return `<svg class="donut" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="No spending yet">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#efe9dd" stroke-width="${stroke}"></circle>
    </svg>`;
  }
  let offset = 25; // start at the top
  const arcs = segments
    .map((seg) => {
      const frac = seg.value / total;
      const len = frac * 100;
      const dash = `${Math.max(len - 0.6, 0.1)} ${100 - Math.max(len - 0.6, 0.1)}`;
      const circle = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${stroke}" stroke-dasharray="${dash}" stroke-dashoffset="${offset}" pathLength="100"></circle>`;
      offset -= len;
      return circle;
    })
    .join('');
  return `<svg class="donut" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category">
    ${arcs}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="13" fill="#57534e">Spent so far</text>
    <text class="donut-centre" x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="22" fill="#1c1917">${segTotalLabel(total)}</text>
  </svg>`;
}

function segTotalLabel(totalCents) {
  return `$${(totalCents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function barRow(name, spent, budget, color, overNote = '', showName = true) {
  const pct = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
  const over = spent > budget;
  const cls = over ? 'red' : pct >= 85 ? 'amber' : '';
  const money = (c) => `$${(c / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  const label = showName
    ? `<div class="bar-row"><span class="bar-name">${name}</span><span class="bar-amt num">${money(spent)} of ${money(budget)}${over ? ` <span class="over">· ${money(spent - budget)} over</span>` : ''}${overNote}</span></div>`
    : `<div class="bar-row"><span class="bar-amt num" style="margin-left:auto">${money(spent)} of ${money(budget)}${over ? ` <span class="over">· ${money(spent - budget)} over</span>` : ''}${overNote}</span></div>`;
  return `<div class="budget-item">
    ${label}
    <div class="bar-track"><div class="bar-fill ${cls}" style="width:${pct}%; background:${over ? '' : color}"></div></div>
  </div>`;
}
