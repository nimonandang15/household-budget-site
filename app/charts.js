// Small hand-rolled SVG charts for Hearth & Ledger: a donut of spending by
// category and grouped bars of income vs spending. No library, no network.
import { money0 } from './format.js';

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const [x1, y1] = polar(cx, cy, rOuter, startAngle);
  const [x2, y2] = polar(cx, cy, rOuter, endAngle);
  const [x3, y3] = polar(cx, cy, rInner, endAngle);
  const [x4, y4] = polar(cx, cy, rInner, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} A ${rInner} ${rInner} 0 ${large} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z`;
}

// slices: [{label, value, color}]. Returns an SVG string with a centre total.
export function donut(slices, totalCents, size = 260) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 6;
  const rInner = rOuter - 34;
  let angle = 0;
  const parts = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const sweep = (s.value / total) * 360;
      const gap = sweep > 4 ? 1.5 : 0;
      const path = arcPath(cx, cy, rOuter, rInner, angle + gap / 2, angle + sweep - gap / 2);
      angle += sweep;
      return `<path d="${path}" fill="${s.color}"><title>${esc(s.label)} — ${money0(s.value)}</title></path>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category, donut chart">${parts}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="22" font-weight="700" fill="#143627">${money0(totalCents)}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="#5c6a62">spent in November</text></svg>`;
}

// bars: [{label, income, spent}] in cents. Grouped vertical bars, income green,
// spending terracotta, with a value label on each bar.
export function incomeBars(bars, width = 640, height = 260) {
  const max = Math.max(...bars.map((b) => Math.max(b.income, b.spent)), 1);
  const padTop = 26;
  const padBottom = 26;
  const padLeft = 8;
  const chartH = height - padTop - padBottom;
  const slot = (width - padLeft * 2) / bars.length;
  const barW = Math.min(34, slot / 3.2);
  const rects = bars.map((b, i) => {
    const x = padLeft + slot * i + slot / 2;
    const hIn = Math.max(2, (b.income / max) * chartH);
    const hSp = Math.max(2, (b.spent / max) * chartH);
    const yBase = padTop + chartH;
    return `<rect x="${(x - barW - 3).toFixed(1)}" y="${(yBase - hIn).toFixed(1)}" width="${barW}" height="${hIn.toFixed(1)}" rx="3" fill="#1d4a38"><title>${esc(b.label)} income ${money0(b.income)}</title></rect>`
      + `<rect x="${(x + 3).toFixed(1)}" y="${(yBase - hSp).toFixed(1)}" width="${barW}" height="${hSp.toFixed(1)}" rx="3" fill="#c96f3f"><title>${esc(b.label)} spent ${money0(b.spent)}</title></rect>`
      + `<text x="${x.toFixed(1)}" y="${(yBase - hIn - 6).toFixed(1)}" text-anchor="middle" font-size="11" fill="#1d4a38">${money0(b.income)}</text>`
      + `<text x="${x.toFixed(1)}" y="${(height - 6).toFixed(1)}" text-anchor="middle" font-size="12" fill="#22302a">${esc(b.label)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Income versus spending by month, bar chart">${rects}<line x1="${padLeft}" y1="${padTop + chartH}" x2="${width - padLeft}" y2="${padTop + chartH}" stroke="#e4dccb" stroke-width="1"/></svg>`;
}

// Horizontal budget bars are plain HTML in views.js; this helper only keeps the
// spending-by-category bar list used on the Reports page consistent.
export function categoryRows(slices, totalCents) {
  return slices
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((s) => {
      const share = Math.round((s.value / totalCents) * 100);
      return `<div class="budget-row"><div class="row-top"><span class="cat"><span class="dot" style="background:${s.color}"></span>${esc(s.label)}</span><span>${money0(s.value)}</span></div><div class="bar"><i style="width:${share}%;background:${s.color}"></i></div><div class="row-meta"><span>${share}% of spending</span><span>${money0(s.value)} this month</span></div></div>`;
    })
    .join('');
}
