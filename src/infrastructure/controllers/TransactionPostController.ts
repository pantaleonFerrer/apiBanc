import { Request, Response } from "express";
import { TransactionService } from "../../application/services/TransactionService";
import { UserNotFound } from "../../errors/UserNotFound";

export class TransactionsPostController {

    constructor(private readonly service: TransactionService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.registerTransaction(
                req.body.transaction
            )

            res.status(200).json({
                ok: true
            })
        } catch (e) {
            if (e instanceof UserNotFound) {
                res.status(404).send(e.message)
                return
            }

            res.status(500).send()
        }
    }
}