import { Inject, Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In, Raw } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import * as moment from 'moment';
import { IPage, IRequest } from '@invyce/interfaces';
import { PurchaseOrderDto } from '../dto/purchase-order.dto';
import { PurchaseOrderRepository } from '../repositories/purchaseOrder.repository';
import { PurchaseOrderItemRepository } from '../repositories/purchaseOrderItem.repository';
import { Sorting } from '@invyce/sorting';
import { Host, PdfType, ToTitleCase } from '@invyce/global-constants';
import { PO_CREATED } from '@invyce/send-email';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy
  ) {}

  async IndexPO(req: IRequest, queryData: IPage) {
    const { page_no, page_size, status, type, sort, query } = queryData;

    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    let purchaseOrder;
    let total;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    const { sort_column, sort_order } = await Sorting(sort);

    total = await getCustomRepository(PurchaseOrderRepository).count({
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
          purchaseOrder = await getCustomRepository(
            PurchaseOrderRepository
          ).find({
            where: {
              status: 1,
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
              [i]: Raw((alias) => `LOWER(${alias}) ILike '%${val}%'`),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });

          total = await getCustomRepository(PurchaseOrderRepository).count({
            status,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
            [i]: Raw((alias) => `LOWER(${alias}) ILike '%${val}%'`),
          });
        } else if (data[i].type === 'compare') {
          purchaseOrder = await getCustomRepository(
            PurchaseOrderRepository
          ).find({
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

          total = await getCustomRepository(PurchaseOrderRepository).count({
            status,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
            [i]: In(data[i].value),
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          const add_one_day = moment(end_date, 'YYYY-MM-DD')
            .add(1, 'day')
            .format();

          purchaseOrder = await getCustomRepository(
            PurchaseOrderRepository
          ).find({
            where: {
              status: 1,
              organizationId: req.user.organizationId,
              branchId: req.user.branchId,
              [i]: Between(start_date, add_one_day),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['purchaseItems', 'purchaseItems.account'],
          });

          total = await getCustomRepository(PurchaseOrderRepository).count({
            status,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
            [i]: Between(start_date, add_one_day),
          });
        }

        return {
          result: purchaseOrder,
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
        purchaseOrder = await getCustomRepository(PurchaseOrderRepository).find(
          {
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
            relations: ['purchaseOrderItems'],
          }
        );
      }
    }

    const newPoArray = [];
    const mapContactIds = purchaseOrder.map((inv) => inv.contactId);
    const { data: contacts } = await axios.post(
      Host('contacts', `contacts/contact/ids`),
      {
        ids: mapContactIds,
        type: 1,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    // get distinct userids
    const key = 'createdById';
    const mapUniqueUserId = [
      ...new Map(purchaseOrder.map((item) => [item[key], item])).values(),
    ].map((i) => i[key]);

    const { data: users } = await axios.post(
      Host('users', `users/user/ids`),
      {
        ids: mapUniqueUserId,
        type: 1,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    for (const i of purchaseOrder) {
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

  async CreatePurchaseOrder(poDto: PurchaseOrderDto, req: IRequest) {
    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const mapItemIds = poDto.invoice_items.map((ids) => ids.itemId);

    const { data: items } = await axios.post(
      Host('items', 'items/item/ids'),
      {
        ids: mapItemIds,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    if (poDto?.isNewRecord === false) {
      // update
      const purchaseOrder = await getCustomRepository(
        PurchaseOrderRepository
      ).findOne({
        where: {
          id: poDto.id,
          organizationId: req.user.organizationId,
        },
      });

      await getCustomRepository(PurchaseOrderRepository).update(
        { id: poDto.id },
        {
          contactId: poDto.contactId || purchaseOrder.contactId,
          reference: poDto.reference || purchaseOrder.reference,
          issueDate: poDto.issueDate || purchaseOrder.issueDate,
          dueDate: poDto.dueDate || purchaseOrder.dueDate,
          invoiceNumber: poDto.invoiceNumber || purchaseOrder.invoiceNumber,
          adjustment: poDto.adjustment || purchaseOrder.adjustment,
          grossTotal: poDto.grossTotal || purchaseOrder.grossTotal,
          netTotal: poDto.netTotal || purchaseOrder.netTotal,
          date: poDto.date || purchaseOrder.date,
          invoiceType: poDto.invoiceType || purchaseOrder.invoiceType,
          directTax: poDto.directTax || purchaseOrder.directTax,
          indirectTax: poDto.indirectTax || purchaseOrder.indirectTax,
          isTaxIncluded: poDto.isTaxIncluded || purchaseOrder.isTaxIncluded,
          comment: poDto.comment || purchaseOrder.comment,
          organizationId: purchaseOrder.organizationId,
          branchId: purchaseOrder.branchId,
          createdById: purchaseOrder.createdById,
          updatedById: req.user.id,
          status: poDto.status || purchaseOrder.status,
        }
      );

      await getCustomRepository(PurchaseOrderItemRepository).delete({
        purchaseOrderId: poDto.id,
      });

      for (const item of poDto.invoice_items) {
        await getCustomRepository(PurchaseOrderItemRepository).save({
          itemId: item.itemId,
          purchaseOrderId: poDto.id,
          accountId: item.accountId,
          description: item.description,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice,
          costOfGoodAmount: item.costOfGoodAmount,
          sequence: item.sequence,
          tax: item.tax,
          total: item.total,
          // status: poDto.status,
        });
      }

      return this.FindById(poDto.id, req);
    } else {
      // create

      const po = await getCustomRepository(PurchaseOrderRepository).save({
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

      const invoiceItems = [];
      for (const item of poDto.invoice_items) {
        const poItem = await getCustomRepository(
          PurchaseOrderItemRepository
        ).save({
          itemId: item.itemId,
          purchaseOrderId: po.id,
          accountId: item.accountId,
          description: item.description,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice,
          costOfGoodAmount: item.costOfGoodAmount,
          sequence: item.sequence,
          tax: item.tax,
          total: item.total,
          // status: poDto.status,
        });
        invoiceItems.push(poItem);
      }

      const { data: contact } = await axios.post(
        Host('contacts', `contacts/contact/ids`),
        {
          ids: [poDto.contactId],
          type: 1,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const { data: attachment } = await axios.post(
        Host('attachments', `attachments/attachment/generate-pdf`),
        {
          data: {
            ...poDto,
            invoice: { ...po, invoice_items: invoiceItems },
            contact: contact[0],
            items,
            type: PdfType.PO,
          },
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const email = contact[0].email
        ? contact[0].email
        : poDto.email
        ? poDto.email
        : null;

      const invoice_details = [];
      let i = 0;
      for (const item of poDto.invoice_items) {
        i++;
        if (i < 6) {
          invoice_details.push({
            itemName: await items.find((i) => i.id === item.itemId).name,
            quantity: item.quantity,
            description: item.description,
          });
        }
      }

      await this.emailService.emit(PO_CREATED, {
        to: email,
        user_name: ToTitleCase(contact[0]?.name) || null,
        contact: ToTitleCase(req.user.profile.fullName),
        created_time: moment(po.createdAt).format('MMM Do YY'),
        purchaseOrder: po.invoiceNumber,
        comment: po.comment,
        issueDate: moment(po.issueDate).format('MMMM Do YYYY, h:mm:ss a'),
        dueDate: po.dueDate,
        reference: po.reference,
        gross_total: po.grossTotal,
        net_total: po.netTotal,
        invoice_details,
        download_link: attachment?.path || null,
        attachment_name: attachment?.name || null,
      });
      return po;
    }
  }

  async FindById(purchaseOrderrId: number, req) {
    const purchaseOrder = await getCustomRepository(
      PurchaseOrderRepository
    ).findOne({
      where: {
        id: purchaseOrderrId,
      },
      relations: ['purchaseOrderItems'],
    });

    const contactId = purchaseOrder?.contactId;

    if (!req || !req.cookies) return null;
    const token = req.cookies['access_token'];

    const contactRequest = {
      url: Host('contacts', `contacts/contact/${contactId}`),
      method: 'GET',
      headers: {
        cookie: `access_token=${token}`,
      },
    };

    const itemIdsArray = purchaseOrder?.purchaseOrderItems.map(
      (ids) => ids.itemId
    );

    const { data: items } = await axios.post(
      Host('items', `items/item/ids`),
      {
        ids: itemIdsArray,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    const { data: contact } = await axios(contactRequest as unknown);

    let newPo;
    const purchaseItemArr = [];
    for (const i of purchaseOrder.purchaseOrderItems) {
      const item = items.find((j) => i.itemId === j.id);

      purchaseItemArr.push({
        ...i,
        item,
      });
    }

    if (purchaseItemArr.length > 0) {
      newPo = {
        ...purchaseOrder,
        contact: contact.result,
        purchaseOrderItems: purchaseItemArr,
      };
    }

    return {
      result: newPo,
    };
  }

  async DeletePurchaseOrder(purchaseOrders, req: IRequest) {
    for (const i of purchaseOrders.ids) {
      const purchaseOrder = await getCustomRepository(
        PurchaseOrderRepository
      ).findOne({
        where: {
          id: i,
          organizationId: req.user.organizationId,
        },
      });

      if (purchaseOrder) {
        await getCustomRepository(PurchaseOrderRepository).update(
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
