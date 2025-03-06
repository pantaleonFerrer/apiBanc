import { Request, Response } from "express";
import { UserNotFound } from "../../errors/UserNotFound";
import { AccountService } from "../../application/services/AccountService";
import { AccountNotFound } from "../../errors/AccountNotFound";

export class AccountDailyLimitPatchController {

    constructor(private readonly service: AccountService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.changeDailyLimit(
                req.params.id,
                req.body.dailyLimit
            )

            res.status(204).json({
                ok: true
            })

        } catch (e) {
            console.log(e)
            if (e instanceof AccountNotFound) {
                res.status(404).send(e.message)
                return
            }
            res.status(500).send()

        }
    }
}
