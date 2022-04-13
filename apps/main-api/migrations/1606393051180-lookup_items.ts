import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class lookupItems1606393051180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lookup_items',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'title', isNullable: true, type: 'varchar' },
          { name: 'description', isNullable: true, type: 'varchar' },
          { name: 'status', isNullable: true, type: 'integer' },
          { name: 'lookupId', isNullable: true, type: 'integer' },
          { name: 'organizationId', isNullable: true, type: 'integer' },
          { name: 'branchId', isNullable: true, type: 'integer' },
          { name: 'createdById', isNullable: true, type: 'integer' },
          { name: 'updatedById', isNullable: true, type: 'integer' },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'lookup_items',
      new TableForeignKey({
        columnNames: ['lookupId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lookups',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'lookup_items',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'lookup_items',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'lookup_items',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'lookup_items',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
