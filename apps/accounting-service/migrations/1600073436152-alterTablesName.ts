import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTablesName1600073436152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "Accounts" RENAME TO "accounts"');
    await queryRunner.query(
      'ALTER TABLE "PrimaryAccounts" RENAME TO "primary_accounts"'
    );
    await queryRunner.query(
      'ALTER TABLE "SecondaryAccounts" RENAME TO "secondary_accounts"'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "accounts" RENAME TO "Accounts"');
    await queryRunner.query(
      'ALTER TABLE "primary_accounts" RENAME TO "PrimaryAccounts"'
    );
    await queryRunner.query(
      'ALTER TABLE "secondary_accounts" RENAME TO "SecondaryAccounts"'
    );
  }
}
