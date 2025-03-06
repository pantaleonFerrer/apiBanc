import { Account } from "../entities/Account";

export interface AccountProvider {
    getAccountByAccountNumber(userId: string, accountNumber: string): Promise<Account>;
    withdraw(id: string, accountNumber: string, ammount: number): Promise<void>;
}
