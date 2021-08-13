import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterInvoiceTypeInPurchases1611149496824
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'invoiceType');

    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'invoiceType',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'invoiceType');
  }
}
