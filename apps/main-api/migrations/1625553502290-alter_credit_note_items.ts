import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterCreditNoteItems1625553502290 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`alter table credit_note_items rename column amount to "unitPrice";
        alter table credit_note_items rename column discount to "itemDiscount";
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
