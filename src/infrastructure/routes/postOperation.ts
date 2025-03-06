import { Router } from "express";
import { AuthMiddleware } from "../middlewares/Auth";
import { OperationService } from "../../application/services/OperationService";
import { OperationHelper } from "../helpers/OperationHelper";
import { OperationPostController } from "../controllers/OperationPostController";

export function postOperation(router: Router): void {

    const service = new OperationService(new OperationHelper)
    const controller = new OperationPostController(service)
    controller.run = controller.run.bind(controller)

    router.post('/api/operations', new AuthMiddleware().check, controller.run)
}