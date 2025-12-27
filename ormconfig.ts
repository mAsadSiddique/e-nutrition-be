import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()
dotenv.config({ path: `config/${process.env.NODE_ENV}.env` })
const config: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT ?? 5432),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: false,
	logging: true,
	entities: [
		'dist/**/*.entity.js'
	],
	migrations: [
		'src/migration/**/*.ts'
	],
}

export const dataSource = new DataSource(config)
