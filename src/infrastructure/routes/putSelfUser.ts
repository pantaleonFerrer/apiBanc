import { Router } from "express";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { UserSelfPutController } from "../controllers/UserSelfPutController";
import { IsAdminMiddleware } from "../middlewares/IsAdmin";
import { AuthMiddleware } from "../middlewares/Auth";

export function putSelfUser(router: Router): void {

    const service = new UserService(new UserHelper())
    const controller = new UserSelfPutController(service)
    controller.run = controller.run.bind(controller)


    const isAdminMiddleware = new IsAdminMiddleware(service)
    isAdminMiddleware.check = isAdminMiddleware.check.bind(isAdminMiddleware)

    router.put('/api/users/:id', new AuthMiddleware().check, isAdminMiddleware.check, controller.run)
}