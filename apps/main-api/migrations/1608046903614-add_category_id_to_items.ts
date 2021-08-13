import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addCategoryIdToItems1608046903614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropColumn('attributes', 'customAttribute');

    await queryRunner.addColumn(
      'attributes',
      new TableColumn({
        name: 'values',
        isNullable: true,
        type: 'json',
      }),
    );

    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'categoryId',
        isNullable: true,
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'items',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('attributes', 'values');
    await queryRunner.dropColumn('items', 'categoryId');
  }
}
