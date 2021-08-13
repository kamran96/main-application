import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class alterAddresses1609746817111 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropColumn('contacts', 'addessId');

    await queryRunner.addColumn(
      'addresses',
      new TableColumn({
        name: 'contactId',
        isNullable: true,
        type: 'int',
      }),
    );

    await queryRunner.addColumn(
      'addresses',
      new TableColumn({
        name: 'country',
        isNullable: true,
        type: 'varchar',
      }),
    );

    await queryRunner.createForeignKey(
      'addresses',
      new TableForeignKey({
        columnNames: ['contactId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'contacts',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('addresses', 'contactId');
    await queryRunner.dropColumn('addresses', 'country');
  }
}
