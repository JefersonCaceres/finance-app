import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Expense } from '../models/expense.model';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class Storage {

  private platformId = inject(PLATFORM_ID);

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  save<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;

    localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    if (!this.isBrowser()) return null;

    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) as T : null;
  }

  remove(key: string): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem(key);
  }

  clear(): void {
    if (!this.isBrowser()) return;

    localStorage.clear();
  }

  hasMinimumConfiguration(): boolean {
  const settings = this.get('settings');
  const fixedExpenses = this.get<unknown[]>('fixedExpenses');

  return !!settings && !!fixedExpenses && fixedExpenses.length > 0;
  }

  removeOldExpenses(): void {
    const expenses = this.get<Expense[]>(STORAGE_KEYS.EXPENSES) || [];

    const today = new Date();

    const validExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const diffInMs = today.getTime() - expenseDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      return diffInDays <= 90;
    });

    this.save(STORAGE_KEYS.EXPENSES, validExpenses);
  }
  
}