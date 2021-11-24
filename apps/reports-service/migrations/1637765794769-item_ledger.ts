import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class itemLedger1637765794769 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'item_ledgers',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'quantity', type: 'float', isNullable: true },
          { name: 'itemId', type: 'varchar', isNullable: true },
          { name: 'invoiceId', type: 'int', isNullable: true },
          { name: 'billId', type: 'int', isNullable: true },
          { name: 'creditNoteId', type: 'int', isNullable: true },
          { name: 'branchId', type: 'varchar', isNullable: true },
          { name: 'organizationId', type: 'varchar', isNullable: true },
          { name: 'createdById', type: 'varchar', isNullable: true },
          { name: 'updatedById', type: 'varchar', isNullable: true },
          { name: 'status', type: 'int', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('item_ledgers');
  }
}
