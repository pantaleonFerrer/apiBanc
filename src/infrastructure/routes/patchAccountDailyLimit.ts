import { Router } from "express";
import { AccountService } from "../../application/services/AccountService";
import { AccountHelper } from "../helpers/AccountHelper";
import { AuthMiddleware } from "../middlewares/Auth";
import { TransactionService } from "../../application/services/TransactionService";
import { UserService } from "../../application/services/UserService";
import { ConversionRateHelper } from "../helpers/ConversionRateHelper";
import { TransactionHelper } from "../helpers/TransactionHelper";
import { UserHelper } from "../helpers/UserHelper";
import { AccountDailyLimitPatchController } from "../controllers/AccountDailyLimitPatchController";

export function patchAccountDailyLimit(router: Router): void {

    const service = new AccountService(new AccountHelper(), new ConversionRateHelper(), new UserService(new UserHelper()), new TransactionService(new TransactionHelper()))
    const controller = new AccountDailyLimitPatchController(service)
    controller.run = controller.run.bind(controller)

    router.patch('/api/accounts/dailyLimit/:id', new AuthMiddleware().check, controller.run)
}