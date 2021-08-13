import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addCommentInPurchases1606906920033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'purchases',
      new TableColumn({
        name: 'comment',
        isNullable: true,
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchases', 'comment');
  }
}
