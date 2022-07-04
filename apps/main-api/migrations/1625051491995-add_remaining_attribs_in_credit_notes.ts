import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addRemainingAttribsInCreditNotes1625051491995
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'credit_notes',
      new TableColumn({
        name: 'reference',
        type: 'varchar',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'credit_notes',
      new TableColumn({
        name: 'issueDate',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'credit_notes',
      new TableColumn({
        name: 'invoiceNumber',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'credit_notes',
      new TableColumn({
        name: 'discount',
        type: 'float',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'credit_notes',
      new TableColumn({
        name: 'netTotal',
        type: 'float',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'credit_notes',
      new TableColumn({
        name: 'grossTotal',
        type: 'float',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'credit_note_items',
      new TableColumn({
        name: 'total',
        type: 'float',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'credit_note_items',
      new TableColumn({
        name: 'discount',
        type: 'varchar',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'credit_note_items',
      new TableColumn({
        name: 'tax',
        type: 'text',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'credit_note_items',
      new TableColumn({
        name: 'accountId',
        type: 'int',
        isNullable: true,
      })
    );
    await queryRunner.createForeignKey(
      'credit_note_items',
      new TableForeignKey({
        columnNames: ['accountId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('credit_notes', 'reference');
    await queryRunner.dropColumn('credit_notes', 'issueDate');
    await queryRunner.dropColumn('credit_notes', 'discount');
    await queryRunner.dropColumn('credit_notes', 'invoiceNumber');
    await queryRunner.dropColumn('credit_notes', 'netTotal');
    await queryRunner.dropColumn('credit_notes', 'grossTotal');
    await queryRunner.dropColumn('credit_note_items', 'total');
    await queryRunner.dropColumn('credit_note_items', 'discount');
    await queryRunner.dropColumn('credit_note_items', 'tax');
    await queryRunner.dropColumn('credit_note_items', 'accountId');
  }
}
