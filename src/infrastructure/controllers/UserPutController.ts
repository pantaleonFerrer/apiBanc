import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";
import { UserNotFound } from "../../errors/UserNotFound";
import { Unauthorized } from "../../errors/Unauthorized";
import { EmailAlreadyExists } from "../../errors/EmailAlreadyExists";

export class UserPutController {

    constructor(private readonly service: UserService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.modifyUser(
                req.params.id,
                req.body.email,
                req.body.name,
                req.body.password
            )

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
            if (e instanceof EmailAlreadyExists) {
                res.status(400).send(e.message)
                return
            }

            res.status(500).send()
        }
    }
}