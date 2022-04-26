import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addInvoiceIdInInvoices1624273830255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'purchaseId',
        type: 'int',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'purchases',
      new TableForeignKey({
        columnNames: ['purchaseId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'purchases',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'invoiceId',
        type: 'int',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['invoiceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'invoices',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoiceId', 'invoices');
    await queryRunner.dropColumn('purchaseId', 'purchases');
  }
}
