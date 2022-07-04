import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterCreatedAtInUsers1600159328695 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'created_at');
    await queryRunner.dropColumn('users', 'updated_at');
    await queryRunner.dropColumn('users', 'created_by');
    await queryRunner.dropColumn('users', 'updated_by');

    await queryRunner.dropColumn('user_roles', 'created_at');
    await queryRunner.dropColumn('user_roles', 'updated_at');

    // updating users attributes
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'createdById',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'updatedById',
        isNullable: true,
        type: 'int',
      })
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'NOW()',
      })
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'NOW()',
      })
    );

    // updating user_roles attributes
    await queryRunner.addColumn(
      'user_roles',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'NOW()',
      })
    );
    await queryRunner.addColumn(
      'user_roles',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'NOW()',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
