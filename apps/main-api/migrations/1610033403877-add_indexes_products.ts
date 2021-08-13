import {MigrationInterface, QueryRunner, TableIndex} from "typeorm";

export class addIndexesProducts1610033403877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // indexes for products
        await queryRunner.createIndex("items", new TableIndex({
            name: "items_indexes",
            columnNames: ["id", "keyId", "priceId", "accountId", "categoryId", "branchId", "organizationId"]
        }));
        // indexes for prices
        await queryRunner.createIndex("prices", new TableIndex({
            name: "prices_indexes",
            columnNames: ["id", "transactionId", "itemId",]
        }));
        // indexes for transactions
        await queryRunner.createIndex("categories", new TableIndex({
            name: "categories_indexes",
            columnNames: ["id", "parentId", "attachmentId", "branchId", "organizationId"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("items", "items_indexes");
        await queryRunner.dropIndex("prices", "prices_indexes");
        await queryRunner.dropIndex("categories", "categories_indexes");

    }

}
