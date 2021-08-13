import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class userCode1628597678650 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_codes',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'code', isNullable: true, type: 'varchar' },
          { name: 'expiresAt', isNullable: true, type: 'timestamp' },
          { name: 'userId', isNullable: true, type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user_codes',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_codes');
  }
}
