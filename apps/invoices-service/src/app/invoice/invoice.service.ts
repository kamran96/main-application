import { Injectable } from '@nestjs/common';
import { getCustomRepository, ILike } from 'typeorm';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { InvoiceItemRepository } from '../repositories/invoiceItem.repository';

@Injectable()
export class InvoiceService {
  async CreateInvoice(dto, data) {
    if (dto && dto.isNewRecord === false) {
      // we need to update invoice
      const invoice = await getCustomRepository(InvoiceRepository).find({
        where: {
          id: dto.id,
          organizationId: data.organizationId,
        },
      });
    } else {
      // we need to create invoice
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
  }

  async FindById(invoiceId) {
    return await getCustomRepository(InvoiceRepository).find({
      where: { id: invoiceId },
      relations: ['invoiceItems'],
    });
  }

  async GetInvoiceNumber(type, user) {
    let invoiceNo = '';
    if (type === 'SI') {
      const [invoice] = await getCustomRepository(InvoiceRepository).find({
        where: {
          organizationId: user.organizationId,
          status: 1,
          invoiceNumber: ILike(`%INV-${new Date().getFullYear()}%`),
        },
        order: {
          id: 'DESC',
        },
        take: 1,
      });

      if (invoice) {
        const year = new Date().getFullYear();
        const n = invoice.invoiceNumber.split('-');
        let m = parseInt(n[2]);
        let o = (m += 1);
        invoiceNo = `INV-${year}-${o}`;
      } else {
        invoiceNo = `INV-${new Date().getFullYear()}-1`;
      }
    }

    return invoiceNo;
  }
}
