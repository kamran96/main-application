import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addOpeningStockInItems1608380535897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'openingStock',
        isNullable: true,
        type: 'float',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('items', 'openingStock');
  }
}
