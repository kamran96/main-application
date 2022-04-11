import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class SecondaryAccounts1599808199484 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'SecondaryAccounts',
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
            name: 'primaryAccountId',
            type: 'int',
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
            isNullable: true,
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
      'SecondaryAccounts',
      new TableForeignKey({
        columnNames: ['primaryAccountId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'PrimaryAccounts',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'SecondaryAccounts',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Branches',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('SecondaryAccounts');
  }
}
