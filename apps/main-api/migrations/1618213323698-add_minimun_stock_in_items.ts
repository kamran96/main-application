import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addMinimunStockInItems1618213323698 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'minimumStock',
        type: 'int',
        default: 0,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('items', 'minimumStock');
  }
}
