import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addHasCategoryAndInventoryInItems1623918153767
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'hasCategory',
        type: 'boolean',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'hasInventory',
        type: 'boolean',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
