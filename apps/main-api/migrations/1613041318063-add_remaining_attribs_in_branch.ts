import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addRemainingAttribsInBranch1613041318063
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'branches',
      new TableColumn({
        name: 'phone_no',
        type: 'varchar(255)',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'branches',
      new TableColumn({
        name: 'fax_no',
        type: 'varchar(255)',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('branches', 'phone_no');
    await queryRunner.dropColumn('branches', 'fax_no');
  }
}
