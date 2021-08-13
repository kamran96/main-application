import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addColumnTransactionIdInPatyments1605248450062 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('payments',
        new TableColumn({
            name: 'transactionId',
            isNullable: true,
            type: 'int',
          })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
     await queryRunner.dropColumn('payments', 'transactionId')
    }

}
