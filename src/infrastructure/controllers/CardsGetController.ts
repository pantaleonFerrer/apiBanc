import { Request, Response } from "express";
import { CardService } from "../../application/services/CardService";
import { Unauthorized } from "../../errors/Unauthorized";

export class CardsGetController {

    constructor(private readonly service: CardService) { }

    async run(req: Request, res: Response) {
        try {
            const cards = await this.service.getCards()

            res.status(200).json({
                ok: true,
                cards
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