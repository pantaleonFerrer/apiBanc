import { Request, Response } from "express";
import { AccountService } from "../../application/services/AccountService";
import { EmailAlreadyExists } from "../../errors/EmailAlreadyExists";
import { MissingInformation } from '../../errors/MissingInformation';

export class AccountPostController {

    constructor(private readonly service: AccountService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.create(
                res.locals.id,
                req.body.currency,
                req.body.accountType,
                req.body.dailyLimit
            )

            res.status(201).json({
                ok: true
            })

        } catch (e) {
            console.log(e);
            if (e instanceof EmailAlreadyExists || e instanceof MissingInformation)
                res.status(409).send(e.message)
            res.status(500).send()
        }
    }
}