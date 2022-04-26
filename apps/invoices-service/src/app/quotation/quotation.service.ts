import { Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In } from 'typeorm';
import axios from 'axios';
import { IPage, IRequest } from '@invyce/interfaces';
import { QuotationRepository } from '../repositories/quotation.repository';
import { QuotationItemRepository } from '../repositories/quotationItem.repository';
import { Sorting } from '@invyce/sorting';
import { QuotationDto } from '../dto/quotation.dto';

@Injectable()
export class QuotationService {
  async IndexQO(req: IRequest, queryData: IPage) {
    const { page_no, page_size, status, type, sort, query } = queryData;

    let token;
    if (process.env.NODE_ENV === 'development') {
      const header = req.headers?.authorization?.split(' ')[1];
      token = header;
    } else {
      if (!req || !req.cookies) return null;
      token = req.cookies['access_token'];
    }

    const tokenType =
      process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
    const value =
      process.env.NODE_ENV === 'development'
        ? `Bearer ${token}`
        : `access_token=${token}`;

    const http = axios.create({
      baseURL: 'http://localhost',
      headers: {
        [tokenType]: value,
      },
    });

    let quotation;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(QuotationRepository).count({
      status,
      organizationId: req.user.organizationId,
      branchId: req.user.branchId,
    });

    if (query) {
      const filterData = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (const i in data) {
        if (data[i].type === 'search') {
          const val = data[i].value?.split('%')[1];
          // const lower = val.toLowerCase();
          quotation = await getCustomRepository(QuotationRepository).find({
            where: {
              status: 1,
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
              [i]: ILike(val),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });
        } else if (data[i].type === 'compare') {
          quotation = await getCustomRepository(QuotationRepository).find({
            where: {
              status: 1,
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
              [i]: In(data[i].value),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          quotation = await getCustomRepository(QuotationRepository).find({
            where: {
              status: 1,
              organizationId: req.user.organizationId,
              branchId: req.user.branchId,
              [i]: Between(start_date, end_date),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });
        }

        return {
          result: quotation,
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
    } else {
      if (type === 'ALL') {
        quotation = await getCustomRepository(QuotationRepository).find({
          where: {
            status: status,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
          },
          skip: pn * ps - ps,
          take: ps,
          order: {
            [sort_column]: sort_order,
          },
          relations: ['quotationItems'],
        });
      }
    }

    const newPoArray = [];
    const mapContactIds = quotation.map((inv) => inv.contactId);
    const { data: contacts } = await http.post(`contacts/contact/ids`, {
      ids: mapContactIds,
      type: 1,
    });

    // get distinct userids
    const key = 'createdById';
    const mapUniqueUserId = [
      ...new Map(quotation.map((item) => [item[key], item])).values(),
    ].map((i) => i[key]);

    const { data: users } = await http.post(`users/user/ids`, {
      ids: mapUniqueUserId,
      type: 1,
    });

    for (const i of quotation) {
      const contact = contacts.find((c) => c.id === i.contactId);
      const user = users.find((u) => u.id === i.createdById);
      newPoArray.push({
        ...i,
        contact,
        owner: user,
      });
    }

    return {
      result: newPoArray,
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

  async CreateQuotation(poDto: QuotationDto, req: IRequest) {
    if (poDto?.isNewRecord === false) {
      // update
      const quotation = await getCustomRepository(QuotationRepository).findOne({
        where: {
          id: poDto.id,
          organizationId: req.user.organizationId,
        },
      });

      await getCustomRepository(QuotationRepository).update(
        { id: poDto.id },
        {
          contactId: poDto.contactId || quotation.contactId,
          reference: poDto.reference || quotation.reference,
          issueDate: poDto.issueDate || quotation.issueDate,
          dueDate: poDto.dueDate || quotation.dueDate,
          invoiceNumber: poDto.invoiceNumber || quotation.invoiceNumber,
          adjustment: poDto.adjustment || quotation.adjustment,
          grossTotal: poDto.grossTotal || quotation.grossTotal,
          netTotal: poDto.netTotal || quotation.netTotal,
          date: poDto.date || quotation.date,
          invoiceType: poDto.invoiceType || quotation.invoiceType,
          directTax: poDto.directTax || quotation.directTax,
          indirectTax: poDto.indirectTax || quotation.indirectTax,
          isTaxIncluded: poDto.isTaxIncluded || quotation.isTaxIncluded,
          comment: poDto.comment || quotation.comment,
          organizationId: quotation.organizationId,
          branchId: quotation.branchId,
          createdById: quotation.createdById,
          updatedById: req.user.id,
          status: poDto.status || quotation.status,
        }
      );

      await getCustomRepository(QuotationItemRepository).delete({
        quotationId: poDto.id,
      });

      for (const item of poDto.invoice_items) {
        await getCustomRepository(QuotationItemRepository).save({
          itemId: item.itemId,
          quotationId: poDto.id,
          accountId: item.accountId,
          description: item.description,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice,
          costOfGoodAmount: item.costOfGoodAmount,
          sequence: item.sequence,
          tax: item.tax,
          total: item.total,
          status: poDto.status,
        });
      }

      return this.FindById(poDto.id, req);
    } else {
      // create

      const po = await getCustomRepository(QuotationRepository).save({
        contactId: poDto.contactId,
        reference: poDto.reference,
        issueDate: poDto.issueDate,
        dueDate: poDto.dueDate,
        invoiceNumber: poDto.invoiceNumber,
        adjustment: poDto.adjustment,
        grossTotal: poDto.grossTotal,
        netTotal: poDto.netTotal,
        date: poDto.date,
        invoiceType: poDto.invoiceType,
        directTax: poDto.directTax,
        indirectTax: poDto.indirectTax,
        isTaxIncluded: poDto.isTaxIncluded,
        isReturn: poDto.isReturn,
        comment: poDto.comment,
        organizationId: req.user.organizationId,
        branchId: req.user.branchId,
        createdById: req.user.id,
        updatedById: req.user.id,
        status: poDto.status,
      });

      for (const item of poDto.invoice_items) {
        await getCustomRepository(QuotationItemRepository).save({
          itemId: item.itemId,
          quotationId: po.id,
          accountId: item.accountId,
          description: item.description,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice,
          costOfGoodAmount: item.costOfGoodAmount,
          sequence: item.sequence,
          tax: item.tax,
          total: item.total,
          status: poDto.status,
        });
      }
      return this.FindById(po.id, req);
    }
  }

  async FindById(quotationrId: number, req) {
    const quotation = await getCustomRepository(QuotationRepository).findOne({
      where: {
        id: quotationrId,
      },
      relations: ['quotationItems'],
    });

    const contactId = quotation?.contactId;

    let token;
    if (process.env.NODE_ENV === 'development') {
      const header = req.headers?.authorization?.split(' ')[1];
      token = header;
    } else {
      if (!req || !req.cookies) return null;
      token = req.cookies['access_token'];
    }

    const type =
      process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
    const value =
      process.env.NODE_ENV === 'development'
        ? `Bearer ${token}`
        : `access_token=${token}`;

    const contactRequest = {
      url: `http://localhost/contacts/contact/${contactId}`,
      method: 'GET',
      headers: {
        [type]: value,
      },
    };

    const http = axios.create({
      baseURL: 'http://localhost',
      headers: {
        [type]: value,
      },
    });

    const itemIdsArray = quotation?.quotationItems.map((ids) => ids.itemId);

    const { data: items } = await http.post(`items/item/ids`, {
      ids: itemIdsArray,
    });

    const { data: contact } = await axios(contactRequest as unknown);

    let newPo;
    const purchaseItemArr = [];
    for (const i of quotation.quotationItems) {
      const item = items.find((j) => i.itemId === j.id);

      purchaseItemArr.push({
        ...i,
        item,
      });
    }

    if (purchaseItemArr.length > 0) {
      newPo = {
        ...quotation,
        contact: contact.result,
        quotationItems: purchaseItemArr,
      };
    }

    return {
      result: newPo,
    };
  }

  async DeleteQuotation(quotations, req: IRequest) {
    for (const i of quotations.ids) {
      const quotation = await getCustomRepository(QuotationRepository).findOne({
        where: {
          id: i,
          organizationId: req.user.organizationId,
        },
      });

      if (quotation) {
        await getCustomRepository(QuotationRepository).update(
          { id: i },
          {
            status: 0,
            updatedById: req.user.id,
          }
        );
      }
    }
    return true;
  }
}
