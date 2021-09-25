import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterTransactions1606288095812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'notes',
        isNullable: true,
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'transaction_items',
      new TableColumn({
        name: 'description',
        isNullable: true,
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'notes');
    await queryRunner.dropColumn('transaction_items', 'description');
  }
}
