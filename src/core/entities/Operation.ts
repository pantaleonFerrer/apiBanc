export class Operation {
    constructor(
        readonly id: string,
        readonly cardNumber: string,
        readonly type: string,
        readonly amount: number,
        readonly date: Date,
        readonly desc?: string,
    ) { }

    static create(
        id: string,
        cardNumber: string,
        type: string,
        amount: number,
        date: Date,
        desc?: string,
    ): Operation {
        return new Operation(id, cardNumber, type, amount, date, desc || undefined)
    }
}