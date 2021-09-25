import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterBankAccounts1631084700844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('bank_accounts', 'branchId');
    await queryRunner.dropColumn('bank_accounts', 'organizationId');
    await queryRunner.dropColumn('bank_accounts', 'createdById');
    await queryRunner.dropColumn('bank_accounts', 'updatedById');
    await queryRunner.addColumn(
      'bank_accounts',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'bank_accounts',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'bank_accounts',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'varchar',
      })
    );
    await queryRunner.addColumn(
      'bank_accounts',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'varchar',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('bank_accounts', 'branchId');
    await queryRunner.dropColumn('bank_accounts', 'organizationId');
    await queryRunner.dropColumn('bank_accounts', 'createdById');
    await queryRunner.dropColumn('bank_accounts', 'updatedById');
  }
}
