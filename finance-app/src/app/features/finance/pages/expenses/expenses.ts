import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Storage } from '../../services/storage';
import { Expense } from '../../models/expense.model';
import { STORAGE_KEYS } from '../../../../core/constants/storage-keys';

@Component({
  selector: 'app-expenses',
  imports: [FormsModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class Expenses {

  amount = 0;
  category = 'Mercado';
  description = '';
  paymentMethod: Expense['paymentMethod'] = 'CASH';

  expenses: Expense[] = [];

  categories = [
    'Mercado',
    'Comida',
    'Ocio',
    'Moto',
    'Regalos',
    'Casa',
    'Salud',
    'Ropa',
    'Tecnología',
    'Hija',
    'Otros'
  ];

  constructor(private storage: Storage) {
    this.deleteOldExpenses();
    this.loadExpenses();
  }

  saveExpense(): void {
    if (this.amount <= 0) {
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      category: this.category,
      description: this.description,
      amount: this.amount,
      paymentMethod: this.paymentMethod
    };

    this.expenses.unshift(expense);
    this.storage.save(STORAGE_KEYS.EXPENSES, this.expenses);

    this.amount = 0;
    this.description = '';
    this.category = 'Mercado';
    this.paymentMethod = 'CASH';
  }
  get totalExpenses(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  get categorySummary(): { category: string; total: number }[] {
    const summary = new Map<string, number>();

    this.expenses.forEach(expense => {
      const currentTotal = summary.get(expense.category) || 0;
      summary.set(expense.category, currentTotal + expense.amount);
    });

    return Array.from(summary.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }

  getPaymentMethodLabel(paymentMethod: Expense['paymentMethod']): string {
    const labels = {
      CASH: 'Efectivo',
      NEQUI: 'Nequi',
      CARD_PAYMENT: 'Tarjeta'
    };

    return labels[paymentMethod];
  }

  deleteExpense(id: string): void {
    this.expenses = this.expenses.filter(expense => expense.id !== id);
    this.storage.save(STORAGE_KEYS.EXPENSES, this.expenses);
  }

  private loadExpenses(): void {
    this.expenses = this.storage.get<Expense[]>(STORAGE_KEYS.EXPENSES) || [];
  }


  deleteOldExpenses(): void {
  const expenses = this.storage.get<Expense[]>(STORAGE_KEYS.EXPENSES) ?? [];

  const today = new Date();

  const validExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);

    const diffInDays =
      (today.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays <= 90;
  });

  this.storage.save(STORAGE_KEYS.EXPENSES, validExpenses);
}
}
