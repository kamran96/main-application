import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterPurchaseAndSalePrice1624264744797
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table prices alter column "purchasePrice" drop not null`,
    );
    await queryRunner.query(
      `alter table prices alter column "salePrice" drop not null`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
