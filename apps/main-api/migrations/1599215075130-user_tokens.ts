import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class userTokens1599215075130 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'UserTokens',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true
                    },
                    {
                        name: 'userId',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'organizationId',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'expiresAt',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'accessToken',
                        type: 'varchar',
                        isNullable: true
                    }
                ]
            }),
            true,
        );
        await queryRunner.createForeignKey(
            'UserTokens',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Users',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'UserTokens',
            new TableForeignKey({
                columnNames: ['organizationId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'Organizations',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('AccessTokens');
    }

}
