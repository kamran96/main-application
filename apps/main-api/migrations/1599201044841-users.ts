import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class users1599201044841 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Users',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true
                    },
                    {
                        name: 'roleId',
                        type: 'int',
                        isNullable: true
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'branchId',
                        type: 'int',
                        isNullable: true
                    },
                    {
                        name: 'organizationId',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'status',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'NOW()'
                    },
                    {
                        name: 'created_by',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'NOW()'
                    },
                    {
                        name: 'updated_by',
                        type: 'int',
                        isNullable: true
                    },
                ]
            }),
            true
        );
        await queryRunner.createForeignKey(
            'Users',
            new TableForeignKey({
                columnNames: ['branchId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Branches',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'Users',
            new TableForeignKey({
                columnNames: ['organizationId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Organizations',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'Users',
            new TableForeignKey({
                columnNames: ['roleId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'UserRoles',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Users');
    }

}
