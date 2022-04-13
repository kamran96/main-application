import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addTransactionIdInPrices1608389401415
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'prices',
      new TableColumn({
        name: 'transactionId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.createForeignKey(
      'prices',
      new TableForeignKey({
        columnNames: ['transactionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transactions',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('prices', 'transactionId');
  }
}
