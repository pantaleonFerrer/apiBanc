import { Router } from "express";
import { AccountService } from "../../application/services/AccountService";
import { AccountHelper } from "../helpers/AccountHelper";
import { AuthMiddleware } from "../middlewares/Auth";
import { ConversionRateHelper } from "../helpers/ConversionRateHelper";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { TransactionService } from "../../application/services/TransactionService";
import { TransactionHelper } from "../helpers/TransactionHelper";
import { CardService } from "../../application/services/CardService";
import { CardHelper } from "../helpers/CardHelper";
import { OperationService } from "../../application/services/OperationService";
import { OperationHelper } from "../helpers/OperationHelper";
import { CardGetController } from "../controllers/CardGetController";

export function getCard(router: Router): void {

    const accountService = new AccountService(new AccountHelper(), new ConversionRateHelper(), new UserService(new UserHelper()), new TransactionService(new TransactionHelper()))
    const service = new CardService(new CardHelper(), accountService, new OperationService(new OperationHelper()))
    const controller = new CardGetController(service)
    controller.run = controller.run.bind(controller)

    router.get('/api/cards/:id', new AuthMiddleware().check, controller.run)
}