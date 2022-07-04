import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class addBranchIdToRemainingTables1608271829044
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'bank_accounts',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.createIndex(
      'bank_accounts',
      new TableIndex({
        name: 'bank_account_indexes',
        columnNames: ['organizationId', 'branchId'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('bank_accounts', 'branchId');
  }
}
