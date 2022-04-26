import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class alterCodeInAccount1603360269295 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accounts', 'code');
    await queryRunner.dropColumn('accounts', 'secodaryAccountId');
    await queryRunner.dropColumn('primary_accounts', 'branchId');
    await queryRunner.dropColumn('secondary_accounts', 'branchId');

    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'code',
        isNullable: true,
        type: 'varchar',
      })
    );

    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'secondaryAccountId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'branchId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.addColumn(
      'primary_accounts',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.addColumn(
      'secondary_accounts',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      })
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'branches',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'primary_accounts',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'secondary_accounts',
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'accounts',
      new TableForeignKey({
        columnNames: ['secondaryAccountId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secondary_accounts',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
