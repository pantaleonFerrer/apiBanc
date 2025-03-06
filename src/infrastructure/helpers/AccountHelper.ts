import { Account } from "../../core/entities/Account";
import { IHelper } from "./IHelper";
import { accountSchema } from '../schemas/Account.schema';
import dataSource from "../../dataSourceServer";
import { Equal } from "typeorm";


export class AccountHelper extends IHelper<Account> {
    protected schema = accountSchema
    protected connection = dataSource

    async findByAccountNumber(accountNumber: string): Promise<Account | null> {
        const repository = (await this.connection).getRepository(this.schema)

        const account = await repository.findOneBy({ accountNumber: Equal(accountNumber) })

        return account
    }

    async returnAccounts(): Promise<Account[]> {
        const repository = (await this.connection).getRepository(this.schema)

        const accounts = await repository.find()

        return accounts
    }

    async findAccountsByUserId(userId: string): Promise<Account[]> {
        const repository = (await this.connection).getRepository(this.schema)

        const accounts = await repository.find({
            where: {
                userId: userId,
            },
        })

        return accounts
    }

    async create(account: Account) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.save(account)
    }

    async remove(account: Account) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.remove(account)
    }

    async update(accountNumber: string, account: Account) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.update({ accountNumber: accountNumber }, account)
    }



}