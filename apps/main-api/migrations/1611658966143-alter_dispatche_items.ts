import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class alterDispatcheItems1611658966143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dispatch_items',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'dispatchId', isNullable: true, type: 'int' },
          { name: 'itemId', isNullable: true, type: 'int' },
          { name: 'quantity', isNullable: true, type: 'int' },
          { name: 'discount', isNullable: true, type: 'varchar' },
          { name: 'status', isNullable: true, type: 'integer' },
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
      'dispatch_items',
      new TableForeignKey({
        columnNames: ['dispatchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dispatches',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'dispatch_items',
      new TableForeignKey({
        columnNames: ['itemId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'items',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'dispatch_items',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'dispatch_items',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'dispatch_items',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'dispatch_items',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dispatch_items');
  }
}
