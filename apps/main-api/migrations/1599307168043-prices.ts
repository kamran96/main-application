import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class prices1599307168043 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Prices',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true
                    },
                    {
                        name: 'type',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'purchasePrice',
                        type: 'float',
                        isNullable: false,
                    },
                    {
                        name: 'salePrice',
                        type: 'float',
                        isNullable: false,
                    },
                    {
                        name: 'tradePrice',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'tradeDiscount',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'handlingCost',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'priceUnit',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'unitsInCarton',
                        type: 'int',
                        isNullable: true,
                    },
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Prices')

    }

}
