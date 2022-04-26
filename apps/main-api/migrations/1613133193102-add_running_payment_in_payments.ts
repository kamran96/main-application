import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addRunningPaymentInPayments1613133193102
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'runningPayment',
        type: 'boolean',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('payments', 'runningPayment');
  }
}
