import { Router } from "express";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { AuthMiddleware } from "../middlewares/Auth";
import { UserDeleteController } from "../controllers/UserDeleteController";

export function deleteUser(router: Router): void {

    const service = new UserService(new UserHelper())
    const controller = new UserDeleteController(service)
    controller.run = controller.run.bind(controller)

    router.delete('/api/users/:id', new AuthMiddleware().check, controller.run)
}