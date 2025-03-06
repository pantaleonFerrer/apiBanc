import { Request, Response } from "express";
import { AccountService } from "../../application/services/AccountService";
import { EmailAlreadyExists } from "../../errors/EmailAlreadyExists";
import { MissingInformation } from '../../errors/MissingInformation';
import { UserNotFound } from "../../errors/UserNotFound";
import { AccountNotFound } from "../../errors/AccountNotFound";
import { WrongInformation } from "../../errors/WrongInformation";
import { InsufficientFunds } from "../../errors/InsufficientFunds";

export class TransferPostController {

    constructor(private readonly service: AccountService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.transfer(
                req.params.id,
                req.body.toAccount,
                req.body.ammount
            )

            res.status(200).json({
                ok: true
            })

        } catch (e) {
            console.log(e);
            if (e instanceof UserNotFound || e instanceof WrongInformation || e instanceof AccountNotFound || e instanceof InsufficientFunds) {
                res.status(409).send(e.message)
                return
            }
            res.status(500).send()
            return
        }
    }
}