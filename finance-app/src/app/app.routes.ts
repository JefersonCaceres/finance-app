import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/finance/pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/finance/pages/settings/settings')
        .then(m => m.Settings)
  },
  {
    path: 'expenses',
    loadComponent: () =>
      import('./features/finance/pages/expenses/expenses')
        .then(m => m.Expenses)
  },
  {
    path: 'goals',
    loadComponent: () =>
      import('./features/finance/pages/goals/goals')
        .then(m => m.Goals)
  },
  {
    path: 'debts',
    loadComponent: () =>
      import('./features/finance/pages/debts/debts')
        .then(m => m.Debts)
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./features/finance/pages/calendar/calendar')
        .then(m => m.Calendar)
  }
];
