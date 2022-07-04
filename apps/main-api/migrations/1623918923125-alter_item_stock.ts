import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterItemStock1623918923125 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table items alter column stock drop not null;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
