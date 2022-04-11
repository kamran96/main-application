import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class attributeValues1607685191493 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'attribute_values',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'value',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'itemId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'organizationId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'attributeId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'int',
            isNullable: true,
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
            name: 'createdById',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updatedById',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'attribute_values',
      new TableForeignKey({
        columnNames: ['itemId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'items',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'attribute_values',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'attribute_values',
      new TableForeignKey({
        columnNames: ['attributeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'attributes',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'attribute_values',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'attribute_values',
      new TableForeignKey({
        columnNames: ['updatedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('attribute_values');
  }
}
