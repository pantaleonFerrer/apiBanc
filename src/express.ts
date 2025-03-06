import 'dotenv/config'
import { json } from 'body-parser'
import express, { Express, Router } from 'express'
import { registerRoutes } from './infrastructure/routes'
import cors from 'cors'


async function server() {
    const app: Express = express()

    app.use(cors())
    app.use(json())

    const router: Router = Router()

    const endpoints = registerRoutes(router)

    app.use(endpoints)

    app.listen(Number(process.env.PORT), () => {
        console.log(`Listening to port ${process.env.PORT}`)
    })

}

server()