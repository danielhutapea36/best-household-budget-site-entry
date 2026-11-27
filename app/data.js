// Seed data for Hearth: the Alvarez household's November 2026 budget.
// All names, figures and notes are invented for this demo household.
// Amounts are in cents. Dates are ISO dates in November 2026.

export const MONTH = 'November 2026';
export const MONTH_DAYS = 30;
export const TODAY_DAY = 27;

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#3730a3', budgetCents: 185000 },
  { id: 'groceries', name: 'Groceries', color: '#166534', budgetCents: 85000 },
  { id: 'transport', name: 'Transport', color: '#9a3412', budgetCents: 38000 },
  { id: 'utilities', name: 'Utilities', color: '#075985', budgetCents: 34000 },
  { id: 'dining', name: 'Dining out', color: '#9d174d', budgetCents: 22000 },
  { id: 'entertainment', name: 'Entertainment', color: '#5b21b6', budgetCents: 12000 },
  { id: 'health', name: 'Health', color: '#115e59', budgetCents: 20000 },
  { id: 'clothing', name: 'Clothing', color: '#92400e', budgetCents: 15000 },
  { id: 'kids', name: 'Kids & school', color: '#991b1b', budgetCents: 18000 },
  { id: 'household', name: 'Household', color: '#44403c', budgetCents: 12000 },
  { id: 'personal', name: 'Personal', color: '#86198f', budgetCents: 10000 },
  { id: 'savings', name: 'Savings', color: '#065f46', budgetCents: 150000 },
];

