import { Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import { Sorting } from '@invyce/sorting';
import { CreditNoteRepository } from '../repositories/creditNote.repository';
import { CreditNoteItemRepository } from '../repositories/creditNoteItem.repository';

@Injectable()
export class CreditNoteService {
  async IndexCreditNote(user, queryData) {
    const { page_no, page_size, invoice_type, status, sort, query } = queryData;
    let invoices;

    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(CreditNoteRepository).count({
      status,
      organizationId: user.organizationId,
      // branchId: user.branchId,
    });

    if (query) {
      const filterData: any = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (let i in data) {
        if (data[i].type === 'search') {
          const val = data[i].value?.split('%')[1];
          // const lower = val.toLowerCase();
          invoices = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: 1,
              organizationId: user.organizationId,
              [i]: ILike(val),
            },
            skip: page_no * page_size - page_size,
            take: page_size,
            // relations: ['creditNoteItems', 'creditNoteItems.account'],
          });
        } else if (data[i].type === 'compare') {
          invoices = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: 1,
              organizationId: user.organizationId,
              [i]: In(data[i].value),
            },
            skip: page_no * page_size - page_size,
            take: page_size,
            // relations: ['creditNoteItems', 'creditNoteItems.account'],
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          invoices = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: 1,
              organizationId: user.organizationId,
              [i]: Between(start_date, end_date),
            },
            skip: page_no * page_size - page_size,
            take: page_size,
            // relations: ['creditNoteItems', 'creditNoteItems.account'],
          });
        }

        return {
          invoices: invoices,
          pagination: {
            total,
            total_pages: Math.ceil(total / page_size),
            page_size: parseInt(page_size) || 20,
            // page_total: null,
            page_no: parseInt(page_no),
            sort_column: sort_column,
            sort_order: sort_order,
          },
        };
      }
    } else {
      invoices = await getCustomRepository(CreditNoteRepository).find({
        where: {
          status: status,
          organizationId: user.organizationId,
          // branchId: user.branchId
        },
        skip: page_no * page_size - page_size,
        take: page_size,
        order: {
          [sort_column]: sort_order,
        },
        relations: ['creditNoteItems'],
      });
    }

    return {
      invoices,
      pagination: {
        total,
        total_pages: Math.ceil(total / page_size),
        page_size: parseInt(page_size) || 20,
        // page_total: null,
        page_no: parseInt(page_no),
        sort_column: sort_column,
        sort_order: sort_order,
      },
    };
  }

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
        creditNoteId: credit_note.id,
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
