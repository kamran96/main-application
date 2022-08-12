import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Between, getCustomRepository, ILike, In, Raw } from 'typeorm';
import axios from 'axios';
import * as moment from 'moment';
import { Sorting } from '@invyce/sorting';
import { CreditNoteRepository } from '../repositories/creditNote.repository';
import { CreditNoteItemRepository } from '../repositories/creditNoteItem.repository';
import {
  IPage,
  ICreditNoteWithResponse,
  ICreditNote,
  ICreditNoteItem,
  IItem,
  IAccount,
  IRequest,
} from '@invyce/interfaces';
import {
  CreditNoteType,
  EntryType,
  Host,
  PaymentModes,
  Statuses,
} from '@invyce/global-constants';

import { CreditNoteDto } from '../dto/credit-note.dto';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { ClientProxy } from '@nestjs/microservices';
import { SEND_FORGOT_PASSWORD } from '@invyce/send-email';

@Injectable()
export class CreditNoteService {
  constructor(
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy
  ) {}

  async IndexCreditNote(
    req: IRequest,
    queryData: IPage
  ): Promise<ICreditNoteWithResponse> {
    const { page_no, page_size, invoice_type, status, sort, query } = queryData;

    if (!req || !req.cookies) return null;
    const token = req.cookies['access_token'];

    let credit_note;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);
    const { sort_column, sort_order } = await Sorting(sort);

    const total = await getCustomRepository(CreditNoteRepository).count({
      status,
      organizationId: req.user.organizationId,
      branchId: req.user.branchId,
      invoiceType: invoice_type,
    });

