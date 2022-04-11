import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addProductTypeToItems1602671004452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'itemType',
        isNullable: true,
        type: 'smallint',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
