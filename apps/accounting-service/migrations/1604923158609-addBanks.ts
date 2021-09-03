import { MigrationInterface, QueryRunner } from 'typeorm';

export class addBanks1604923158609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let banks = [
      { name: 'Al Baraka Bank (Pakistan) Limited.' },
      { name: 'Allied Bank Limited' },
      { name: 'Askari Bank' },
      { name: 'Bank Alfalah Limited.' },
      { name: 'Bank Al-Habib Limited.' },
      { name: 'BankIslami Pakistan Limited.' },
      { name: 'Soneri Bank Pakistan Limited.' },
      { name: 'DeuTsche Bank A.G' },
      { name: 'Faysal Bank Limited' },
      { name: 'Habib Bank Limited' },
      { name: 'Standard Chartered Bank (Pakistan) Limited' },
      { name: 'Habib Metropolitan Bank Limited' },
      { name: 'Industrial Development Bank of Pakistan' },
      { name: 'JS Bank Limited' },
      { name: 'MCB Bank Limited' },
      { name: 'MCB Islamic Bank Limited' },
      { name: 'Meezan Bank Limited' },
      { name: 'National Bank of Pakistan' },
    ];

    for (let bank of banks) {
      await queryRunner.query(
        `insert into banks (name) values ('${bank.name}')`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
