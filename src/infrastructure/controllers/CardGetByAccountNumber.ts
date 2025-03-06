import { Request, Response } from "express";
import { CardService } from "../../application/services/CardService";
import { CardNotFound } from "../../errors/CardNotFound";

export class CardGetByAccountNumber {

    constructor(private readonly service: CardService) { }

    async run(req: Request, res: Response) {
        try {
            const card = await this.service.getCardByAccountNumber(req.params.id)

            res.status(200).json({
                ok: true,
                card
            })
        } catch (e) {
            if (e instanceof CardNotFound) {
                res.status(404).send(e.message)
                return
            }

            res.status(500).send()
        }
    }
}