export const SEED_TRANSACTIONS = [
  // Income
  { id: 't01', date: '2026-11-01', kind: 'income', category: 'income', note: 'Paycheck — Maya, school office', amountCents: 340000 },
  { id: 't02', date: '2026-11-01', kind: 'income', category: 'income', note: 'Paycheck — Tom, delivery depot', amountCents: 285000 },
  { id: 't03', date: '2026-11-15', kind: 'income', category: 'income', note: 'Weekend market stall — jam & preserves', amountCents: 32000 },
  { id: 't04', date: '2026-11-15', kind: 'income', category: 'income', note: 'Paycheck — Maya, school office', amountCents: 340000 },
  { id: 't05', date: '2026-11-15', kind: 'income', category: 'income', note: 'Paycheck — Tom, delivery depot', amountCents: 285000 },
  // Housing & utilities
  { id: 't06', date: '2026-11-01', kind: 'expense', category: 'housing', note: 'Monthly rent', amountCents: 185000 },
  { id: 't07', date: '2026-11-03', kind: 'expense', category: 'utilities', note: 'Electricity bill', amountCents: 11800 },
  { id: 't08', date: '2026-11-05', kind: 'expense', category: 'utilities', note: 'Internet — monthly plan', amountCents: 6500 },
  { id: 't09', date: '2026-11-06', kind: 'expense', category: 'utilities', note: 'Water bill', amountCents: 4600 },
  { id: 't10', date: '2026-11-10', kind: 'expense', category: 'utilities', note: 'Mobile phones — two lines', amountCents: 9000 },
  // Groceries
  { id: 't11', date: '2026-11-02', kind: 'expense', category: 'groceries', note: 'Weekly shop — Riverside Market', amountCents: 21040 },
  { id: 't12', date: '2026-11-07', kind: 'expense', category: 'groceries', note: 'Weekly shop — Riverside Market', amountCents: 18620 },
  { id: 't13', date: '2026-11-09', kind: 'expense', category: 'groceries', note: 'Top-up — milk, bread, fruit', amountCents: 4820 },
  { id: 't14', date: '2026-11-14', kind: 'expense', category: 'groceries', note: 'Weekly shop — Riverside Market', amountCents: 16480 },
  { id: 't15', date: '2026-11-16', kind: 'expense', category: 'groceries', note: 'Bulk rice, oil & pantry staples', amountCents: 9680 },
  { id: 't16', date: '2026-11-21', kind: 'expense', category: 'groceries', note: 'Weekly shop — Riverside Market', amountCents: 19830 },
  { id: 't17', date: '2026-11-23', kind: 'expense', category: 'groceries', note: 'Top-up — vegetables & eggs', amountCents: 4160 },
  { id: 't18', date: '2026-11-26', kind: 'expense', category: 'groceries', note: 'Weekly shop — Riverside Market', amountCents: 17510 },
  // Transport
  { id: 't19', date: '2026-11-04', kind: 'expense', category: 'transport', note: 'Fuel — family car', amountCents: 5200 },
  { id: 't20', date: '2026-11-08', kind: 'expense', category: 'transport', note: 'Bus passes — Maya & Tom', amountCents: 12000 },
  { id: 't21', date: '2026-11-12', kind: 'expense', category: 'transport', note: 'Car insurance — monthly', amountCents: 13200 },
  { id: 't22', date: '2026-11-19', kind: 'expense', category: 'transport', note: 'Fuel — family car', amountCents: 4500 },
  // Dining & entertainment
  { id: 't23', date: '2026-11-06', kind: 'expense', category: 'dining', note: 'Pizza night with the kids', amountCents: 3800 },
  { id: 't24', date: '2026-11-13', kind: 'expense', category: 'dining', note: 'Lunch out — Tom & co-workers', amountCents: 2700 },
  { id: 't25', date: '2026-11-15', kind: 'expense', category: 'dining', note: 'Family dinner — noodle house', amountCents: 6400 },
  { id: 't26', date: '2026-11-22', kind: 'expense', category: 'dining', note: 'Takeaway — Friday treat', amountCents: 5200 },
  { id: 't27', date: '2026-11-02', kind: 'expense', category: 'entertainment', note: 'Streaming — films & shows', amountCents: 3200 },
  { id: 't28', date: '2026-11-14', kind: 'expense', category: 'entertainment', note: 'Cinema — Saturday matinee', amountCents: 2800 },
  { id: 't29', date: '2026-11-20', kind: 'expense', category: 'entertainment', note: 'Paperback — Maya’s book club', amountCents: 2400 },
  // Health, clothing, kids, household, personal
  { id: 't30', date: '2026-11-05', kind: 'expense', category: 'health', note: 'Pharmacy — cough syrup & vitamins', amountCents: 3600 },
  { id: 't31', date: '2026-11-11', kind: 'expense', category: 'health', note: 'Dentist check-up — Leo', amountCents: 12000 },
  { id: 't32', date: '2026-11-17', kind: 'expense', category: 'health', note: 'Gym — monthly membership', amountCents: 4500 },
  { id: 't33', date: '2026-11-09', kind: 'expense', category: 'clothing', note: 'School shoes — Ana', amountCents: 6800 },
  { id: 't34', date: '2026-11-18', kind: 'expense', category: 'clothing', note: 'Winter jacket — Tom', amountCents: 8500 },
  { id: 't35', date: '2026-11-03', kind: 'expense', category: 'kids', note: 'School lunches — two weeks', amountCents: 9500 },
  { id: 't36', date: '2026-11-10', kind: 'expense', category: 'kids', note: 'Notebooks & stationery', amountCents: 4200 },
  { id: 't37', date: '2026-11-07', kind: 'expense', category: 'household', note: 'Cleaning supplies', amountCents: 5800 },
  { id: 't38', date: '2026-11-21', kind: 'expense', category: 'household', note: 'Light bulbs & detergent', amountCents: 4200 },
  { id: 't39', date: '2026-11-08', kind: 'expense', category: 'personal', note: 'Haircut — Maya', amountCents: 3500 },
  { id: 't40', date: '2026-11-24', kind: 'expense', category: 'personal', note: 'Haircut — Tom', amountCents: 2200 },
  // Savings
  { id: 't41', date: '2026-11-01', kind: 'expense', category: 'savings', note: 'Transfer to emergency fund', amountCents: 150000 },
];

export const SEED_GOALS = [
  { id: 'g1', name: 'Emergency fund', targetCents: 1000000, savedCents: 640000, note: 'Six months of essentials, for peace of mind.' },
  { id: 'g2', name: 'Family holiday', targetCents: 300000, savedCents: 185000, note: 'A week by the coast next summer — train tickets and a small cottage.' },
  { id: 'g3', name: 'New washing machine', targetCents: 65000, savedCents: 42000, note: 'The old one rattles on spin cycle. Replace before it gives up.' },
  { id: 'g4', name: 'Christmas gifts', targetCents: 50000, savedCents: 31000, note: 'Gifts for family and the kids, bought early to spread the cost.' },
];

export const SEED_TIPS = [
  'Pay yourself first: move savings on payday, before spending starts.',
  'A weekly shop with a list beats three small top-up trips.',
  'Review subscriptions once a month — cancel the ones nobody opened.',
  'Cook one extra portion and freeze it: a free dinner next week.',
  'Set a dining-out budget and check it before the weekend, not after.',
];
