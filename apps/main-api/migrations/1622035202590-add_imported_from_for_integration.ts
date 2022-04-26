import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addImportedFromForIntegration1622035202590
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'importedFrom',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'importedContactId',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'importedFrom',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'importedItemId',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'importedFrom',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'importedInvoiceId',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'importedFrom',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'importedBillId',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'importedFrom',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'importedAccountId',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'importedFrom',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'importedPaymentId',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('contacts', 'importedFrom');
    await queryRunner.dropColumn('contacts', 'importedContactId');
    await queryRunner.dropColumn('items', 'importedFrom');
    await queryRunner.dropColumn('items', 'importedItemId');
    await queryRunner.dropColumn('invoices', 'importedFrom');
    await queryRunner.dropColumn('invoices', 'importedInvoiceId');
    await queryRunner.dropColumn('purchases', 'importedFrom');
    await queryRunner.dropColumn('purchases', 'importedBillId');
    await queryRunner.dropColumn('accounts', 'importedFrom');
    await queryRunner.dropColumn('accounts', 'importedAccountId');
    await queryRunner.dropColumn('payments', 'importedFrom');
    await queryRunner.dropColumn('payments', 'importedPaymentId');
  }
}
