import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addIsReturnToInvoiceAndPurchases1610015931591
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'isReturn',
        type: 'boolean',
        default: 'false',
      }),
    );

    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'isReturn',
        type: 'boolean',
        default: 'false',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'isReturn');
    await queryRunner.dropColumn('invoices', 'isReturn');
  }
}
