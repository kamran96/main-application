import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { InvoiceItemRepository } from '../repositories/invoiceItem.repository';

@Injectable()
export class InvoiceService {
  async CreateInvoice(dto, data) {
    const invoice = await getCustomRepository(InvoiceRepository).save({
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
      await getCustomRepository(InvoiceItemRepository).save({
        itemId: item.itemId,
        invoiceId: invoice.id,
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

    return await this.FindById(invoice.id);
  }

  async FindById(invoiceId) {
    return await getCustomRepository(InvoiceRepository).find({
      where: { id: invoiceId },
      relations: ['invoiceItems'],
    });
  }
}
