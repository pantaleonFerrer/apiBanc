import { Request, Response } from "express";
import { OperationService } from "../../application/services/OperationService";
import { UserNotFound } from "../../errors/UserNotFound";

export class OperationPostController {

    constructor(private readonly service: OperationService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.registerOperation(
                req.body.operation
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