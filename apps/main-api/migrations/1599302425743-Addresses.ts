import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Addresses1599302425743 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Addresses',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'city',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'town',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'type',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'postalCode',
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Addresses');
    }

}
