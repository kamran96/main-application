import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterTransactions1631015062812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'branchId');
    await queryRunner.dropColumn('transactions', 'organizationId');
    await queryRunner.dropColumn('transactions', 'createdById');
    await queryRunner.dropColumn('transactions', 'updatedById');
    await queryRunner.dropColumn('transaction_items', 'branchId');
    await queryRunner.dropColumn('transaction_items', 'organizationId');
    await queryRunner.dropColumn('transaction_items', 'createdById');
    await queryRunner.dropColumn('transaction_items', 'updatedById');

    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'transaction_items',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'transaction_items',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'transaction_items',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'transaction_items',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'varchar',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'branchId');
    await queryRunner.dropColumn('transactions', 'organizationId');
    await queryRunner.dropColumn('transactions', 'createdById');
    await queryRunner.dropColumn('transactions', 'updatedById');
    await queryRunner.dropColumn('transaction_items', 'branchId');
    await queryRunner.dropColumn('transaction_items', 'organizationId');
    await queryRunner.dropColumn('transaction_items', 'createdById');
    await queryRunner.dropColumn('transaction_items', 'updatedById');
  }
}
