import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";
import { UserNotFound } from "../../errors/UserNotFound";

export class UpdateIsAdminPatchController {

    constructor(private readonly service: UserService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.updateIsAdmin(
                req.params.id,
                req.body.isAdmin
            )

            res.status(204).json({
                ok: true
            })

        } catch (e) {
            console.log(e)
            if (e instanceof UserNotFound) {
                res.status(404).send(e.message)
                return
            }
            res.status(500).send()

        }
    }
}