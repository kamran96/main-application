import { MigrationInterface, QueryRunner, TableForeignKey, Table } from "typeorm";

export class rolePermissions1599217877313 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'RolePermissions',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true
                    },
                    {
                        name: 'branchId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'roleId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'userId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'model',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'action',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'privilege',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'int',
                        isNullable: true,
                    }
                ]
            }),
            true,
        );
        await queryRunner.createForeignKey(
            'RolePermissions',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Users',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'RolePermissions',
            new TableForeignKey({
                columnNames: ['branchId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Branches',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'RolePermissions',
            new TableForeignKey({
                columnNames: ['roleId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'UserRoles',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('RolePermisions');
    }

}
