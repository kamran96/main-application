import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class banks1604922986751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'banks',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'name', isNullable: true, type: 'varchar' },
          { name: 'description', isNullable: true, type: 'varchar' },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('banks');
  }
}
