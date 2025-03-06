
export class Account {
    constructor(
        readonly accountNumber: string,
        readonly currency: string,
        readonly balance: number,
        readonly accountType: string,
        readonly dailyLimit: number,
        readonly userId: string
    ) { }

    static create(
        accountNumber: string,
        currency: string,
        accountType: string,
        dailyLimit: number,
        userId: string
    ) {
        return new Account(accountNumber, currency, 0, accountType, dailyLimit, userId)
    }

    modify(
        currency: string,
        accountType: string,
        dailyLimit: number,
        userId: string
    ) {
        return new Account(this.accountNumber, currency, this.balance, accountType, dailyLimit, userId)
    }

    setBalance(ammount: number): Account {
        return new Account(
            this.accountNumber,
            this.currency,
            ammount,
            this.accountType,
            this.dailyLimit,
            this.userId
        )
    }

    reduceBalance(ammount: number): Account {
        return new Account(
            this.accountNumber,
            this.currency,
            (this.balance - ammount),
            this.accountType,
            this.dailyLimit,
            this.userId
        )
    }

    incrementBalance(ammount: number): Account {
        return new Account(
            this.accountNumber,
            this.currency,
            (this.balance + ammount),
            this.accountType,
            this.dailyLimit,
            this.userId
        )
    }

    setDailyLimit(dailyLimit: number): Account {
        return new Account(this.accountNumber, this.currency, this.balance, this.accountType, dailyLimit, this.userId)
    }

}