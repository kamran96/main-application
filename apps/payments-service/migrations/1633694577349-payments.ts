import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class payments1633694577349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'comment', type: 'varchar', isNullable: true },
          { name: 'reference', type: 'varchar', isNullable: true },
          { name: 'amount', type: 'float', isNullable: true },
          { name: 'dueDate', type: 'timestamp', isNullable: true },
          { name: 'paymentType', type: 'smallint', isNullable: true },
          { name: 'paymentMode', type: 'smallint', isNullable: true },
          { name: 'contactId', type: 'varchar', isNullable: true },
          { name: 'invoiceId', type: 'int', isNullable: true },
          { name: 'billId', type: 'int', isNullable: true },
          { name: 'date', type: 'timestamp', isNullable: true },
          { name: 'entryType', type: 'smallint', isNullable: true },
          { name: 'runningPayment', type: 'boolean', isNullable: true },
          { name: 'importedFrom', type: 'varchar', isNullable: true },
          { name: 'importedPaymentId', type: 'varchar', isNullable: true },
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
    await queryRunner.dropTable('payments');
  }
}
