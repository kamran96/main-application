import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class bankAccounts1604923548373 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bank_accounts',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'name', isNullable: true, type: 'varchar' },
          { name: 'accountNumber', isNullable: true, type: 'varchar' },
          { name: 'accountType', isNullable: true, type: 'smallint' },
          { name: 'bankId', isNullable: false, type: 'int' },
          { name: 'organizationId', isNullable: true, type: 'int' },
          { name: 'status', isNullable: true, type: 'int' },
          { name: 'createdById', type: 'int', isNullable: true },
          { name: 'updatedById', type: 'int', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'bank_accounts',
      new TableForeignKey({
        columnNames: ['bankId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'banks',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
