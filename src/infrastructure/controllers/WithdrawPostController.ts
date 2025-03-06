import { Request, Response } from "express";
import { AccountService } from "../../application/services/AccountService";
import { EmailAlreadyExists } from "../../errors/EmailAlreadyExists";
import { MissingInformation } from '../../errors/MissingInformation';
import { InsufficientFunds } from "../../errors/InsufficientFunds";
import { LimitSurpassed } from "../../errors/LimitSurpassed";

export class WithdrawPostController {

    constructor(private readonly service: AccountService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.withdraw(
                res.locals.id,
                req.params.id,
                req.body.ammount
            )

            res.status(200).json({
                ok: true
            })

        } catch (e) {
            console.log(e);
            if (e instanceof EmailAlreadyExists || e instanceof MissingInformation || e instanceof InsufficientFunds || e instanceof LimitSurpassed) {
                res.status(409).send(e.message)
                return
            }
            res.status(500).send()
            return
        }
    }
}