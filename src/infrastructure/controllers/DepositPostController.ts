import { Request, Response } from "express";
import { AccountService } from "../../application/services/AccountService";
import { EmailAlreadyExists } from "../../errors/EmailAlreadyExists";
import { MissingInformation } from '../../errors/MissingInformation';

export class DepositPostController {

    constructor(private readonly service: AccountService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.deposit(
                req.params.id,
                req.body.ammount,
                req.body.currency
            )

            res.status(200).json({
                ok: true
            })

        } catch (e) {
            console.log(e);
            if (e instanceof EmailAlreadyExists || e instanceof MissingInformation) {
                res.status(409).send(e.message)
                return
            }
            res.status(500).send()
            return
        }
    }
}