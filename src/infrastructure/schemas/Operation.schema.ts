import { Operation } from '../../core/entities/Operation';
import { EntitySchema } from "typeorm";


export const operationSchema = new EntitySchema<Operation>({
    name: 'Operation',
    target: Operation,
    tableName: 'operation',
    columns: {
        id: {
            type: String,
            primary: true
        },
        cardNumber: {
            type: String,
        },
        type: {
            type: String
        },
        amount: {
            type: 'float'
        },
        date: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP'
        },
        desc: {
            type: String,
            nullable: true
        }
    }
})