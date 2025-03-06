import { Router } from "express";
import { AuthMiddleware } from "../middlewares/Auth";
import { TransactionService } from "../../application/services/TransactionService";
import { TransactionHelper } from "../helpers/TransactionHelper";
import { TransactionsPostController } from "../controllers/TransactionPostController";

export function postTransactions(router: Router): void {

    const service = new TransactionService(new TransactionHelper)
    const controller = new TransactionsPostController(service)
    controller.run = controller.run.bind(controller)

    router.post('/api/transactions', new AuthMiddleware().check, controller.run)
}