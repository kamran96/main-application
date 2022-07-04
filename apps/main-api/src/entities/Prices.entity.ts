import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Prices {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  priceType: number; // this show wether the price tyoe is revers or straight
  @Column()
  purchasePrice: number;
  @Column()
  salePrice: number; // consumer price
  @Column()
  itemId: number; // consumer price
  @Column()
  tax: string; // consumer price
  @Column()
  discount: string; // consumer price
  @Column()
  tradePrice: number; // whole sale/retail price
  @Column()
  tradeDiscount: number; // distributor price
  @Column()
  handlingCost: number; // handling_percentage (cost of owning, storing, and keeping the items in stock)
  @Column()
  priceUnit: number; // must be define single unit price
  @Column()
  unitsInCarton: number;
}
