import { CardHelper } from '../../infrastructure/helpers/CardHelper';
import { AccountProvider } from './../../core/interfaces/AccountProvider';
import { v4 as uuidv4 } from 'uuid';
import { Card } from "../../core/entities/Card";
import { MissingInformation } from '../../errors/MissingInformation';
import { Unauthorized } from "../../errors/Unauthorized";
import { CardNotFound } from "../../errors/CardNotFound";
import { WrongInformation } from '../../errors/WrongInformation';
import { InsufficientFunds } from '../../errors/InsufficientFunds';
import { createHmac } from 'crypto';
import { AccountNotFound } from '../../errors/AccountNotFound';
import { WrongPin } from '../../errors/WrongPin';
import { Operation } from '../../core/entities/Operation';
import { OperationServiceProvider } from '../../core/interfaces/OperationServiceProvider';
import { NoDebt } from '../../errors/NoDebt';

export class CardService {

    constructor(
        private readonly helper: CardHelper,
        private readonly accountProvider: AccountProvider,
        private readonly operationServiceProvider: OperationServiceProvider
    ) { }


    async getCardByAccountNumber(accountNumber: string): Promise<Card> {
        const card = await this.helper.findByAccountNumber(accountNumber)

        if (!card) throw new CardNotFound(`A card linked with an account with account number "${accountNumber}" was not found`)

        return card
    }


    async getCardByCardNumber(cardNumber: string): Promise<Card> {
        const card = await this.helper.findByCardNumber(cardNumber)

        if (!card) throw new CardNotFound(`A card with card number "${cardNumber}" was not found`)

        return card
    }

    async getCards(): Promise<Card[]> {
        const card = await this.helper.returnCards()

        if (!card) throw new CardNotFound(`There are no cards`)

        return card
    }

    async getSelfCards(userId: string): Promise<Card[]> {
        const cards = await this.helper.findCardsByUserId(userId)

        if (!cards) throw new CardNotFound(`There are no cards from this user`)

        return cards
    }

    async removeCardById(isAdmin: boolean, id: string, userId: string, cardNumberToErase: string) {

        if (id != userId && !isAdmin) {
            throw new Unauthorized(`No tens permis per efectuar aquesta operació`)
        }
        const card = await this.helper.findByCardNumber(cardNumberToErase)

        if (!card) throw new CardNotFound(`An card with card number ${cardNumberToErase} was not found`)

        await this.helper.remove(card)
    }

    async getNextCardNumber(): Promise<number> {
        const cards = await this.helper.returnCards();

        if (cards == undefined || cards.length == 0) return 1;

        let cardNumbers: number[] = cards.map(card => Number(card.cardNumber));

        return (Math.max(...cardNumbers) + 1)
    }

    async create(userId: string, linkedAccount: string, cardType: string, pin: string,) {

        let nextCardNumber = await this.getNextCardNumber();

        const cardNumber = nextCardNumber.toString().padStart(16, '0');

        const account = await this.accountProvider.getAccountByAccountNumber(userId, linkedAccount)

        if (!account) throw new AccountNotFound(`No s'ha trobat un compte amb aquest numero`)

        if (account.userId !== userId) throw new Unauthorized(`No tens permis per dur a terme aquesta acció`)

        if (cardType != 'debit' && cardType != 'credit') throw new WrongInformation("No s'ha seleccionat un tipus de targeta valid")

        if (!pin) throw new MissingInformation(`És obligatori introduir un pin de 4 digits`)

        if (pin.length != 4) throw new WrongInformation(`El pin introduit ha de ser de 4 digits`)

        const hash = createHmac('sha-512', process.env.PASSWORD_SECRET!);
        hash.update(pin);
        const hashedPin = hash.digest('hex');

        const card = new Card(cardNumber, account.accountNumber, cardType, 3000, 3000, hashedPin, userId, 2);
        await this.helper.create(card);
    }

