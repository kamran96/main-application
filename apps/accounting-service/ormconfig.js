const { getMetadataArgsStorage } = require('typeorm');
require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  type: 'postgres',
  host: process.env.ACC_DB_HOST,
  port: parseInt(process.env.ACC_DB_PORT, 10),
  username: process.env.ACC_DB_USER,
  password: process.env.ACC_DB_PASSWORD,
  database: process.env.ACC_DB_NAME,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  migrationsTableName: 'custom_migration_table',
  migrations: ['./apps/accounting-service/migrations/**/*.ts'],
  connectTimeoutMS: 100000000,
  cli: {
    migrationsDir: './apps/accounting-service/migrations',
  },
  ssl:
    process.env.NODE_ENV === 'development' ? {} : { rejectUnauthorized: false },
};
