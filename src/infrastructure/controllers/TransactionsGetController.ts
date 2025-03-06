import { Request, Response } from "express";
import { TransactionService } from "../../application/services/TransactionService";
import { UserNotFound } from "../../errors/UserNotFound";

export class TransactionsGetController {

    constructor(private readonly service: TransactionService) { }

    async run(req: Request, res: Response) {
        try {
            const transactions = await this.service.getTransactions(req.params.id)

            res.status(200).json({
                ok: true,
                transactions
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