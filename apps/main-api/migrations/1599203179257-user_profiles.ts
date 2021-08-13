import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class userProfiles1599203179257 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'UserProfiles',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true
                    },
                    {
                        name: 'userId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'fullName',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'country',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'phoneNumber',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'landLine',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'cnic',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'marketingStatus',
                        type: 'int',
                        isNullable: true,
                    },
                ]
            }),
            true,
        );
        await queryRunner.createForeignKey(
            'UserProfiles',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Users',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('UserProfiles');
    }

}
