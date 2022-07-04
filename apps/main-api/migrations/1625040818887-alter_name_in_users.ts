import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterNameInUsers1625040818887 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table users alter column name drop not null;
            alter table users rename column name to username;`
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'email');
  }
}
