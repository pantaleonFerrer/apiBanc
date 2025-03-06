import { Router } from "express";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { AccountPostController } from "../controllers/AccountPostController";
import { AccountService } from "../../application/services/AccountService";
import { TransactionService } from "../../application/services/TransactionService";
import { AccountHelper } from "../helpers/AccountHelper";
import { ConversionRateHelper } from "../helpers/ConversionRateHelper";
import { TransactionHelper } from "../helpers/TransactionHelper";
import { AuthMiddleware } from "../middlewares/Auth";

export function postAccount(router: Router): void {

    const service = new AccountService(new AccountHelper(), new ConversionRateHelper(), new UserService(new UserHelper()), new TransactionService(new TransactionHelper()))
    const controller = new AccountPostController(service)
    controller.run = controller.run.bind(controller)

    router.post('/api/accounts', new AuthMiddleware().check, controller.run)
}