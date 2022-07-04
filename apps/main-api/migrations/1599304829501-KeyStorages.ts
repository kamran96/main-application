import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from 'typeorm';

export class KeyStorages1599304829501 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'KeyStorages',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar', // head name for grouping items
            isNullable: true,
          },
          {
            name: 'status',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'branchId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'createdBy',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'updatedBy',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
      true
    );
    await queryRunner.createForeignKey(
      'KeyStorages',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Branches',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('KeyStorages');
  }
}
