import { Request, Response } from "express";
import { OperationService } from "../../application/services/OperationService";
import { UserNotFound } from "../../errors/UserNotFound";

export class OperationsGetController {

    constructor(private readonly service: OperationService) { }

    async run(req: Request, res: Response) {
        try {
            const operations = await this.service.getOperations(req.params.id)

            res.status(200).json({
                ok: true,
                operations
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