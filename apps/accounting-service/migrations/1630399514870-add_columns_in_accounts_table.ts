import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addColumnsInAccountsTable1630399514870 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'accounts',
            new TableColumn({
                name: 'importedFrom',
                isNullable: true,
                type: 'varchar',
              }
        ));
        await queryRunner.addColumn(
            'accounts',
            new TableColumn({
                name: 'importedAccountId',
                isNullable: true,
                type: 'int',
              }
        ));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('accounts',['importedFrom','importedAccountId']);
    }

}
