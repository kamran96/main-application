import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addAccountIdInBankAccounts1623323383809
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'bank_accounts',
      new TableColumn({
        name: 'accountId',
        type: 'int',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'bank_accounts',
      new TableForeignKey({
        columnNames: ['accountId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('bank_accounts', 'accountId');
  }
}
