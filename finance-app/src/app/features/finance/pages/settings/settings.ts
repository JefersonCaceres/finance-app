import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
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
  userName = '';

  fixedExpenseName = '';
  fixedExpenseAmount = 0;

  fixedExpenses: FixedExpense[] = [];

  constructor( private storage: Storage, private router: Router) 
  {this.loadData();}

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

  resetApplication(): void {

    const confirmed = confirm(
      'Se eliminarán todos los datos almacenados en la aplicación.'
    );

    if (confirmed) {
      this.storage.clear();
      location.reload();
    }
  }

  removeFixedExpense(id: string): void {
    this.fixedExpenses = this.fixedExpenses.filter(expense => expense.id !== id);
  }

  saveSettings(): void {

    const settings: SettingsModel = {
      userName: this.userName.trim(),
      salaryIncome: this.salaryIncome,
      extraIncome: this.extraIncome,
      paymentDay: this.paymentDay,
      createdAt: new Date().toISOString()
    };

    this.storage.save(STORAGE_KEYS.SETTINGS, settings);
    this.storage.save(STORAGE_KEYS.FIXED_EXPENSES, this.fixedExpenses);

    this.router.navigate(['/']);
  }

  private loadData(): void {
    const settings = this.storage.get<SettingsModel>(STORAGE_KEYS.SETTINGS);
    const fixedExpenses = this.storage.get<FixedExpense[]>(STORAGE_KEYS.FIXED_EXPENSES);

    if (settings) {
      this.userName = settings.userName;
      this.salaryIncome = settings.salaryIncome;
      this.extraIncome = settings.extraIncome;
      this.paymentDay = settings.paymentDay;
    }

    if (fixedExpenses) {
      this.fixedExpenses = fixedExpenses;
    }
  }
}