import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterUserRoles1614599102832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE user_roles RENAME TO roles');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
