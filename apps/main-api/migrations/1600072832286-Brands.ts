import { MigrationInterface, QueryRunner } from "typeorm";
import { Table } from "typeorm/schema-builder/table/Table";
import { TableForeignKey } from "typeorm/schema-builder/table/TableForeignKey";

export class Brands1600072832286 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Brands',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'branchId',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'status',
                        type: 'int',
                        isNullable: false
                    },
                ]
            }), true
        );
        await queryRunner.createForeignKey(
            'Brands',
            new TableForeignKey({
                columnNames: ['branchId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Branches',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Brands');

    }

}
