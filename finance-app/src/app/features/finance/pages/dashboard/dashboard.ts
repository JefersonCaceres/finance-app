import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Storage } from '../../services/storage';
import { Settings } from '../../models/settings.model';
import { FixedExpense } from '../../models/fixed-expense.model';
import { STORAGE_KEYS } from '../../../../core/constants/storage-keys';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  configured = false;

  monthlyAvailable = 0;
  dailyAvailable = 0;
  displayDailyAvailable = 0;
  isOverBudget = false;
  userName = '';
  remainingDays = 0;
  status = '🟢 Vas bien';
  latestExpenses: Expense[] = [];

  constructor(private storage: Storage) {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    

    const settings = this.storage.get<Settings>(STORAGE_KEYS.SETTINGS);
    const fixedExpenses = this.storage.get<FixedExpense[]>(STORAGE_KEYS.FIXED_EXPENSES) || [];

    this.configured = !!settings && fixedExpenses.length > 0;
    

    if (!settings || fixedExpenses.length === 0) {
      return;
    }

    const totalIncome = settings.salaryIncome + settings.extraIncome;
    const totalFixedExpenses = fixedExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    const expenses = this.storage.get<Expense[]>(STORAGE_KEYS.EXPENSES) || [];
    this.latestExpenses = expenses.slice(0, 5); 
    
    const totalExpenses = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

this.monthlyAvailable = totalIncome - totalFixedExpenses - totalExpenses;

   this.monthlyAvailable = totalIncome - totalFixedExpenses - totalExpenses;
    this.remainingDays = this.calculateRemainingDays(settings.paymentDay);
    this.dailyAvailable = this.remainingDays > 0
      ? Math.floor(this.monthlyAvailable / this.remainingDays)
      : this.monthlyAvailable;
    this.isOverBudget = this.monthlyAvailable < 0;
    this.displayDailyAvailable = Math.max(0, this.dailyAvailable);  
    this.userName = settings?.userName || 'Usuario';

    this.status = this.getStatus();
  }

  private calculateRemainingDays(paymentDay: number): number {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    let nextPaymentDate = new Date(year, month, paymentDay);

    if (today.getDate() >= paymentDay) {
      nextPaymentDate = new Date(year, month + 1, paymentDay);
    }

    const difference = nextPaymentDate.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }

  private getStatus(): string {
    if (this.dailyAvailable >= 30000) {
      return '🟢 Vas bien';
    }

    if (this.dailyAvailable >= 15000) {
      return '🟡 Cuidado';
    }

    return '🔴 Ajusta tus gastos';
  }
}