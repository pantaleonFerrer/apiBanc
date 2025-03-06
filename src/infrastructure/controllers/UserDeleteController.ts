import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";
import { Unauthorized } from "../../errors/Unauthorized";
import { UserNotFound } from "../../errors/UserNotFound";

export class UserDeleteController {
    constructor(private readonly service: UserService) { }
    async run(req: Request, res: Response) {
        try {
            await this.service.removeUserById(req.params.id)

            res.status(200).json({
                ok: true
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
