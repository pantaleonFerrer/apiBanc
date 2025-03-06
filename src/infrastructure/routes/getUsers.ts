import { Router } from "express";
import { UsersGetController } from "../controllers/UsersGetController";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { AuthMiddleware } from "../middlewares/Auth";

export function getUsers(router: Router): void {
    const service = new UserService(new UserHelper())
    const controller = new UsersGetController(service)
    controller.run = controller.run.bind(controller)

    router.get('/api/users', controller.run)
}