import { Router } from "express";
import { UserService } from "../../application/services/UserService";
import { UserHelper } from "../helpers/UserHelper";
import { RegisterPostController } from "../controllers/RegisterPostController";

export function postRegister(router: Router): void {

    const service = new UserService(new UserHelper())
    const controller = new RegisterPostController(service)
    controller.run = controller.run.bind(controller)

    router.post('/api/register', controller.run)
}