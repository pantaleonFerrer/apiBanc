import { Router } from "express";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { LoginPostController } from "../controllers/LoginPostController";

export function postLogin(router: Router): void {

    const service = new UserService(new UserHelper())
    const controller = new LoginPostController(service)
    controller.run = controller.run.bind(controller)

    router.post('/api/login', controller.run)
}