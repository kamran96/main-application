import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addLevelInRoles1615207900858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'roles',
      new TableColumn({
        name: 'level',
        type: 'smallint',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('roles', 'level');
  }
}
