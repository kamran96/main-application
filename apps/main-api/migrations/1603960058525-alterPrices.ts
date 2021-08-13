import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class alterPrices1603960058525 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'prices',
      new TableColumn({
        name: 'tax',
        isNullable: true,
        type: 'text',
      }),
    );
    await queryRunner.addColumn(
      'prices',
      new TableColumn({
        name: 'discount',
        isNullable: true,
        type: 'text',
      }),
    );
    await queryRunner.addColumn(
      'prices',
      new TableColumn({
        name: 'itemId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'prices',
      new TableForeignKey({
        columnNames: ['itemId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'items',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
