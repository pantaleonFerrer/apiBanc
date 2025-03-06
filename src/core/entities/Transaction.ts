export class Transaction {
    constructor(
        readonly id: string,
        readonly accountNumber: string,
        readonly type: string,
        readonly amount: number,
        readonly currency: string,
        readonly date: Date,
        readonly desc?: string,
    ) { }

    static create(
        id: string,
        accountNumber: string,
        type: string,
        amount: number,
        currency: string,
        date: Date,
        desc?: string,
    ): Transaction {
        return new Transaction(id, accountNumber, type, amount, currency, date, desc || undefined)
    }
}