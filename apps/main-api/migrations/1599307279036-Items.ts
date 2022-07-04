import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from 'typeorm';

export class Items1599307279036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Items',
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
            name: 'barcode',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'keyId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'priceId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'branchId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'CreatedBy',
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
            isNullable: true,
          },
        ],
      }),
      true
    );
    await queryRunner.createForeignKey(
      'Items',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Branches',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'Items',
      new TableForeignKey({
        columnNames: ['keyId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'KeyStorages',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'Items',
      new TableForeignKey({
        columnNames: ['priceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Prices',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Items');
  }
}
