export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: 'CASH' | 'NEQUI' | 'CARD_PAYMENT';
}