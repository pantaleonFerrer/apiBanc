import { Transaction } from '../../core/entities/Transaction';
import { TransactionServiceProvider } from "../../core/interfaces/TransactionServiceProvider";
import { TransactionHelper } from "../../infrastructure/helpers/TransactionHelper";

export class TransactionService implements TransactionServiceProvider {
    constructor(private readonly helper: TransactionHelper) { }

    async registerTransaction(transaction: Transaction): Promise<void> {
        await this.helper.save(transaction);
    }

    async getTransactionsByAccount(accountNumber: string) {
        return await this.helper.getTransactionsByAccount(accountNumber);
    }

    async getTransactions(accountNumber: string) {
        let transactions = await this.helper.getTransactions();

        return transactions.filter(tr => tr.accountNumber === accountNumber)
    }

    async calculateAverageDailyBalance(accountNumber: string): Promise<number> {
        return await this.helper.getAverageDailyBalance(accountNumber);
    }

    async generateNextId(): Promise<string> {
        return ''
    }
}
