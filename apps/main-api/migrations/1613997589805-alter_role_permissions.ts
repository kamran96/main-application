import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class alterRolePermissions1613997589805 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('role_permissions', 'branchId');
    await queryRunner.dropColumn('role_permissions', 'organizationId');
    await queryRunner.dropColumn('role_permissions', 'model');
    await queryRunner.dropColumn('role_permissions', 'action');
    await queryRunner.dropColumn('role_permissions', 'userId');

    await queryRunner.addColumn(
      'role_permissions',
      new TableColumn({
        name: 'permissionId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'user_roles',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'role_permissions',
      new TableForeignKey({
        columnNames: ['permissionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'user_roles',
      new TableColumn({
        name: 'parentId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        columnNames: ['parentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user_roles',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'user_roles',
      new TableColumn({
        name: 'organizationId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
