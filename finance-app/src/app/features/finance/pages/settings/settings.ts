import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Storage } from '../../services/storage';
import { Settings as SettingsModel } from '../../models/settings.model';
import { FixedExpense } from '../../models/fixed-expense.model';
import { STORAGE_KEYS } from '../../../../core/constants/storage-keys';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {

  salaryIncome = 0;
  extraIncome = 0;
  paymentDay = 25;

  fixedExpenseName = '';
  fixedExpenseAmount = 0;

  fixedExpenses: FixedExpense[] = [];

  constructor(private storage: Storage) {
    this.loadData();
  }

  addFixedExpense(): void {
    if (!this.fixedExpenseName || this.fixedExpenseAmount <= 0) {
      return;
    }

    const expense: FixedExpense = {
      id: crypto.randomUUID(),
      name: this.fixedExpenseName,
      amount: this.fixedExpenseAmount
    };

    this.fixedExpenses.push(expense);

    this.fixedExpenseName = '';
    this.fixedExpenseAmount = 0;
  }

  removeFixedExpense(id: string): void {
    this.fixedExpenses = this.fixedExpenses.filter(expense => expense.id !== id);
  }

  saveSettings(): void {
    const settings: SettingsModel = {
      salaryIncome: this.salaryIncome,
      extraIncome: this.extraIncome,
      paymentDay: this.paymentDay,
      createdAt: new Date().toISOString()
    };

    this.storage.save(STORAGE_KEYS.SETTINGS, settings);
    this.storage.save(STORAGE_KEYS.FIXED_EXPENSES, this.fixedExpenses);
  }

  private loadData(): void {
    const settings = this.storage.get<SettingsModel>(STORAGE_KEYS.SETTINGS);
    const fixedExpenses = this.storage.get<FixedExpense[]>(STORAGE_KEYS.FIXED_EXPENSES);

    if (settings) {
      this.salaryIncome = settings.salaryIncome;
      this.extraIncome = settings.extraIncome;
      this.paymentDay = settings.paymentDay;
    }

    if (fixedExpenses) {
      this.fixedExpenses = fixedExpenses;
    }
  }
}