import { Transaction } from './../../core/entities/Transaction';
import { EntitySchema } from "typeorm";


export const transactionSchema = new EntitySchema<Transaction>({
    name: 'Transaction',
    target: Transaction,
    tableName: 'transaction',
    columns: {
        id: {
            type: String,
            primary: true
        },
        accountNumber: {
            type: String,
        },
        type: {
            type: String
        },
        amount: {
            type: 'float'
        },
        currency: {
            type: String,
            length: 3
        },
        date: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP'
        },
        desc: {
            type: String,
            nullable: true
        }
    }
})