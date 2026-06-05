export interface DashboardSummary {
  dailyAvailable: number;
  monthlyAvailable: number;
  remainingDays: number;
  status: 'GOOD' | 'WARNING' | 'DANGER';
}
