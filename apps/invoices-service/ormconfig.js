const { getMetadataArgsStorage } = require('typeorm');
require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  type: 'postgres',
  host: process.env.INV_DB_HOST,
  port: parseInt(process.env.INV_DB_PORT, 10),
  username: process.env.INV_DB_USER,
  password: process.env.INV_DB_PASSWORD,
  database: process.env.INV_DB_NAME,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  migrationsTableName: 'custom_migration_table',
  migrations: ['./apps/invoices-service/migrations/**/*.ts'],
  connectTimeoutMS: 100000000,
  cli: {
    migrationsDir: './apps/invoices-service/migrations',
  },
  ssl: { rejectUnauthorized: false },
};