import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class transaction1603365192213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'amount', isNullable: true, type: 'float' },
          { name: 'ref', isNullable: false, type: 'varchar(255)' },
          { name: 'narration', isNullable: true, type: 'varchar(255)' },
          { name: 'date', isNullable: true, type: 'date' },
          { name: 'branchId', isNullable: true, type: 'int' },
          { name: 'organizationId', isNullable: true, type: 'int' },
          { name: 'status', isNullable: true, type: 'int' },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'createdById', type: 'int', isNullable: true },
          { name: 'updatedById', type: 'int', isNullable: true },
        ],
      }),
      true,
    );

    // await queryRunner.createForeignKey(
    //   'transactions',
    //   new TableForeignKey({
    //     columnNames: ['branchId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'branches',
    //     onDelete: 'CASCADE',
    //   }),
    // );

    // await queryRunner.createForeignKey(
    //   'transactions',
    //   new TableForeignKey({
    //     columnNames: ['organizationId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'organizations',
    //     onDelete: 'CASCADE',
    //   }),
    // );
    await queryRunner.createIndex("transactions", new TableIndex({
      name: "transactions_indexes",
      columnNames: ["branchId", "organizationId"]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
    await queryRunner.dropIndex('transactions','transactions_indexes');
  }
}
