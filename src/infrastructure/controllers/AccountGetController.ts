import { Request, Response } from "express";
import { AccountService } from "../../application/services/AccountService";
import { AccountNotFound } from "../../errors/AccountNotFound";
import { Unauthorized } from "../../errors/Unauthorized";

export class AccountGetController {

    constructor(private readonly service: AccountService) { }

    async run(req: Request, res: Response) {
        try {
            const account = await this.service.getAccountByAccountNumber(res.locals.id, req.params.id)

            res.status(200).json({
                ok: true,
                account
            })
        } catch (e) {
            if (e instanceof AccountNotFound) {
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