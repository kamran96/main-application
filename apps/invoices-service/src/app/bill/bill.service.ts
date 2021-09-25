import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { BillRepository } from '../repositories/bill.repository';
import { BillItemRepository } from '../repositories/billItem.repository';

@Injectable()
export class BillService {
  async CreateBill(dto, data) {
    const bill = await getCustomRepository(BillRepository).save({
      contactId: dto.contactId,
      reference: dto.reference,
      issueDate: dto.issueDate,
      dueDate: dto.dueDate,
      invoiceNumber: dto.invoiceNumber,
      discount: dto.discount,
      grossTotal: dto.grossTotal,
      netTotal: dto.netTotal,
      date: dto.date,
      type: dto.type,
      directTax: dto.directTax,
      indirectTax: dto.indirectTax,
      isTaxIncluded: dto.isTaxIncluded,
      isReturn: dto.isReturn,
      comment: dto.comment,
      organizationId: data.organizationId,
      branchId: data.branchId,
      createdById: data.id,
      updatedById: data.id,
      status: 1,
    });

    for (let item of dto.invoice_items) {
      await getCustomRepository(BillItemRepository).save({
        itemId: item.itemId,
        invoiceId: bill.id,
        description: item.description,
        quantity: item.quantity,
        itemDiscount: item.itemDiscount,
        unitPrice: item.unitPrice,
        costOfGoodAmount: item.costOfGoodAmount,
        sequence: item.sequence,
        tax: item.tax,
        total: item.total,
        status: 1,
      });
    }

    return await this.FindById(bill.id);
  }

  async FindById(invoiceId) {
    return await getCustomRepository(BillRepository).find({
      where: { id: invoiceId },
      relations: ['invoiceItems'],
    });
  }
}
