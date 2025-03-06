import { Operation } from './../entities/Operation';

export interface OperationServiceProvider {
    registerOperation(operation: Operation): Promise<void>;
    getOperationsByAccount(accountNumber: string): Promise<Operation[]>;
}