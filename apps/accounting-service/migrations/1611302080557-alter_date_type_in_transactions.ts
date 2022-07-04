import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterDateTypeInTransactions1611302080557
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE transactions ALTER COLUMN date TYPE timestamp'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
