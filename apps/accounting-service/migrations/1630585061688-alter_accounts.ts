import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterAccounts1630585061688 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accounts', 'organizationId');
    await queryRunner.dropColumn('accounts', 'branchId');
    await queryRunner.dropColumn('accounts', 'createdById');
    await queryRunner.dropColumn('accounts', 'updatedById');
    await queryRunner.dropColumn('accounts', 'importedAccountId');

    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'importedAccountId',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'varchar',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
