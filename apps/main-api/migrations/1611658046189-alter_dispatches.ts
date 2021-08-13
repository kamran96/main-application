import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterDispatches1611658046189 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('dispatches', 'invoiceId');

    await queryRunner.addColumn(
      'dispatches',
      new TableColumn({
        name: 'reference',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'dispatches',
      new TableColumn({
        name: 'dispatch_no',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'dispatches',
      new TableColumn({
        name: 'discount',
        type: 'float',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'dispatches',
      new TableColumn({
        name: 'grossTotal',
        type: 'float',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'dispatches',
      new TableColumn({
        name: 'netTotal',
        type: 'float',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'dispatches',
      new TableColumn({
        name: 'remaining',
        type: 'float',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('dispatches', 'reference');
    await queryRunner.dropColumn('dispatches', 'dispatch_no');
    await queryRunner.dropColumn('dispatches', 'discount');
    await queryRunner.dropColumn('dispatches', 'grossTotal');
    await queryRunner.dropColumn('dispatches', 'netTotal');
    await queryRunner.dropColumn('dispatches', 'remaining');
  }
}
