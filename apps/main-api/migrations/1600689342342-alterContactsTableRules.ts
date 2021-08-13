import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterContactsTableRules1600689342342
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('contacts', 'branchId');
    await queryRunner.dropColumn('contacts', 'addressId');
    await queryRunner.dropColumn('contacts', 'status');
    await queryRunner.dropColumn('contacts', 'createdById');
    await queryRunner.dropColumn('contacts', 'updatedById');
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'addressId',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
