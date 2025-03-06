import { Card } from '../../core/entities/Card';
import { EntitySchema } from "typeorm";


export const cardSchema = new EntitySchema<Card>({
    name: 'Card',
    target: Card,
    tableName: 'card',
    columns: {
        cardNumber: {
            type: String,
            primary: true
        },
        linkedAccount: {
            type: String,
            unique: true
        },
        cardType: {
            type: String
        },
        cardLimit: {
            type: Number
        },
        credit: {
            type: Number
        },
        pin: {
            type: String
        },
        userId: {
            type: String
        },
        monthlyInterest: {
            type: Number
        }
    }
})
