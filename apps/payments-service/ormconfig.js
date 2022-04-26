const { getMetadataArgsStorage } = require('typeorm');
require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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
