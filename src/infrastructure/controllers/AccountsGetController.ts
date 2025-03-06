import { Request, Response } from "express";
import { AccountService } from "../../application/services/AccountService";
import { Unauthorized } from "../../errors/Unauthorized";

export class AccountsGetController {

    constructor(private readonly service: AccountService) { }

    async run(req: Request, res: Response) {
        try {
            const accounts = await this.service.getAccounts(res.locals.id)

            res.status(200).json({
                ok: true,
                accounts
            })
        } catch (e) {
            if (e instanceof Unauthorized) {
                res.status(401).send(e.message)
                return
            }

            res.status(500).send()
        }
    }
}