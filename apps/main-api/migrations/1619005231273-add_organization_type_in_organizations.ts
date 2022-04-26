import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addOrganizationTypeInOrganizations1619005231273
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'organizations',
      new TableColumn({
        name: 'organizationType',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('organizations', 'organizationType');
  }
}
