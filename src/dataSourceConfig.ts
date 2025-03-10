import 'dotenv/config'
import { DataSource, DataSourceOptions } from "typeorm";

const dataSource = new DataSource({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    ssl: true,
    entities: [__dirname + '/**/*.schema.{ts,js}'],
    migrations: ['persistence/*.js'],
    type: 'postgres',
} as DataSourceOptions)

export default dataSource