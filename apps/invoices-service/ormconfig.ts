require('dotenv').config();
const { getMetadataArgsStorage } = require('typeorm');

module.exports = {
  type: 'postgres',
  host: process.env.INVOICE_DB_HOST,
  port: parseInt(process.env.INVOICE_DB_PORT, 10),
  username: process.env.INVOICE_DB_USER,
  password: process.env.INVOICE_DB_PASSWORD,
  database: process.env.INVOICE_DB_NAME,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  migrationsTableName: 'custom_migration_table',
  migrations: ['./apps/invoices-service/migrations/**/*.ts'],
  connectTimeoutMS: 100000000,
  cli: {
    migrationsDir: './apps/invoices-service/migrations',
  },
  ssl: { rejectUnauthorized: false },
};
