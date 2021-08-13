import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Inovices1599380471719 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Invoices',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true
                    },
                    {
                        name: 'reference',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'contactId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'issueDate',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'dueDate',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'invoiceNumber',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'discount',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'grossTotal',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'netTotal',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'date',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'type',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'directTax',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'indirectTax',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'branchId',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: "NOW()",
                    },
                    {
                        name: 'createdBy',
                        type: 'timestamp',
                        default: "NOW()",
                    },
                ]
            }),
            true,
        );
        await queryRunner.createForeignKey(
            'Invoices',
            new TableForeignKey({
                columnNames: ['branchId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Branches',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'Invoices',
            new TableForeignKey({
                columnNames: ['contactId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Contacts',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Invoices');
    }

}
