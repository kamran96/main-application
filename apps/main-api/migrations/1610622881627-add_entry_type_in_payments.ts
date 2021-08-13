import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addEntryTypeInPayments1610622881627 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'entryType',
        type: 'smallint',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('payments', 'entryType');
  }
}
