import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class addOrganizationId1603794251491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'accounts',
      new TableColumn({
        name: 'organizationId',
        isNullable: true,
        type: 'int',
      }),
    );

    // await queryRunner.createForeignKey(
    //   'accounts',
    //   new TableForeignKey({
    //     columnNames: ['organizationId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'organizations',
    //     onDelete: 'CASCADE',
    //   }),
    // );
    await queryRunner.createIndex("accounts", new TableIndex({
      name: "account_organization_indexes",
      columnNames: ["organizationId"]
    }));
  
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('accounts',"account_organization_indexes")
  }
}
