export class Card {
    constructor(
        readonly cardNumber: string,
        readonly linkedAccount: string,
        readonly cardType: string,
        readonly cardLimit: number,
        readonly credit: number,
        readonly pin: string,
        readonly userId: string,
        readonly monthlyInterest: number
    ) { }

    static create(
        cardNumber: string,
        linkedAccount: string,
        cardType: string,
        cardLimit: number,
        credit: number,
        pin: string,
        userId: string,
        monthlyInterest: number
    ): Card {
        return new Card(cardNumber, linkedAccount, cardType, cardLimit, credit, pin, userId, monthlyInterest)
    }

    setCredit(ammount: number): Card {
        return new Card(
            this.cardNumber,
            this.linkedAccount,
            this.cardType,
            this.cardLimit,
            ammount,
            this.pin,
            this.userId,
            this.monthlyInterest
        )
    }

}