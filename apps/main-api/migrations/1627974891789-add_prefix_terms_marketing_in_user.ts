import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addPrefixTermsMarketingInUser1627974891789
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'prefix',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'terms',
        type: 'boolean',
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'marketing',
        type: 'boolean',
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'isVerified',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'prefix');
    await queryRunner.dropColumn('users', 'terms');
    await queryRunner.dropColumn('users', 'marketingUpdates');
  }
}
