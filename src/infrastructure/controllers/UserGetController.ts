import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";
import { UserNotFound } from "../../errors/UserNotFound";
import { Unauthorized } from "../../errors/Unauthorized";

export class UserGetController {

    constructor(private readonly service: UserService) { }

    async run(req: Request, res: Response) {
        try {
            const user = await this.service.getUserById(req.params.id)

            res.status(200).json({
                ok: true,
                user
            })
        } catch (e) {
            if (e instanceof UserNotFound) {
                res.status(404).send(e.message)
                return
            }
            if (e instanceof Unauthorized) {
                res.status(401).send(e.message)
                return
            }

            res.status(500).send()
        }
    }
}