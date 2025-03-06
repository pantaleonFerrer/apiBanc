import { Transaction } from "../entities/Transaction";

export interface TransactionServiceProvider {
    registerTransaction(transaction: Transaction): Promise<void>;
    getTransactionsByAccount(accountNumber: string): Promise<Transaction[]>;
    calculateAverageDailyBalance(accountNumber: string): Promise<number>;
}