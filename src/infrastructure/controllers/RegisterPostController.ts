import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";
import { EmailAlreadyExists } from "../../errors/EmailAlreadyExists";
import { MissingInformation } from '../../errors/MissingInformation';

export class RegisterPostController {

    constructor(private readonly service: UserService) { }

    async run(req: Request, res: Response) {
        try {
            await this.service.create(
                req.body.email,
                req.body.name,
                req.body.password
            )

            res.status(201).json({
                ok: true
            })

        } catch (e) {
            console.log(e)
            if (e instanceof EmailAlreadyExists || e instanceof MissingInformation) {
                res.status(409).send(e.message)
                return
            }
            res.status(500).send()

        }
    }
}