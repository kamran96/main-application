import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addPurchaseIdInPayments1607325307964
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'orderNumber');

    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'invoiceNumber',
        isNullable: true,
        type: 'varchar',
      })
    );

    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'purchaseId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        columnNames: ['purchaseId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'purchases',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'purchaseId');
  }
}
