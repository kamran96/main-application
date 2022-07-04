import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterCreatedByID1600084449547 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('items', 'createdByID');
    await queryRunner.dropColumn('items', 'updatedByID');

    await queryRunner.dropColumn('accounts', 'createdByID');
    await queryRunner.dropColumn('accounts', 'updatedByID');

    await queryRunner.dropColumn('branches', 'createdByID');

    // updating account attributes
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'int',
      })
    );

    // updating branch attributes
    await queryRunner.addColumn(
      'branches',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      })
    );

    // updating items attributes
    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'int',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
