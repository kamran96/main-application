import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addOrganizationIdToContact1604328316962
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('addresses', 'type');

    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.createForeignKey(
      'contacts',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.addColumn(
      'items',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.createForeignKey(
      'items',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.addColumn(
      'addresses',
      new TableColumn({
        name: 'addressType',
        isNullable: true,
        type: 'int',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
