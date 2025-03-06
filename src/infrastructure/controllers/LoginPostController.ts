import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";
import { UserNotFound } from "../../errors/UserNotFound";

export class LoginPostController {

    constructor(private readonly service: UserService) { }

    async run(req: Request, res: Response) {
        try {

            const token = await this.service.login(req.body.email, req.body.password)

            res.status(200).json({
                ok: true,
                token
            })

        } catch (e) {
            console.log(e)
            if (e instanceof UserNotFound) {
                res.status(404).send(e.message)
                return
            }

            res.status(500).send()
            return
        }
    }
}