require('dotenv').config({path: './.env'});
const { getMetadataArgsStorage } = require('typeorm');

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: parseInt(5432, 10),
  username: 'postgres',
  password: 'root',
  database: 'accounts',
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  // entities: ['../**/*.entity.{ts,js}'],
  migrationsTableName: 'custom_migration_table',
  migrations: ['./apps/accounting-service/migrations/**/*.ts'],
  connectTimeoutMS: 100000000,
  cli: {
    migrationsDir: './apps/accounting-service/migrations',
  },
  // ssl: { rejectUnauthorized: false },
};
