const { getMetadataArgsStorage } = require('typeorm');
require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  type: 'postgres',
  host: process.env.REP_DB_HOST,
  port: parseInt(process.env.REP_DB_PORT, 10),
  username: process.env.REP_DB_USER,
  password: process.env.REP_DB_PASSWORD,
  database: process.env.REP_DB_NAME,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  migrationsTableName: 'custom_migration_table',
  migrations: ['./apps/reports-service/migrations/**/*.ts'],
  connectTimeoutMS: 100000000,
  cli: {
    migrationsDir: './apps/reports-service/migrations',
  },
  // ssl: { rejectUnauthorized: false },
};
