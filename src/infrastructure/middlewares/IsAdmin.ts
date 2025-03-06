import { NextFunction, Request, Response } from "express";
import { readFileSync } from "fs";
import jwt from 'jsonwebtoken'
import { UserService } from "../../application/services/UserService";

export class IsAdminMiddleware {
    constructor(private readonly userService: UserService) { }
    async check(req: Request, res: Response, next: NextFunction) {

        const user = await this.userService.getUserById(res.locals.id)

        if (!user || !user.isAdmin) {
            res.status(401).send()
        }

        next()
    }
}