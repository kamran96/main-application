import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addInitialPurchasePrice1615892327969
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'prices',
      new TableColumn({
        name: 'initialPurchasePrice',
        type: 'float',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('prices', 'initialPurchasePrice');
  }
}
