import { Card } from "../../core/entities/Card";
import { IHelper } from "./IHelper";
import { cardSchema } from '../schemas/Card.schema';
import dataSource from "../../dataSourceServer";
import { Equal } from "typeorm";


export class CardHelper extends IHelper<Card> {
    protected schema = cardSchema
    protected connection = dataSource

    async findByCardNumber(cardNumber: string): Promise<Card | null> {
        const repository = (await this.connection).getRepository(this.schema)

        const card = await repository.findOneBy({ cardNumber: Equal(cardNumber) })

        return card
    }

    async findByAccountNumber(linkedAccount: string): Promise<Card | null> {
        const repository = (await this.connection).getRepository(this.schema)

        const card = await repository.findOneBy({ linkedAccount: Equal(linkedAccount) })

        return card
    }

    async returnCards(): Promise<Card[]> {
        const repository = (await this.connection).getRepository(this.schema)

        const cards = await repository.find()

        return cards
    }

    async findCardsByUserId(userId: string): Promise<Card[]> {
        const repository = (await this.connection).getRepository(this.schema)

        const cards = await repository.find({
            where: {
                userId: userId,
            },
        })

        return cards
    }

    async create(card: Card) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.save(card)
    }

    async remove(card: Card) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.remove(card)
    }

    async update(cardNumber: string, card: Card) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.update({ cardNumber: cardNumber }, card)
    }
}