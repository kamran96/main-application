const { getMetadataArgsStorage } = require('typeorm');
require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  type: 'postgres',
  host: process.env.AC_DB_HOST,
  port: parseInt(process.env.AC_DB_PORT, 10),
  username: process.env.AC_DB_USER,
  password: process.env.AC_DB_PASSWORD,
  database: process.env.AC_DB_DATABASE,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  migrationsTableName: 'custom_migration_table',
  migrations: ['./apps/accounting-service/migrations/**/*.ts'],
  connectTimeoutMS: 100000000,
  cli: {
    migrationsDir: './apps/accounting-service/migrations',
  },
  ssl: { rejectUnauthorized: false },
};
