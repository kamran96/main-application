import {MigrationInterface, QueryRunner, TableIndex} from "typeorm";

export class addIndexesForPurchase1610031062759 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // purchase indexes
        await queryRunner.createIndex("purchases", new TableIndex({
            name: "purchase_indexes",
            columnNames: ["contactId", "branchId", "organizationId"]
        }));

         // purchase items indexes
        await queryRunner.createIndex("purchase_items", new TableIndex({
            name: "purchase_item_indexes",
            columnNames: ["purchaseId", "itemId", "organizationId","branchId"]
        }));
        //  payments indexes
        await queryRunner.createIndex("payments", new TableIndex({
            name: "payments_indexes",
            columnNames: ["contactId", "invoiceId","purchaseId", "transactionId", "bankId","branchId", "organizationId"]
        }));
        // contacts indexes
        await queryRunner.createIndex("contacts", new TableIndex({
            name: "contacts_indexes",
            columnNames: ["id", "transactionId","addressId","branchId", "organizationId"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("purchases", "purchase_indexes");
        await queryRunner.dropIndex("purchase_items", "purchase_item_indexes");
        await queryRunner.dropIndex("payments", "payments_indexes");
        await queryRunner.dropIndex("contacts", "contacts_indexes");
    }

}
