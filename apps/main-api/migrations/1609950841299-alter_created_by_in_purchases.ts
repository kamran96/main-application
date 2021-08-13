import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class alterCreatedByInPurchases1609950841299
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'createdBy');

    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'NOW()',
      }),
    );

    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'purchases',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'purchases',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'updatedAt');
    await queryRunner.dropColumn('purchases', 'createdById');
    await queryRunner.dropColumn('purchases', 'updatedById');
  }
}
