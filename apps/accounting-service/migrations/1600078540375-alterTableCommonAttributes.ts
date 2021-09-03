import { MigrationInterface, QueryRunner } from "typeorm";
import { TableColumn } from "typeorm/schema-builder/table/TableColumn";

export class alterTableCommonAttributes1600078540375 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // accounts table related
        await queryRunner.dropColumn('accounts', 'createdBy');
        await queryRunner.dropColumn('accounts', 'updatedBy');
 
        // primary accounts related table 
        await queryRunner.dropColumn('primary_accounts', 'createdBy');
        await queryRunner.dropColumn('primary_accounts', 'updatedBy');

        // secondary accounts related table 
        await queryRunner.dropColumn('secondary_accounts', 'createdBy');
        await queryRunner.dropColumn('secondary_accounts', 'updatedBy');

        // updating accounts table attributes
        await queryRunner.addColumn(
            'accounts',
            new TableColumn({
                name: 'createdByID',
                isNullable: true,
                type: 'int',
            }),
        );
        await queryRunner.addColumn(
            'accounts',
            new TableColumn({
                name: 'updatedByID',
                isNullable: true,
                type: 'int',
            }),
        );
   
        // now updating primary accounts table
        await queryRunner.addColumn(
            'primary_accounts',
            new TableColumn({
                name: 'createdById',
                isNullable: true,
                type: 'int',
            }),
        );
        await queryRunner.addColumn(
            'primary_accounts',
            new TableColumn({
                name: 'updatedById',
                isNullable: true,
                type: 'int',
            }),
        );
        // now updating secondary accounts table
        await queryRunner.addColumn(
            'secondary_accounts',
            new TableColumn({
                name: 'createdById',
                isNullable: true,
                type: 'int',
            }),
        );
        await queryRunner.addColumn(
            'secondary_accounts',
            new TableColumn({
                name: 'updatedById',
                isNullable: true,
                type: 'int',
            }),
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
