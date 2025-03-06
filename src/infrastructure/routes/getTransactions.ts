import { Router } from "express";
import { AuthMiddleware } from "../middlewares/Auth";
import { TransactionService } from "../../application/services/TransactionService";
import { TransactionHelper } from "../helpers/TransactionHelper";
import { TransactionsGetController } from "../controllers/TransactionsGetController";

export function getTransactions(router: Router): void {

    const service = new TransactionService(new TransactionHelper)
    const controller = new TransactionsGetController(service)
    controller.run = controller.run.bind(controller)

    router.get('/api/transactions/:id', new AuthMiddleware().check, controller.run)
}