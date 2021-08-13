import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class InoviceItems1599380496820 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "InvoiceItems",
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true
                    },
                    {
                        name: 'invoiceId',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'itemId',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'quantity',
                        type: 'float',
                        isNullable: false
                    },
                    {
                        name: 'itemDiscount',
                        type: 'float',
                        isNullable: true
                    },
                    {
                        name: 'total',
                        type: 'float',
                        isNullable: false
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: "NOW()"
                    },
                    {
                        name: 'createdBy',
                        type: 'timestamp',
                        default: "NOW()"
                    },
                ]
            }), true
        );
        await queryRunner.createForeignKey(
            'InvoiceItems',
            new TableForeignKey({
                columnNames: ['invoiceId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Invoices',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'InvoiceItems',
            new TableForeignKey({
                columnNames: ['itemId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Items',
                onDelete: 'CASCADE',
            }),
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('InvoiceItems')
    }

}
