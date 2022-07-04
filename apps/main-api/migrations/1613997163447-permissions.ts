import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class permissions1613997163447 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'title', type: 'varchar' },
          { name: 'description', isNullable: true, type: 'varchar' },
          { name: 'module', type: 'varchar' },
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permissions');
  }
}
