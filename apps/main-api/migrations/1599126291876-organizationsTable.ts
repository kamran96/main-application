import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { query } from "express";

export class organizationsTable1599126291876 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Organizations',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'permanentAddress',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'residentialAddress',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'niche',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'financialEnding',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'status',
                        type: 'int',
                        isNullable: true
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'NOW()'
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'NOW()'
                    },
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Organizations');
    }

}
