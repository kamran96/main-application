import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterTypeInTransactionItems1605683522503
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transaction_items', 'transaction_type');
    await queryRunner.addColumn(
      'transaction_items',
      new TableColumn({
        name: 'transactionType',
        isNullable: true,
        type: 'integer',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transaction_items', 'transactionType');
  }
}
