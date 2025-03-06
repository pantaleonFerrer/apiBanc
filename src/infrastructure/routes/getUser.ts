import { Router } from "express";
import { UserGetController } from "../controllers/UserGetController";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { AuthMiddleware } from "../middlewares/Auth";

export function getUser(router: Router): void {

    const service = new UserService(new UserHelper())
    const controller = new UserGetController(service)
    controller.run = controller.run.bind(controller)

    router.get('/api/users/:id', new AuthMiddleware().check, controller.run)
}