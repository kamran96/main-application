import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addDarkModeInUsers1619591772886 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'theme',
        type: 'varchar',
        default: "'light'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'theme');
  }
}
