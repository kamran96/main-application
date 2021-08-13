import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTablesName1600073436152 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "Items" RENAME TO "items"');
        await queryRunner.query('ALTER TABLE "Prices" RENAME TO "prices"');
        await queryRunner.query('ALTER TABLE "Accounts" RENAME TO "accounts"');
        await queryRunner.query('ALTER TABLE "Addresses" RENAME TO "addresses"');
        await queryRunner.query('ALTER TABLE "Branches" RENAME TO "branches"');
        await queryRunner.query('ALTER TABLE "Categories" RENAME TO "categories"');
        await queryRunner.query('ALTER TABLE "Brands" RENAME TO "brands"');
        await queryRunner.query('ALTER TABLE "Contacts" RENAME TO "contacts"');
        await queryRunner.query('ALTER TABLE "Invoices" RENAME TO "invoices"');
        await queryRunner.query('ALTER TABLE "InvoiceItems" RENAME TO "invoice_items"');
        await queryRunner.query('ALTER TABLE "KeyStorages" RENAME TO "key_storages"');
        await queryRunner.query('ALTER TABLE "Organizations" RENAME TO "organizations"');
        await queryRunner.query('ALTER TABLE "PrimaryAccounts" RENAME TO "primary_accounts"');
        await queryRunner.query('ALTER TABLE "SecondaryAccounts" RENAME TO "secondary_accounts"');
        await queryRunner.query('ALTER TABLE "RolePermissions" RENAME TO "role_permissions"');
        await queryRunner.query('ALTER TABLE "UserProfiles" RENAME TO "user_profiles"');
        await queryRunner.query('ALTER TABLE "UserRoles" RENAME TO "user_roles"');
        await queryRunner.query('ALTER TABLE "Users" RENAME TO "users"');
        await queryRunner.query('ALTER TABLE "UserTokens" RENAME TO "user_tokens"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "items" RENAME TO "Items"');
        await queryRunner.query('ALTER TABLE "prices" RENAME TO "Prices"');
        await queryRunner.query('ALTER TABLE "accounts" RENAME TO "Accounts"');
        await queryRunner.query('ALTER TABLE "addresses" RENAME TO "Addresses"');
        await queryRunner.query('ALTER TABLE "branches" RENAME TO "Branches"');
        await queryRunner.query('ALTER TABLE "categories" RENAME TO "Categories"');
        await queryRunner.query('ALTER TABLE "brands" RENAME TO "Brands"');
        await queryRunner.query('ALTER TABLE "contacts" RENAME TO "Contacts"');
        await queryRunner.query('ALTER TABLE "invoices" RENAME TO "Invoices"');
        await queryRunner.query('ALTER TABLE "invoice_items" RENAME TO "InvoiceItems"');
        await queryRunner.query('ALTER TABLE "key_storages" RENAME TO "KeyStorages"');
        await queryRunner.query('ALTER TABLE "organizations" RENAME TO "Organizations"');
        await queryRunner.query('ALTER TABLE "primary_accounts" RENAME TO "PrimaryAccounts"');
        await queryRunner.query('ALTER TABLE "secondary_accounts" RENAME TO "SecondaryAccounts"');
        await queryRunner.query('ALTER TABLE "role_permissions" RENAME TO "RolePermissions"');
        await queryRunner.query('ALTER TABLE "user_profiles" RENAME TO "UserProfiles"');
        await queryRunner.query('ALTER TABLE "user_roles" RENAME TO "UserRoles"');
        await queryRunner.query('ALTER TABLE "users" RENAME TO "Users"');
        await queryRunner.query('ALTER TABLE "user_token" RENAME TO "UserToken"');
    }

}
