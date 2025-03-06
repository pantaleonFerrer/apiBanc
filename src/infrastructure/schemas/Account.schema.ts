import { Account } from '../../core/entities/Account';
import { EntitySchema } from "typeorm";


export const accountSchema = new EntitySchema<Account>({
    name: 'Account',
    target: Account,
    tableName: 'account',
    columns: {
        accountNumber: {
            type: String,
            primary: true
        },
        currency: {
            type: String
        },
        balance: {
            type: 'float'
        },
        accountType: {
            type: String
        },
        dailyLimit: {
            type: Number
        },
        userId: {
            type: String
        }
    }
})