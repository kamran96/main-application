import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Contacts1599302440088 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Contacts',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'businessName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'accountNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cnic',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phoneNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cellNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'faxNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'skypeName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'webLink',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'creditLimit',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'creditLimitBlock',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'salesDiscount',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'paymentDaysLimit',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'branchId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'addressId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'createdBy',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'updatedBy',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
      true
    );
    await queryRunner.createForeignKey(
      'Contacts',
      new TableForeignKey({
        columnNames: ['branchId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Branches',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.createForeignKey(
      'Contacts',
      new TableForeignKey({
        columnNames: ['addressId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Addresses',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Contacts');
  }
}
