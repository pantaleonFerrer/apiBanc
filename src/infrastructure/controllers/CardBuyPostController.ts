import { Request, Response } from "express";
import { CardService } from "../../application/services/CardService";
import { CardNotFound } from "../../errors/CardNotFound";
import { Unauthorized } from "../../errors/Unauthorized";
import { WrongPin } from "../../errors/WrongPin";
import { InsufficientFunds } from "../../errors/InsufficientFunds";

export class CardBuyPostController {

    constructor(private readonly service: CardService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.pay(
                req.params.id,
                req.body.pin,
                req.body.ammount
            )

            res.status(200).json({
                ok: true
            })
        } catch (e) {
            if (e instanceof CardNotFound) {
                res.status(404).send(e.message)
                return
            }
            if (e instanceof Unauthorized) {
                res.status(401).send(e.message)
                return
            }
            if (e instanceof WrongPin) {
                res.status(400).send(e.message)
                return
            }
            if (e instanceof InsufficientFunds) {
                res.status(400).send(e.message)
                return
            }
            console.log(e)
            res.status(500).send()
        }
    }
}