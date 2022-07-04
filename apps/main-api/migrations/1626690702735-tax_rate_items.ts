import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class taxRateItems1626690702735 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tax_rate_items',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'taxRateId', isNullable: true, type: 'int' },
          { name: 'name', isNullable: true, type: 'varchar' },
          { name: 'rate', isNullable: true, type: 'varchar' },
          { name: 'compound', default: false, type: 'boolean' },
          { name: 'organizationId', isNullable: true, type: 'int' },
          { name: 'branchId', isNullable: true, type: 'int' },
          { name: 'status', isNullable: true, type: 'int' },
          { name: 'createdById', isNullable: true, type: 'int' },
          { name: 'updatedById', isNullable: true, type: 'int' },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'tax_rate_items',
      new TableForeignKey({
        columnNames: ['taxRateId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tax_rates',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'tax_rate_items',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'tax_rate_items',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'tax_rate_items',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'tax_rate_items',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tax_rate_items');
  }
}
