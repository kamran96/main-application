import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterColumnTypeTransactionItems1605192169264
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transaction_items', 'type');
    await queryRunner.addColumn(
      'transaction_items',
      new TableColumn({
        name: 'transaction_type',
        isNullable: true,
        type: 'integer',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transaction_items', 'transaction_type');
  }
}
