import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addPrivilegeInRolePermission1614600735198
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('role_permissions', 'privilege');

    await queryRunner.addColumn(
      'role_permissions',
      new TableColumn({
        name: 'hasPermission',
        isNullable: true,
        type: 'boolean',
      }),
    );

    await queryRunner.addColumn(
      'role_permissions',
      new TableColumn({
        name: 'organizationId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'role_permissions',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('role_permissions', 'hasPermission');
    await queryRunner.dropColumn('role_permissions', 'organizationId');
  }
}
