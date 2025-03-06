import { Router } from "express";
import { AccountService } from "../../application/services/AccountService";
import { AccountHelper } from "../helpers/AccountHelper";
import { AuthMiddleware } from "../middlewares/Auth";
import { ConversionRateHelper } from "../helpers/ConversionRateHelper";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { TransactionService } from "../../application/services/TransactionService";
import { TransactionHelper } from "../helpers/TransactionHelper";
import { AccountsGetController } from "../controllers/AccountsGetController";

export function getAccounts(router: Router): void {

    const service = new AccountService(new AccountHelper(), new ConversionRateHelper(), new UserService(new UserHelper()), new TransactionService(new TransactionHelper()))
    const controller = new AccountsGetController(service)
    controller.run = controller.run.bind(controller)

    router.get('/api/accounts', new AuthMiddleware().check, controller.run)
}