import { MigrationInterface, QueryRunner } from 'typeorm';
import { TableColumn } from 'typeorm/schema-builder/table/TableColumn';

export class alterTableCommonAttributes1600078540375
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('items', 'updatedBy');
    // accounts table related
    await queryRunner.dropColumn('accounts', 'createdBy');
    await queryRunner.dropColumn('accounts', 'updatedBy');
    // branches table related
    await queryRunner.dropColumn('branches', 'createdBy');
    await queryRunner.dropColumn('branches', 'updatedBy');
    // contacts table related
    await queryRunner.dropColumn('contacts', 'createdBy');
    await queryRunner.dropColumn('contacts', 'updatedBy');
    // invice_items related table
    await queryRunner.dropColumn('invoice_items', 'createdBy');
    // invoices related table
    await queryRunner.dropColumn('invoices', 'createdBy');
    // keystorages related table
    await queryRunner.dropColumn('key_storages', 'createdBy');
    await queryRunner.dropColumn('key_storages', 'updatedBy');
    // primary accounts related table
    await queryRunner.dropColumn('primary_accounts', 'createdBy');
    await queryRunner.dropColumn('primary_accounts', 'updatedBy');
    // secondary accounts related table
    await queryRunner.dropColumn('secondary_accounts', 'createdBy');
    await queryRunner.dropColumn('secondary_accounts', 'updatedBy');

    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'NOW()',
      })
    );
    // updating accounts table attributes
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'createdByID',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'updatedByID',
        isNullable: true,
        type: 'int',
      })
    );
    // updating branches table attributes
    await queryRunner.addColumn(
      'branches',
      new TableColumn({
        name: 'createdByID',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.addColumn(
      'branches',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'int',
      })
    );
    // updating contacts table attributes
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'int',
      })
    );
    // updating invoice_items table attributes
    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      })
    );
    // updating invoices table attributes
    await queryRunner.addColumn(
      'invoices',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      })
    );
    // updating key storages table attributes
    await queryRunner.addColumn(
      'key_storages',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.addColumn(
      'key_storages',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'int',
      })
    );
    // now updating primary accounts table
    await queryRunner.addColumn(
      'primary_accounts',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.addColumn(
      'primary_accounts',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'int',
      })
    );
    // now updating secondary accounts table
    await queryRunner.addColumn(
      'secondary_accounts',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.addColumn(
      'secondary_accounts',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'int',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
