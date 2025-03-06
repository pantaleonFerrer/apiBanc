import { Transaction } from '../../core/entities/Transaction';
import { IHelper } from './IHelper';
import dataSource from "../../dataSourceServer";
import { transactionSchema } from '../schemas/Transaction.schema';


export class TransactionHelper extends IHelper<Transaction> {
    protected schema = transactionSchema
    protected connection = dataSource

    async save(transaction: Transaction): Promise<void> {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.save(transaction);
    }

    async getTransactionsByAccount(accountNumber: string): Promise<Transaction[]> {
        const repository = (await this.connection).getRepository(this.schema)

        const transactions = await repository.find({
            where: {
                accountNumber: accountNumber
            },
        })
        return transactions
    }

    async getTransactions(): Promise<Transaction[]> {
        const repository = (await this.connection).getRepository(this.schema)

        const transactions = await repository.find({
            order: {
                date: "DESC"
            }
        })

        return transactions
    }

    async getAverageDailyBalance(accountNumber: string): Promise<number> {
        const repository = (await this.connection).getRepository(this.schema);

        const transactions = await this.getTransactionsByAccount(accountNumber);

        const balancesByDate = new Map<string, number>();

        for (const t of transactions) {
            //toLocaleDateString converteix format Date a DD-MM-AAAA
            const date = t.date.toLocaleDateString();
            let amount: number;
            if (t.type === 'deposit') {
                amount = t.amount;
            } else {
                amount = -t.amount;
            }
            balancesByDate.set(date, (balancesByDate.get(date) || 0) + amount);
        }

        let totalBalance = 0;
        for (const amm of balancesByDate.values()) {
            totalBalance += amm
        }

        const numberOfDays = balancesByDate.size;

        return ((numberOfDays > 0) ? (totalBalance / numberOfDays) : 0);
    }

    async returnNextId(): Promise<string> {
        const repository = (await this.connection).getRepository(this.schema);

        const transactions = await repository.find({
            order: {
                id: 'DESC',
            },
            take: 1,
        });

        const transaction = transactions[0] || null;


        if (transaction && !isNaN(Number(transaction.id))) {
            return (Number(transaction.id) + 1).toString();
        }
        return '1';
    }
}
