// Seed records for the Marlow household. Amounts are integer cents; outflows are
// positive spending, income is positive income. All of it is the household's own
// invented-but-realistic bookkeeping for November 2026, used as the first-run data.
export const HOUSEHOLD = {
  name: 'The Marlow household',
  members: 'Maya & Tom Marlow, with June (9) and Leo (6)',
  home: 'A three-bedroom house in Maplewood, with a mortgage, two cars and a dog named Biscuit.',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#1d4a38' },
  { id: 'groceries', label: 'Groceries', color: '#33617a' },
  { id: 'utilities', label: 'Utilities', color: '#7a5a12' },
  { id: 'transport', label: 'Transport', color: '#5b4a8a' },
  { id: 'dining', label: 'Dining out', color: '#c96f3f' },
  { id: 'kids', label: 'Kids & school', color: '#b3402e' },
  { id: 'health', label: 'Health', color: '#2e7d6b' },
  { id: 'fun', label: 'Fun & streaming', color: '#8a6d2f' },
  { id: 'clothing', label: 'Clothing', color: '#6b5e4f' },
  { id: 'savings', label: 'Savings', color: '#1d4a38' },
  { id: 'other', label: 'Everything else', color: '#8a8a7a' },
];

export const MONTHS = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
export const CURRENT_MONTH = '2026-11';

// Monthly budget per category, in cents.
export const BUDGETS = [
  { category: 'housing', amount: 195000 },
  { category: 'groceries', amount: 72000 },
  { category: 'utilities', amount: 40000 },
  { category: 'transport', amount: 48000 },
  { category: 'dining', amount: 26000 },
  { category: 'kids', amount: 42000 },
  { category: 'health', amount: 35000 },
  { category: 'fun', amount: 18000 },
  { category: 'clothing', amount: 15000 },
  { category: 'savings', amount: 120000 },
  { category: 'other', amount: 22000 },
];

// Income lines for November 2026, in cents. They total $8,370.00.
export const INCOME = [
  { source: "Maya's salary — school district", amount: 412000, date: '2026-11-06' },
  { source: "Tom's salary — logistics depot", amount: 358000, date: '2026-11-06' },
  { source: 'Tom weekend shifts (overtime)', amount: 42000, date: '2026-11-20' },
  { source: 'Maya tutoring, two evenings', amount: 18500, date: '2026-11-18' },
  { source: 'Sold the old stroller', amount: 6500, date: '2026-11-14' },
];

