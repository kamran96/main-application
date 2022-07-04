import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterOrganizationInContraintInRolePermissions1623841147943
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            alter table role_permissions drop constraint "FK_aa7351da5a4b025f23b92aaa393";
            alter table role_permissions
	        add constraint "FK_aa7351da5a4b025f23b92aaa393"
		    foreign key ("organizationId") references organizations
			    on delete cascade;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