    async modifyCard(id: string, isAdmin: boolean, cardNumberToChange: string, linkedAccount?: string, cardLimit?: number, pin?: string) {
        const card = await this.helper.findByCardNumber(cardNumberToChange);
        if (!card) {
            throw new CardNotFound(`No s'ha trobat cap compte amb el numero de compte ${cardNumberToChange}`);
        } else {
            if (id !== card.userId && !isAdmin) {
                throw new Unauthorized(`No tens permis per modificar aquest compte`);
            }

            if (linkedAccount !== undefined) {
                const account = await this.accountProvider.getAccountByAccountNumber(card.userId, linkedAccount)

                if (!account) throw new AccountNotFound(`No s'ha trobat un compte amb aquest numero`)

                if (account.userId != card.userId) throw new Unauthorized(`No tens permis per fer aquesta accio`)
            }

            let hashedPin = card.pin
            if (pin && pin.length != 4) throw new WrongInformation(`El pin introduit ha de ser de 4 digits`)
            if (pin) {
                const hash = createHmac('sha-512', process.env.PASSWORD_SECRET!);
                hash.update(pin);
                hashedPin = hash.digest('hex');
            }

            let updatedCard = null
            if (isAdmin) {
                updatedCard = new Card(
                    card.cardNumber,
                    linkedAccount || card.linkedAccount,
                    card.cardType,
                    cardLimit || card.cardLimit,
                    card.credit,
                    hashedPin,
                    card.userId,
                    2
                );

            } else {
                updatedCard = new Card(
                    card.cardNumber,
                    linkedAccount || card.linkedAccount,
                    card.cardType,
                    card.cardLimit,
                    card.credit,
                    hashedPin,
                    card.userId,
                    2
                );

            }
            await this.helper.update(card.cardNumber, updatedCard);
        }
    }

    async pay(cardNumber: string, pin: string, ammount: number) {
        const card = await this.helper.findByCardNumber(cardNumber)
        if (!card) throw new CardNotFound(`No s'ha trobat una targeta amb aquest numero`);

        const hash = createHmac('sha-512', process.env.PASSWORD_SECRET!);
        hash.update(pin);
        const hashedPin = hash.digest('hex');

        if (hashedPin != card.pin) throw new WrongPin(`El pin introduit es incorrecte`);

        if (card.cardType === 'debit') {
            const account = await this.accountProvider.getAccountByAccountNumber(card.userId, card.linkedAccount)
            if (account.balance < ammount) throw new InsufficientFunds(`No tens suficient saldo disponible`);
            this.accountProvider.withdraw(card.userId, card.linkedAccount, ammount)
            const operation = Operation.create(
                uuidv4(),
                cardNumber,
                'payment',
                ammount,
                new Date(),
                `Card payment`
            );
            await this.operationServiceProvider.registerOperation(operation);

        } else {
            if (card.credit < ammount) throw new InsufficientFunds(`No tens suficient crèdit per fer el pagament`);

            const defCard = card.setCredit(card.credit - ammount)
            const operation = Operation.create(
                uuidv4(),
                cardNumber,
                'payment',
                ammount,
                new Date(),
                `Card payment`
            );
            await this.helper.update(card.cardNumber, defCard)
            await this.operationServiceProvider.registerOperation(operation);
        }

    }

    async liquidateDebt(userId: string, cardToLiquidate: string, accountFromLiquidate: string) {
        const card = await this.helper.findByCardNumber(cardToLiquidate);

        if (!card) throw new CardNotFound(`No hi ha cap targeta amb el numero ${cardToLiquidate}`);

        if (card.cardType !== 'credit') throw new WrongInformation(`La targeta indicada és de debit`);

        if (card.userId !== userId) throw new Unauthorized(`No tens permis`);

        const debt = card.cardLimit - card.credit;

        if (debt <= 0) throw new NoDebt(`No hi ha saldo per liquidar`);

        const account = await this.accountProvider.getAccountByAccountNumber(card.userId, accountFromLiquidate);

        if (!account) throw new AccountNotFound(`No s'ha trobat cap compte amb aquest numero ${accountFromLiquidate}`);

        if (account.userId !== userId) throw new Unauthorized(`No tens permis per accedir a aquest compte`);

        if (account.balance < debt) throw new InsufficientFunds(`El compte no te suuficient balance`);

        this.accountProvider.withdraw(card.userId, card.linkedAccount, debt)
        const operation = Operation.create(
            uuidv4(),
            card.cardNumber,
            'liquidation',
            debt,
            new Date(),
            `Credit liquidation`
        );
        await this.operationServiceProvider.registerOperation(operation);

        const updatedCard = card.setCredit(card.cardLimit);
        await this.helper.update(cardToLiquidate, updatedCard);

    }


}