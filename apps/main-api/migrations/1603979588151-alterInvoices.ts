import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterInvoices1603979588151 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'type');
    await queryRunner.dropColumn('prices', 'type');
    await queryRunner.dropColumn('invoices', 'invoiceNumber');
    await queryRunner.dropColumn('invoice_items', 'quantity');
    await queryRunner.dropColumn('invoice_items', 'itemDiscount');

    await queryRunner.addColumn(
      'prices',
      new TableColumn({
        name: 'priceType',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'invoiceNumber',
        isNullable: true,
        type: 'varchar',
      })
    );

    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'invoiceType',
        isNullable: true,
        type: 'varchar',
      })
    );

    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'isActive',
        isNullable: true,
        default: false,
        type: 'boolean',
      })
    );

    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'isTaxIncluded',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'tax',
        isNullable: true,
        type: 'text',
      })
    );

    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'currency',
        isNullable: true,
        type: 'varchar',
      })
    );

    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'unitPrice',
        isNullable: true,
        type: 'float',
      })
    );

    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'quantity',
        isNullable: true,
        type: 'varchar',
      })
    );

    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'itemDiscount',
        isNullable: true,
        type: 'varchar',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
