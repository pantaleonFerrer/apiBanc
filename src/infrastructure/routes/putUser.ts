import { Router } from "express";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { AuthMiddleware } from "../middlewares/Auth";
import { UserPutController } from "../controllers/UserPutController";

export function putUser(router: Router): void {

    const service = new UserService(new UserHelper())
    const controller = new UserPutController(service)
    controller.run = controller.run.bind(controller)

    router.put('/api/users/:id', new AuthMiddleware().check, controller.run)
}