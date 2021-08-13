import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addAttachmentIdToProfile1602763024902
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_profiles',
      new TableColumn({
        name: 'attachmentId',
        isNullable: true,
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'user_profiles',
      new TableForeignKey({
        columnNames: ['attachmentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'attachments',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
