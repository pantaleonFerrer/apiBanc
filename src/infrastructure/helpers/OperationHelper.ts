import { Operation } from '../../core/entities/Operation';
import { IHelper } from './IHelper';
import dataSource from "../../dataSourceServer";
import { operationSchema } from '../schemas/Operation.schema';


export class OperationHelper extends IHelper<Operation> {
    protected schema = operationSchema
    protected connection = dataSource

    async save(operation: Operation): Promise<void> {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.save(operation);
    }

    async getOperations(): Promise<Operation[]> {
        const repository = (await this.connection).getRepository(this.schema)

        const operations = await repository.find({
            order: {
                date: "DESC"
            }
        })

        return operations
    }

    async getOperationsByCardNumber(cardNumber: string): Promise<Operation[]> {
        const repository = (await this.connection).getRepository(this.schema)

        const operations = await repository.find({
            where: {
                cardNumber: cardNumber
            },
        })
        return operations
    }
}
