import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class checkMigration1629965695447 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.createTable(
    //     new Table({
    //         name: "PrimaryAccounts",
    //         columns: [
    //             {
    //                 name: 'id',
    //                 type: 'serial',
    //                 isPrimary: true
    //             },
    //             {
    //                 name: 'name',
    //                 type: 'varchar',
    //                 isNullable: true
    //             },
    //             {
    //                 name: 'branchId',
    //                 type: 'int',
    //                 isNullable: true
    //             },
    //             {
    //                 name: 'status',
    //                 type: 'int',
    //                 isNullable: true
    //             },
    //             {
    //                 name: 'createdBy',
    //                 type: 'int',
    //                 isNullable: true
    //             },
    //             {
    //                 name: 'updatedBy',
    //                 type: 'int',
    //                 isNullable: true
    //             },
    //             {
    //                 name: 'createdAt',
    //                 type: 'timestamp',
    //                 default: "NOW()"
    //             },
    //             {
    //                 name: 'updatedAt',
    //                 type: 'timestamp',
    //                 default: "NOW()"
    //             },
    //         ]
    //     }), true
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropTable('PrimaryAccounts');
  }
}
