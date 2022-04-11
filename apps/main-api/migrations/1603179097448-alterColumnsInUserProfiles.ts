import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterColumnsInUserProfiles1603179097448
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_profiles',
      new TableColumn({
        name: 'website',
        isNullable: true,
        type: 'varchar(255)',
      })
    );
    await queryRunner.addColumn(
      'user_profiles',
      new TableColumn({
        name: 'location',
        isNullable: true,
        type: 'varchar(255)',
      })
    );
    await queryRunner.addColumn(
      'user_profiles',
      new TableColumn({
        name: 'bio',
        isNullable: true,
        type: 'varchar(255)',
      })
    );
    await queryRunner.addColumn(
      'user_profiles',
      new TableColumn({
        name: 'jobTitle',
        isNullable: true,
        type: 'varchar(255)',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
