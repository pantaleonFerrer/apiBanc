import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";
import { Unauthorized } from "../../errors/Unauthorized";

export class UsersGetController {

    constructor(private readonly service: UserService) { }

    async run(req: Request, res: Response) {
        try {
            const users = await this.service.getUsers()

            res.status(200).json({
                ok: true,
                users
            })
        } catch (e) {
            console.log(e)
            if (e instanceof Unauthorized) {
                res.status(401).send(e.message)
                return
            }

            res.status(500).send()
        }
    }
}