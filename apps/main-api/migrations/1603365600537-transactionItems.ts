import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class transactionItems1603365600537 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction_items',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'amount', isNullable: true, type: 'float' },
          { name: 'type', isNullable: true, type: 'smallint' },
          { name: 'accountId', isNullable: true, type: 'int' },
          { name: 'transactionId', isNullable: true, type: 'int' },
          { name: 'branchId', isNullable: true, type: 'int' },
          { name: 'organizationId', isNullable: true, type: 'int' },
          { name: 'status', isNullable: true, type: 'int' },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'createdById', type: 'int', isNullable: true },
          { name: 'updatedById', type: 'int', isNullable: true },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'transaction_items',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'transaction_items',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'transaction_items',
      new TableForeignKey({
        columnNames: ['accountId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'transaction_items',
      new TableForeignKey({
        columnNames: ['transactionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transactions',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('transaction_items');
  }
}
