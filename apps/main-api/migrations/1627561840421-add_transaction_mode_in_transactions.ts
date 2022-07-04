import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addTransactionModeInTransactions1627561840421
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'transactionMode',
        type: 'smallint',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'transactionMode');
  }
}
