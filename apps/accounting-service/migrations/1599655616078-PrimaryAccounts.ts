import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class PrimaryAccounts1599655616078 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'PrimaryAccounts',
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
            name: 'branchId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'createdBy',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updatedBy',
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
        ],
      }),
      true
    );
    // await queryRunner.createForeignKey(
    //     'PrimaryAccounts',
    //     new TableForeignKey({
    //         columnNames: ['branchId'],
    //         referencedColumnNames: ['id'],
    //         referencedTableName: 'Branches',
    //         onDelete: 'CASCADE',
    //     }),
    // );
    await queryRunner.createIndex(
      'PrimaryAccounts',
      new TableIndex({
        name: 'PrimaryAccounts_indexes',
        columnNames: ['branchId'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('PrimaryAccounts');
    await queryRunner.dropIndex('PrimaryAccounts', 'PrimaryAccounts_index');
  }
}
