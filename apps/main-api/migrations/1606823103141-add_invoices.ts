import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addInvoices1606823103141 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'invoices',
        isNullable: true,
        type: 'json',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('payments', 'invoices');
  }
}
