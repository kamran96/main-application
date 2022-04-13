import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addOpeningBalanceInContact1609749567529
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'openingBalance',
        isNullable: true,
        type: 'float',
      })
    );

    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'transactionId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.createForeignKey(
      'contacts',
      new TableForeignKey({
        columnNames: ['transactionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transactions',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('contacts', 'openingBalance');
    await queryRunner.dropColumn('contacts', 'transactionId');
  }
}
