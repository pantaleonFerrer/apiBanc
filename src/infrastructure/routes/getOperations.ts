import { Router } from "express";
import { AuthMiddleware } from "../middlewares/Auth";
import { OperationService } from "../../application/services/OperationService";
import { OperationHelper } from "../helpers/OperationHelper";
import { OperationsGetController } from "../controllers/OperationsGetController";

export function getOperations(router: Router): void {

    const service = new OperationService(new OperationHelper)
    const controller = new OperationsGetController(service)
    controller.run = controller.run.bind(controller)

    router.get('/api/operations/:id', new AuthMiddleware().check, controller.run)
}