import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { CreditNoteRepository } from '../repositories/creditNote.repository';
import { CreditNoteItemRepository } from '../repositories/creditNoteItem.repository';

@Injectable()
export class CreditNoteService {
  async CreateCreditNote(dto, data) {
    const credit_note = await getCustomRepository(CreditNoteRepository).save({
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
      await getCustomRepository(CreditNoteItemRepository).save({
        itemId: item.itemId,
        invoiceId: credit_note.id,
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

    return await this.FindById(credit_note.id);
  }

  async FindById(creditNoteId) {
    return await getCustomRepository(CreditNoteRepository).find({
      where: { id: creditNoteId },
      relations: ['creditNoteItems'],
    });
  }
}
