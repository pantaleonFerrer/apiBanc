import { Operation } from '../../core/entities/Operation';
import { OperationServiceProvider } from "../../core/interfaces/OperationServiceProvider";
import { OperationHelper } from "../../infrastructure/helpers/OperationHelper";

export class OperationService implements OperationServiceProvider {
    constructor(private readonly helper: OperationHelper) { }

    async registerOperation(operation: Operation): Promise<void> {
        await this.helper.save(operation);
    }

    async getOperationsByAccount(accountNumber: string) {
        return await this.helper.getOperationsByCardNumber(accountNumber);
    }

    async getOperations(cardNumber: string) {
        const operations = await this.helper.getOperations();
        return operations.filter(op => op.cardNumber === cardNumber)
    }

    async generateNextId(): Promise<string> {
        const operations = await this.helper.getOperations();
        let id = 1;

        if (operations != undefined) {
            for (let op of operations) {
                if (Number(op.id) > id) {
                    id = Number(op.id)
                }
            }
            id++
        }
        return id.toString();
    }

}
