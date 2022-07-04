import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addContactType1604485424605 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'contactType',
        isNullable: true,
        type: 'int',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
