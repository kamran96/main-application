require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['./dist/**/*.entity{.ts,.js}'],
  migrationsTableName: 'custom_migration_table',
  migrations: ['./apps/main-api/migrations/**/*.ts'],
  connectTimeoutMS: 100000000,
  cli: {
    migrationsDir: './apps/main-api/migrations',
  },
  ssl: { rejectUnauthorized: false },
};
