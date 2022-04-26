import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterItemCodeInItems1608553175433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('items', 'code');

    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'code',
        isNullable: true,
        type: 'varchar',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('items', 'code');
  }
}
