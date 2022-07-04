import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addIsMainToBranch1610363439311 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'branches',
      new TableColumn({
        name: 'isMain',
        type: 'boolean',
        default: 'false',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('branches', 'isMain');
  }
}
