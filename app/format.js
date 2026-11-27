// Money and date formatting for Hearth & Ledger. All figures are US dollars.
export function money(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents) / 100;
  return sign + '$' + abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents) / 100;
  return sign + '$' + Math.round(abs).toLocaleString('en-US');
}

export function pct(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Dates in the seed data are ISO "YYYY-MM-DD"; format them without timezone shifts.
export function prettyDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return MONTHS[m - 1] + ' ' + d + ', ' + y;
}

export function shortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return MONTHS[m - 1].slice(0, 3) + ' ' + d;
}

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number);
  return MONTHS[m - 1] + ' ' + y;
}

export function monthShort(key) {
  const [y, m] = key.split('-').map(Number);
  return MONTHS[m - 1].slice(0, 3) + ' ' + String(y).slice(2);
}

export function todayIso() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}
