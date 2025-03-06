import { Router } from "express";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { AuthMiddleware } from "../middlewares/Auth";
import { UpdateIsAdminPatchController } from "../controllers/UpdateIsAdminPatchController";
import { IsAdminMiddleware } from '../middlewares/IsAdmin';

export function patchUpdateIsAdmin(router: Router): void {

    const service = new UserService(new UserHelper())
    const controller = new UpdateIsAdminPatchController(service)
    controller.run = controller.run.bind(controller)

    const isAdminMiddleware = new IsAdminMiddleware(service)
    isAdminMiddleware.check = isAdminMiddleware.check.bind(isAdminMiddleware)

    router.patch('/api/users/:id', new AuthMiddleware().check, isAdminMiddleware.check, controller.run)
}