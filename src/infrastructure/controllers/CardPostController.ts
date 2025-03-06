import { Request, Response } from "express";
import { CardService } from "../../application/services/CardService";
import { CardNotFound } from "../../errors/CardNotFound";
import { Unauthorized } from "../../errors/Unauthorized";
import { AccountNotFound } from "../../errors/AccountNotFound";

export class CardPostController {

    constructor(private readonly service: CardService) { }

    async run(req: Request, res: Response) {
        try {
            const card = await this.service.create(
                res.locals.id,
                req.body.linkedAccount,
                req.body.cardType,
                req.body.pin
            )

            res.status(201).json({
                ok: true,
                card
            })
        } catch (e) {
            if (e instanceof CardNotFound) {
                res.status(404).send(e.message)
                return
            }
            if (e instanceof AccountNotFound) {
                res.status(404).send(e.message)
                return
            }
            if (e instanceof Unauthorized) {
                res.status(401).send(e.message)
                return
            }
            console.log(e)

            res.status(500).send()
        }
    }
}