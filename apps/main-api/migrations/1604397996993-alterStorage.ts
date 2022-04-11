import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class alterStorage1604397996993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('key_storages', 'name');
    await queryRunner.dropColumn('key_storages', 'type');

    await queryRunner.addColumn(
      'key_storages',
      new TableColumn({
        name: 'key',
        isNullable: true,
        type: 'varchar',
      })
    );

    await queryRunner.addColumn(
      'key_storages',
      new TableColumn({
        name: 'value',
        isNullable: true,
        type: 'jsonb',
      })
    );

    await queryRunner.addColumn(
      'key_storages',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.createForeignKey(
      'key_storages',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
