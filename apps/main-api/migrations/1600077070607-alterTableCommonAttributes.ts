import { MigrationInterface, QueryRunner } from "typeorm";
import { TableColumn } from "typeorm/schema-builder/table/TableColumn";

export class alterTableCommonAttributes1600077070607 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('items', 'createdBy');
        await queryRunner.dropColumn('items', 'CreatedBy');

        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'createdByID',
                isNullable: true,
                type: 'int',
            }),
        );
        await queryRunner.addColumn(
            'items',
            new TableColumn({
                name: 'updatedByID',
                isNullable: true,
                type: 'int',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return
    }

}