    if (query) {
      const filterData = Buffer.from(query, 'base64').toString();
      const data = JSON.parse(filterData);

      for (const i in data) {
        if (data[i].type === 'search') {
          const val = data[i].value?.split('%')[1].toLowerCase();

          credit_note = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: status,
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
              invoiceType: invoice_type,
              [i]: Raw((alias) => `LOWER(${alias}) ILike '%${val}%'`),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['creditNoteItems'],
          });
        } else if (data[i].type === 'compare') {
          credit_note = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: status,
              branchId: req.user.branchId,
              organizationId: req.user.organizationId,
              invoiceType: invoice_type,
              [i]: In(data[i].value),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['creditNoteItems'],
          });
        } else if (data[i].type === 'date-between') {
          const start_date = data[i].value[0];
          const end_date = data[i].value[1];
          credit_note = await getCustomRepository(CreditNoteRepository).find({
            where: {
              status: status,
              organizationId: req.user.organizationId,
              branchId: req.user.branchId,
              invoiceType: invoice_type,
              [i]: Between(start_date, end_date),
            },
            skip: pn * ps - ps,
            take: ps,
            relations: ['creditNoteItems'],
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
          organizationId: req.user.organizationId,
          branchId: req.user.branchId,
          invoiceType: invoice_type,
        },
        skip: pn * ps - ps,
        take: ps,
        order: {
          [sort_column]: sort_order,
        },
        relations: ['creditNoteItems'],
      });
    }

    const new_credit_note = [];
    const mapContactIds = credit_note.map((inv) => inv.contactId);

    const newContactIds = mapContactIds
      .sort()
      .filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
      });

    const { data: contacts } = await axios.post(
      Host('contacts', `contacts/contact/ids`),
      {
        ids: newContactIds,
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
      ...new Map(credit_note.map((item) => [item[key], item])).values(),
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

    for (const i of credit_note) {
      const contact = contacts.find((c) => c.id === i.contactId);
      const user = users.find((u) => u.id === i.createdById);
      new_credit_note.push({
        ...i,
        contact,
        owner: user,
      });
    }

    return {
      result: new_credit_note,
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

  async CreateCreditNote(dto: CreditNoteDto, req: IRequest): Promise<unknown> {
    if (!req || !req.cookies) return null;
    const token = req.cookies['access_token'];

    const accountCodesArray = ['15004', '40001'];
    const { data: accounts } = await axios.post<IAccount[]>(
      Host('accounts', `accounts/account/codes`),
      {
        codes: accountCodesArray,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    const mapItemIds = dto.invoice_items.map((ids) => ids.itemId);

    const { data: items } = await axios.post<IItem[]>(
      Host('items', `items/item/ids`),
      {
        ids: mapItemIds,
      },
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    const creditsArray = [];
    const debitsArray = [];
    const credit_note_item_array = [];
    const itemLedgerArray = [];

    // Will check if the params have id and isNewRecord true
    if (dto?.isNewRecord === false) {
      // Update the credit note
      const creditNote: ICreditNote = await getCustomRepository(
        CreditNoteRepository
      ).findOne({
        where: {
          id: dto.id,
          organizationId: req.user.organizationId,
          branchId: req.user.branchId,
        },
      });

      if (creditNote) {
        await getCustomRepository(CreditNoteRepository).update(
          { id: dto.id },
          {
            contactId: dto.contactId || creditNote.contactId,
            reference: dto.reference || creditNote.reference,
            issueDate: dto.issueDate || creditNote.issueDate,
            dueDate: dto.dueDate || creditNote.dueDate,
            invoiceId: dto.invoiceId || creditNote.invoiceId,
            billId: dto.billId || creditNote.billId,
            invoiceType: dto.invoiceType || creditNote.invoiceType,
            invoiceNumber: dto.invoiceNumber || creditNote.invoiceNumber,
            discount: dto.discount || creditNote.discount,
            grossTotal: dto.grossTotal || creditNote.grossTotal,
            netTotal: dto.netTotal || creditNote.netTotal,
            status: dto.status || creditNote.status,
            organizationId: creditNote.organizationId,
            branchId: creditNote.branchId,
            updatedById: req.user.id || creditNote.updatedById,
          }
        );

        await getCustomRepository(CreditNoteItemRepository).delete({
          creditNoteId: dto.id,
        });

        for (const item of dto.invoice_items) {
          const credit_note_item: ICreditNoteItem = await getCustomRepository(
            CreditNoteItemRepository
          ).save({
            itemId: item.itemId,
            creditNoteId: dto.id,
            description: item.description,
            quantity: item.quantity,
            itemDiscount: item.itemDiscount,
            unitPrice: item.unitPrice,
            costOfGoodAmount: item.costOfGoodAmount,
            purchasePrice: item.purchasePrice,
            sequence: item.sequence,
            tax: item.tax,
            total: item.total,
            accountId: item.accountId,
            status: dto.status,
          });

          credit_note_item_array.push(credit_note_item);

          const itemDetail: IItem = items.find((i) => i.id === item.itemId);
          if (itemDetail?.hasInventory === true) {
            itemLedgerArray.push({
              itemId: item.itemId,
              value: item.quantity,
              targetId: creditNote.id,
              type:
                creditNote.invoiceType === CreditNoteType.ACCRECCREDIT
                  ? 'increase'
                  : 'decrease',
              action: 'create',
            });
          }
          if (creditNote.invoiceType === CreditNoteType.ACCRECCREDIT) {
            const debit = {
              amount: Number(item.quantity) * Number(item.unitPrice),
              account_id: item.accountId,
            };

            debitsArray.push(debit);
          } else if (creditNote.invoiceType === CreditNoteType.ACCPAYCREDIT) {
            const credit = {
              amount: Number(item.quantity) * Number(item.purchasePrice),
              account_id: item.accountId,
            };

            creditsArray.push(credit);
          }
        }
        if (dto.invoiceId) {
          const invoice = await getCustomRepository(InvoiceRepository).findOne({
            where: {
              id: dto.invoiceId,
            },
          });

          let i = 0;
          const invoice_details = [];
          for (const cn of credit_note_item_array) {
            i++;
            if (i <= 5) {
              invoice_details.push({
                itemName: items.find((j) => cn.itemId === j.id).name,
                quantity: cn.quantity,
                price: cn.unitPrice,
                itemDiscount: cn.itemDiscount,
                tax: cn.tax,
                total: cn.total,
              });
            }
          }

          const payload = {
            to: req.user.email,
            from: 'no-reply@invyce.com',
            TemplateAlias: 'credit-note-applied',
            TemplateModel: {
              user_name: req.user.profile.fullName,
              invoice_name: invoice.invoiceNumber,
              issueDate: moment(dto.issueDate).format('llll'),
              invoice_details,
              gross_total: dto.grossTotal,
              itemDisTotal: dto.discount,
              net_total: dto.netTotal,
            },
          };

          await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);
        }

        const updatedCreditNote: ICreditNote = await getCustomRepository(
          CreditNoteRepository
        ).findOne({
          id: dto.id,
        });

        if (updatedCreditNote.status === Statuses.AUTHORISED) {
          await axios.post(
            Host('items', `items/item/manage-inventory`),
            {
              payload: itemLedgerArray,
            },
            {
              headers: {
                cookie: `access_token=${token}`,
              },
            }
          );

          if (updatedCreditNote.invoiceType === CreditNoteType.ACCRECCREDIT) {
            const credit = {
              account_id: await accounts.find((i) => i.code === '15004').id,
              amount: updatedCreditNote.netTotal,
            };

            creditsArray.push(credit);
          } else if (
            updatedCreditNote.invoiceType === CreditNoteType.ACCPAYCREDIT
          ) {
            const debit = {
              account_id: await accounts.find((i) => i.code === '40001').id,
              amount: updatedCreditNote.netTotal,
            };

            debitsArray.push(debit);
          }

          const payload = {
            dr: debitsArray,
            cr: creditsArray,
            type:
              updatedCreditNote.invoiceType === CreditNoteType.ACCRECCREDIT
                ? 'invoice'
                : 'bill',
            reference: updatedCreditNote.reference,
            amount: updatedCreditNote.grossTotal,
            status: updatedCreditNote.status,
          };

          const { data: transaction } = await axios.post(
            Host('accounts', 'accounts/transaction/api'),
            {
              transactions: payload,
            },
            {
              headers: {
                cookie: `access_token=${token}`,
              },
            }
          );

          const id =
            updatedCreditNote.invoiceType === CreditNoteType.ACCRECCREDIT
              ? 'invoiceId'
              : 'billId';

          const paymentArr = [
            {
              ...updatedCreditNote,
              [id]:
                updatedCreditNote.invoiceType === CreditNoteType.ACCRECCREDIT
                  ? creditNote.invoiceId
                  : creditNote.billId,
              balance:
                updatedCreditNote.invoiceType === CreditNoteType.ACCRECCREDIT
                  ? `-${updatedCreditNote.netTotal}`
                  : updatedCreditNote.netTotal,
              data: updatedCreditNote.issueDate,
              paymentType:
                updatedCreditNote.invoiceType === CreditNoteType.ACCRECCREDIT
                  ? PaymentModes.INVOICES
                  : PaymentModes.BILLS,
              transactionId: transaction.id,
              entryType:
                updatedCreditNote.invoiceType === CreditNoteType.ACCRECCREDIT
                  ? EntryType.CREDITNOTE
                  : EntryType.DEBITNOTE,
            },
          ];

          await axios.post(
            Host('payments', `payments/payment/add`),
            {
              payments: paymentArr,
            },
            {
              headers: {
                cookie: `access_token=${token}`,
              },
            }
          );
          await axios.get(Host('contacts', `contacts/contact/balance`), {
            headers: {
              cookie: `access_token=${token}`,
            },
          });
        }
        return await this.FindById(dto.id, req);
      }
      throw new HttpException('Credit Note not found', HttpStatus.NOT_FOUND);
    } else {
      const credit_note = await getCustomRepository(CreditNoteRepository).save({
        contactId: dto.contactId,
        reference: dto.reference,
        issueDate: dto.issueDate,
        dueDate: dto.dueDate,
        invoiceId: dto.invoiceId,
        billId: dto.billId,
        invoiceType: dto.invoiceType,
        invoiceNumber: dto.invoiceNumber,
        discount: dto.discount,
        grossTotal: dto.grossTotal,
        netTotal: dto.netTotal,
        organizationId: req.user.organizationId,
        branchId: req.user.branchId,
        createdById: req.user.id,
        updatedById: req.user.id,
        status: dto.status,
      });

      for (const item of dto.invoice_items) {
        const credit_note_item: ICreditNoteItem = await getCustomRepository(
          CreditNoteItemRepository
        ).save({
          itemId: item.itemId,
          creditNoteId: credit_note.id,
          description: item.description,
          quantity: item.quantity,
          itemDiscount: item.itemDiscount,
          unitPrice: item.unitPrice,
          purchasePrice: item.purchasePrice,
          costOfGoodAmount: item.costOfGoodAmount,
          sequence: item.sequence,
          tax: item.tax,
          total: item.total,
          accountId: item.accountId,
          status: credit_note.status,
        });

        credit_note_item_array.push(credit_note_item);

        const itemDetail = items.find((i) => i.id === item.itemId);
        if (itemDetail.hasInventory === true) {
          itemLedgerArray.push({
            itemId: item.itemId,
            value: item.quantity,
            targetId: credit_note.id,
            type:
              credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
                ? 'increase'
                : 'decrease',
            action: 'create',
          });
        }

        if (credit_note.invoiceType === CreditNoteType.ACCRECCREDIT) {
          const debit = {
            amount: Number(item.quantity) * Number(item.unitPrice),
            account_id: item.accountId,
          };

          debitsArray.push(debit);
        } else if (credit_note.invoiceType === CreditNoteType.ACCPAYCREDIT) {
          const credit = {
            amount: Number(item.quantity) * Number(item.purchasePrice),
            account_id: item.accountId,
          };

          creditsArray.push(credit);
        }
      }

      if (dto.invoiceId) {
        const invoice = await getCustomRepository(InvoiceRepository).findOne({
          where: {
            id: dto.invoiceId,
          },
        });

        let i = 0;
        const invoice_details = [];
        for (const cn of credit_note_item_array) {
          i++;
          if (i <= 5) {
            invoice_details.push({
              itemName: items.find((j) => cn.itemId === j.id).name,
              quantity: cn.quantity,
              price: cn.unitPrice,
              itemDiscount: cn.itemDiscount,
              tax: cn.tax,
              total: cn.total,
            });
          }
        }

        const payload = {
          to: req.user.email,
          from: 'no-reply@invyce.com',
          TemplateAlias: 'credit-note-applied',
          TemplateModel: {
            user_name: req.user.profile.fullName,
            invoice_name: invoice.invoiceNumber,
            issueDate: moment(credit_note.issueDate).format('llll'),
            invoice_details,
            gross_total: credit_note.grossTotal,
            itemDisTotal: credit_note.discount,
            net_total: credit_note.netTotal,
          },
        };

        await this.emailService.emit(SEND_FORGOT_PASSWORD, payload);
      }

      if (credit_note.status === Statuses.AUTHORISED) {
        await axios.post(
          Host('items', `items/item/manage-inventory`),
          {
            payload: itemLedgerArray,
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        if (credit_note.invoiceType === CreditNoteType.ACCRECCREDIT) {
          const credit = {
            account_id: await accounts.find((i) => i.code === '15004').id,
            amount: dto.netTotal,
          };

          creditsArray.push(credit);
        } else if (credit_note.invoiceType === CreditNoteType.ACCPAYCREDIT) {
          const debit = {
            account_id: await accounts.find((i) => i.code === '40001').id,
            amount: dto.netTotal,
          };

          debitsArray.push(debit);
        }

        const payload = {
          dr: debitsArray,
          cr: creditsArray,
          type:
            credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
              ? 'invoice'
              : 'bill',
          reference: dto.reference,
          amount: dto.grossTotal,
          status: credit_note.status,
        };

        const { data: transaction } = await axios.post(
          Host('accounts', 'accounts/transaction/api'),
          {
            transactions: payload,
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );

        const id =
          credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
            ? 'invoiceId'
            : 'billId';

        const paymentArr = [
          {
            ...credit_note,
            [id]:
              credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
                ? credit_note.invoiceId
                : credit_note.billId,
            balance:
              credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
                ? `-${credit_note.netTotal}`
                : credit_note.netTotal,
            data: credit_note.issueDate,
            paymentType:
              credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
                ? PaymentModes.INVOICES
                : PaymentModes.BILLS,
            transactionId: transaction.id,
            entryType:
              credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
                ? EntryType.CREDITNOTE
                : EntryType.DEBITNOTE,
          },
        ];

        await axios.post(
          Host('payments', `payments/payment/add`),
          {
            payments: paymentArr,
          },
          {
            headers: {
              cookie: `access_token=${token}`,
            },
          }
        );
        await axios.get(Host('contacts', `contacts/contact/balance`), {
          headers: {
            cookie: `access_token=${token}`,
          },
        });
      }

      return await this.FindById(credit_note.id, req);
    }
  }

  async FindById(creditNoteId: number, req: IRequest): Promise<ICreditNote> {
    const creditNote = await getCustomRepository(CreditNoteRepository).findOne({
      where: { id: creditNoteId },
      relations: ['creditNoteItems'],
    });

    const invoice = getCustomRepository(InvoiceRepository).findOne({
      select: ['id', 'invoiceNumber'],
      where: { id: creditNote.invoiceId },
    });

    let new_credit_note;
    if (creditNote?.contactId) {
      const contactId = creditNote?.contactId;
      const itemIdsArray = creditNote?.creditNoteItems.map((ids) => ids.itemId);

      if (!req || !req.cookies) return null;
      const token = req.cookies['access_token'];

      const contactRequest = {
        url: Host('contacts', `contacts/contact/${contactId}`),
        method: 'GET',
        headers: {
          cookie: `access_token=${token}`,
        },
      };

      const { data: payments } = await axios.post(
        Host('payments', `payments/payment/invoice`),
        {
          ids: [creditNoteId],
          type: 'BILL',
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      const { data: contact } = await axios(contactRequest as unknown);
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

      const balance = payments.find(
        (bal) => parseInt(bal.id) === creditNote.id
      );
      const paid_amount = balance?.invoice?.balance || 0;
      const due_amount = balance?.invoice?.balance
        ? creditNote.netTotal - balance?.invoice?.balance
        : creditNote.netTotal;

      const payment_status = () => {
        if (paid_amount < due_amount && due_amount < creditNote?.netTotal) {
          return 'Partial Payment';
        } else if (due_amount === creditNote?.netTotal) {
          return 'Payment Pending';
        } else if (paid_amount === creditNote?.netTotal) {
          return 'Full Payment';
        } else {
          return null;
        }
      };

      const newCreditNote = {
        ...creditNote,
        paid_amount,
        due_amount,
        payment_status: payment_status(),
      };

      const creditNoteItemArr = [];

      for (const i of creditNote.creditNoteItems) {
        const item = items.find((j) => i.itemId === j.id);
        creditNoteItemArr.push({ ...i, item });
      }

      if (creditNoteItemArr.length > 0) {
        new_credit_note = {
          ...newCreditNote,
          relation: {
            links: invoice,
            type: 'SI',
          },
          contact: contact.result,
          creditNoteItems: creditNoteItemArr,
        };
      }
    }
    return new_credit_note ? new_credit_note : creditNote;
  }

  async DeleteCreditNote(invoiceIds, req: IRequest) {
    if (!req || !req.cookies) return null;
    const token = req.cookies['access_token'];

    const itemLedgerArray = [];
    const itemArray = [];
    const targetIds = [];

    for (const i of invoiceIds.ids) {
      const credit_note_items = await getCustomRepository(
        CreditNoteItemRepository
      ).find({
        where: { creditNoteId: i },
      });

      const mapItemIds = credit_note_items.map((item) => item.itemId);

      const { data: items } = await axios.post(
        Host('items', `items/item/ids`),
        {
          ids: mapItemIds,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );
      itemArray.push(items);
    }

    const newItemArray = itemArray.flat();
    for (const i of invoiceIds.ids) {
      const credit_note = await getCustomRepository(
        CreditNoteRepository
      ).findOne({
        where: { id: i },
      });

      await getCustomRepository(CreditNoteRepository).update(
        { id: i },
        { status: 0 }
      );

      const credit_note_items = await getCustomRepository(
        CreditNoteItemRepository
      ).find({
        where: { creditNoteId: i },
      });

      for (const j of credit_note_items) {
        await getCustomRepository(CreditNoteItemRepository).update(
          { creditNoteId: i },
          { status: 0 }
        );

        if (credit_note.status === Statuses.AUTHORISED) {
          const itemDetail = newItemArray.find((i) => i.id === j.itemId);
          if (itemDetail.hasInventory === true) {
            itemLedgerArray.push({
              itemId: j.itemId,
              value: j.quantity,
              targetId:
                invoiceIds.type === PaymentModes.INVOICES
                  ? credit_note.invoiceId
                  : credit_note.billId,
              type:
                credit_note.invoiceType === CreditNoteType.ACCRECCREDIT
                  ? 'increase'
                  : 'decrease',
              action: 'delete',
            });
          }
        }
      }

      if (invoiceIds.type === PaymentModes.INVOICES) {
        targetIds.push(credit_note.invoiceId);
      } else {
        targetIds.push(credit_note.billId);
      }
    }

    if (itemLedgerArray.length > 0) {
      await axios.post(
        Host('payments', `payments/payment/delete`),
        {
          ids: targetIds,
          type: invoiceIds.type,
          entryType:
            invoiceIds.type === PaymentModes.INVOICES
              ? EntryType.CREDITNOTE
              : EntryType.DEBITNOTE,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );

      await axios.post(
        Host('items', `items/item/manage-inventory`),
        {
          payload: itemLedgerArray,
        },
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        }
      );
    }

    return true;
  }
}
