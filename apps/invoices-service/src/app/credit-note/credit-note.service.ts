import { Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import { Sorting } from '@invyce/sorting';
import { CreditNoteRepository } from '../repositories/creditNote.repository';
import { CreditNoteItemRepository } from '../repositories/creditNoteItem.repository';
import {
  IBaseUser,
  IPage,
  ICreditNoteWithResponse,
  ICreditNote,
} from '@invyce/interfaces';
import { CreditNoteDto } from '../dto/credit-note.dto';

@Injectable()
export class CreditNoteService {
  async IndexCreditNote(
    user: IBaseUser,
    queryData: IPage
  ): Promise<ICreditNoteWithResponse> {
    const { page_no, page_size, status, sort, query } = queryData;

    let credit_note;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(CreditNoteRepository).count({
      status,
      organizationId: user.organizationId,
      branchId: user.branchId,
    });

    if (query) {
      const filterData = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (const i in data) {
        if (data[i].type === 'search') {
          const val = data[i].value?.split('%')[1];
          // const lower = val.toLowerCase();
          credit_note = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: 1,
              branchId: user.branchId,
              organizationId: user.organizationId,
              [i]: ILike(val),
            },
            skip: pn * ps - ps,
            take: ps,
            // relations: ['creditNoteItems', 'creditNoteItems.account'],
          });
        } else if (data[i].type === 'compare') {
          credit_note = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: 1,
              branchId: user.branchId,
              organizationId: user.organizationId,
              [i]: In(data[i].value),
            },
            skip: pn * ps - ps,
            take: ps,
            // relations: ['creditNoteItems', 'creditNoteItems.account'],
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          credit_note = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: 1,
              organizationId: user.organizationId,
              branchId: user.branchId,
              [i]: Between(start_date, end_date),
            },
            skip: pn * ps - ps,
            take: ps,
            // relations: ['creditNoteItems', 'creditNoteItems.account'],
          });
        }

        return {
          result: credit_note,
          pagination: {
            total,
            total_pages: Math.ceil(total / ps),
            page_size: ps || 20,
            page_no: ps,
            sort_column: sort_column,
            sort_order: sort_order,
          },
        };
      }
    } else {
      credit_note = await getCustomRepository(CreditNoteRepository).find({
        where: {
          status: status,
          organizationId: user.organizationId,
          branchId: user.branchId,
        },
        skip: pn * pn - pn,
        take: pn,
        order: {
          [sort_column]: sort_order,
        },
        relations: ['creditNoteItems'],
      });
    }

    return {
      result: credit_note,
      pagination: {
        total,
        total_pages: Math.ceil(total / ps),
        page_size: ps || 20,
        page_no: pn,
        sort_column: sort_column,
        sort_order: sort_order,
      },
    };
  }

  async CreateCreditNote(
    dto: CreditNoteDto,
    data: IBaseUser
  ): Promise<ICreditNote> {
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
      comment: dto.comment,
      organizationId: data.organizationId,
      branchId: data.branchId,
      createdById: data.id,
      updatedById: data.id,
      status: 1,
    });

    for (const item of dto.credit_note_items) {
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

  async FindById(creditNoteId: number): Promise<ICreditNote> {
    return await getCustomRepository(CreditNoteRepository).findOne({
      where: { id: creditNoteId },
      relations: ['creditNoteItems'],
    });
  }
}
