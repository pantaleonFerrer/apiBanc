import { Router } from "express";
import { AccountGetController } from "../controllers/AccountGetController";
import { AccountService } from "../../application/services/AccountService";
import { AccountHelper } from "../helpers/AccountHelper";
import { AuthMiddleware } from "../middlewares/Auth";
import { ConversionRateHelper } from "../helpers/ConversionRateHelper";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { TransactionService } from "../../application/services/TransactionService";
import { TransactionHelper } from "../helpers/TransactionHelper";

export function getAccount(router: Router): void {

    const service = new AccountService(new AccountHelper(), new ConversionRateHelper(), new UserService(new UserHelper()), new TransactionService(new TransactionHelper()))
    const controller = new AccountGetController(service)
    controller.run = controller.run.bind(controller)

    router.get('/api/accounts/:id', new AuthMiddleware().check, controller.run)
}