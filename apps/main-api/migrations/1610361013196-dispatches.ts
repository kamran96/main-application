import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class dispatches1610361013196 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dispatches',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'invoiceId', isNullable: true, type: 'int' },
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
      'dispatches',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'dispatches',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'dispatches',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'dispatches',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dispatches');
  }
}
