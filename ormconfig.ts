import { DataSource } from 'typeorm';
import { ENV } from './src/config/constant';
import { Admin } from './src/admin/entities/admin.entity';

const dataSource = new DataSource({
	type: ENV.DB.TYPE as any,
	host: ENV.DB.HOST,
	port: +(ENV.DB.PORT || 5432),
	username: ENV.DB.USERNAME,
	password: ENV.DB.PASSWORD,
	database: ENV.DB.NAME,
	charset: 'utf8mb4',
	synchronize: false,
	logging: false,
	entities: [Admin], // Add other entities here as needed
	migrations: ['src/migration/**/*.ts'],
	migrationsTableName: 'migrations',
});

export default dataSource;

