import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterAttributeDicountInInvoice1605095953505
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'discount');
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'discount',
        isNullable: true,
        type: 'float',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'discount');
  }
}
