import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnnIsSystemAccountInAccounts1605265932027
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'isSystemAccount',
        isNullable: false,
        default: false,
        type: 'boolean',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accounts', 'isSystemAccount');
  }
}
