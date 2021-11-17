const { getMetadataArgsStorage } = require('typeorm');
require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  type: 'postgres',
  host: process.env.PAYMENT_DB_HOST,
  port: parseInt(process.env.PAYMENT_DB_PORT, 10),
  username: process.env.PAYMENT_DB_USER,
  password: process.env.PAYMENT_DB_PASSWORD,
  database: process.env.PAYMENT_DB_NAME,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  migrationsTableName: 'custom_migration_table',
  migrations: ['./apps/payments-service/migrations/**/*.ts'],
  connectTimeoutMS: 100000000,
  cli: {
    migrationsDir: './apps/payments-service/migrations',
  },
  // ssl: { rejectUnauthorized: false },
};
