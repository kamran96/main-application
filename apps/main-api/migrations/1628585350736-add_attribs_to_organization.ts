import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addAttribsToOrganization1628585350736
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'organizations',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'organizations',
      new TableColumn({
        name: 'website',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'organizations',
      new TableColumn({
        name: 'attachmentId',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'organizations',
      new TableColumn({
        name: 'addressId',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'branches',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'branches',
      new TableColumn({
        name: 'prefix',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'branches',
      new TableColumn({
        name: 'addressId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'branches',
      new TableForeignKey({
        columnNames: ['addressId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'addressId',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'organizations',
      new TableForeignKey({
        columnNames: ['attachmentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'attachments',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'organizations',
      new TableForeignKey({
        columnNames: ['addressId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'addresses',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('organizations', 'email');
    await queryRunner.dropColumn('organizations', 'website');
    await queryRunner.dropColumn('organizations', 'attachmentId');
    await queryRunner.dropColumn('organizations', 'addressId');
  }
}