// November 2026 spending, in cents. They total $5,781.62, so $2,588.38 of the
// month's income is still unassigned. The app sorts by date when it shows them.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', payee: 'Maplewood Mortgage Co.', category: 'housing', amount: 195000, note: 'Monthly mortgage' },
  { id: 't02', date: '2026-11-01', payee: 'City Water & Sewer', category: 'utilities', amount: 6840, note: 'October usage' },
  { id: 't03', date: '2026-11-02', payee: 'Greenline Market', category: 'groceries', amount: 12450, note: 'Weekly shop — produce, pantry' },
  { id: 't04', date: '2026-11-02', payee: 'Shell — Route 9', category: 'transport', amount: 5230, note: 'Tom’s car, full tank' },
  { id: 't05', date: '2026-11-03', payee: 'Bright Smiles Dentist', category: 'health', amount: 12000, note: 'Leo’s checkup + cleaning' },
  { id: 't06', date: '2026-11-04', payee: 'Paws & Claws Vet', category: 'health', amount: 8750, note: 'Biscuit’s annual shots' },
  { id: 't07', date: '2026-11-05', payee: 'Maplewood Elementary', category: 'kids', amount: 9500, note: 'June’s field-trip fund' },
  { id: 't08', date: '2026-11-06', payee: 'Greenline Market', category: 'groceries', amount: 11200, note: 'Weekly shop' },
  { id: 't09', date: '2026-11-07', payee: 'Luigi’s Trattoria', category: 'dining', amount: 6845, note: 'Friday pizza night, family of four' },
  { id: 't10', date: '2026-11-08', payee: 'Northlight Electric', category: 'utilities', amount: 14230, note: 'October bill' },
  { id: 't11', date: '2026-11-09', payee: 'Greenline Market', category: 'groceries', amount: 9800, note: 'Weekly shop' },
  { id: 't12', date: '2026-11-10', payee: 'Quick Lube & Tires', category: 'transport', amount: 8995, note: 'Oil change, Maya’s car' },
  { id: 't13', date: '2026-11-11', payee: 'Riverbend Cinema', category: 'fun', amount: 4200, note: 'Saturday matinee, four tickets' },
  { id: 't14', date: '2026-11-12', payee: 'CVS Pharmacy', category: 'health', amount: 3420, note: 'Prescriptions + vitamins' },
  { id: 't15', date: '2026-11-13', payee: 'Greenline Market', category: 'groceries', amount: 12400, note: 'Weekly shop, Thanksgiving groceries' },
  { id: 't16', date: '2026-11-14', payee: 'Old Navy', category: 'clothing', amount: 11240, note: 'Winter coats for June and Leo' },
  { id: 't17', date: '2026-11-15', payee: 'Shell — Route 9', category: 'transport', amount: 4875, note: 'Maya’s car, full tank' },
  { id: 't18', date: '2026-11-16', payee: 'Sunrise Internet', category: 'utilities', amount: 7999, note: 'Monthly broadband' },
  { id: 't19', date: '2026-11-17', payee: 'Greenline Market', category: 'groceries', amount: 11800, note: 'Weekly shop' },
  { id: 't20', date: '2026-11-18', payee: 'Noodle House', category: 'dining', amount: 5240, note: 'Takeout on a late work night' },
  { id: 't21', date: '2026-11-19', payee: 'Piano Lessons — Ms. Ade', category: 'kids', amount: 14000, note: 'June, four November lessons' },
  { id: 't22', date: '2026-11-20', payee: 'Greenline Market', category: 'groceries', amount: 10400, note: 'Weekly shop' },
  { id: 't23', date: '2026-11-21', payee: 'Maplewood Soccer Club', category: 'kids', amount: 8500, note: 'Leo’s winter season fee' },
  { id: 't24', date: '2026-11-21', payee: 'Maplewood Hardware', category: 'other', amount: 6420, note: 'Light bulbs, furnace filter, walkway salt' },
  { id: 't25', date: '2026-11-20', payee: 'Sunrise Mobile', category: 'utilities', amount: 9650, note: 'Two lines, monthly' },
  { id: 't26', date: '2026-11-22', payee: 'Streaming bundle', category: 'fun', amount: 3298, note: 'Movies + kids’ shows, monthly' },
  { id: 't27', date: '2026-11-23', payee: 'Greenline Market', category: 'groceries', amount: 13900, note: 'Thanksgiving week — turkey, sides' },
  { id: 't28', date: '2026-11-24', payee: 'Shell — Route 9', category: 'transport', amount: 5120, note: 'Tom’s car, full tank' },
  { id: 't29', date: '2026-11-25', payee: 'Corner Bakery Café', category: 'dining', amount: 3860, note: 'Thanksgiving pies to share' },
  { id: 't30', date: '2026-11-25', payee: 'Maplewood Home Insurance', category: 'other', amount: 12800, note: 'Monthly slice of the annual premium' },
  { id: 't31', date: '2026-11-26', payee: 'Greenline Market', category: 'groceries', amount: 8200, note: 'Leftovers week top-up' },
  { id: 't32', date: '2026-11-27', payee: 'Hearth Savings Account', category: 'savings', amount: 120000, note: 'Monthly transfer on payday' },
];

// Savings goals, in cents.
export const GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 1000000, saved: 724000, note: 'Six months of essentials, for the what-ifs.' },
  { id: 'g2', name: 'Summer road trip', target: 350000, saved: 161500, note: 'Two weeks down the coast next July — gas, motels, ice cream.' },
  { id: 'g3', name: 'New car down payment', target: 800000, saved: 248000, note: 'Replace Maya’s 2013 sedan before it gives up.' },
  { id: 'g4', name: 'Kitchen refresh', target: 500000, saved: 92000, note: 'New counters and a dishwasher that drains.' },
];

// Recurring bills. dueDay is the day of the month; status is the November state.
export const BILLS = [
  { id: 'b1', name: 'Mortgage — Maplewood Mortgage Co.', amount: 195000, dueDay: 1, status: 'paid', autopay: true },
  { id: 'b2', name: 'City Water & Sewer', amount: 6840, dueDay: 3, status: 'paid', autopay: false },
  { id: 'b3', name: 'Northlight Electric', amount: 14230, dueDay: 10, status: 'paid', autopay: true },
  { id: 'b4', name: 'Sunrise Internet', amount: 7999, dueDay: 16, status: 'paid', autopay: true },
  { id: 'b5', name: 'Mobile phones — two lines', amount: 9650, dueDay: 20, status: 'paid', autopay: true },
  { id: 'b6', name: 'Home insurance', amount: 12800, dueDay: 25, status: 'paid', autopay: true },
  { id: 'b7', name: 'Car insurance — two cars', amount: 16400, dueDay: 28, status: 'due', autopay: true },
  { id: 'b8', name: 'Trash & recycling', amount: 4200, dueDay: 30, status: 'due', autopay: false },
];

// Six months of income vs spending, in cents, for the Reports page.
// November's spending is the sum of the transactions above: $5,781.62.
export const MONTHLY_HISTORY = [
  { month: '2026-06', income: 812000, spent: 589400 },
  { month: '2026-07', income: 798500, spent: 612300 },
  { month: '2026-08', income: 824000, spent: 631100 },
  { month: '2026-09', income: 789000, spent: 598700 },
  { month: '2026-10', income: 831500, spent: 624800 },
  { month: '2026-11', income: 837000, spent: 578162 },
];
