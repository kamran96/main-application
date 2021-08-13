import { MigrationInterface, QueryRunner } from 'typeorm';

export class addBanks1604923158609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let banks = [
      { name: 'Al Baraka Bank (Pakistan) Limited.' },
      { name: 'Allied Bank Limited.' },
      { name: 'Askari Bank Limited.' },
      { name: 'Askari Islamic Bank.' },
      { name: 'Bank Alfalah Limited.' },
      { name: 'Bank Al-Habib Limited.' },
      { name: 'BankIslami Pakistan Limited.' },
      { name: 'Citi Bank' },
    ];

    for (let bank of banks) {
      await queryRunner.query(
        `insert into banks (name) values ('${bank.name}')`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
