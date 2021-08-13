import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnStatusInContacts1600858118891
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'status',
        isNullable: true,
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('contacts', 'status');
  }
}
