import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addBranchIdToRemainingTables1608271829044
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'addresses',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'attribute_values',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'attributes',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'bank_accounts',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'invoice_items',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'purchase_items',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'addresses',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'categories',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'addresses',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'attribute_values',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'invoice_items',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'purchase_items',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'bank_accounts',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'attributes',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'categories',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'addresses',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('addresses', 'branchId');
    queryRunner.dropColumn('attribute_values', 'branchId');
    queryRunner.dropColumn('attributes', 'branchId');
    queryRunner.dropColumn('bank_accounts', 'branchId');
    queryRunner.dropColumn('categories', 'branchId');
    queryRunner.dropColumn('invoice_items', 'branchId');
    queryRunner.dropColumn('purchase_items', 'branchId');
    queryRunner.dropColumn('addresses', 'organizationId');
    queryRunner.dropColumn('categories', 'organizationId');
  }
}
