import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import axios from 'axios';
import { Contact } from '../Schemas/contact.schema';
import { Entries, Integrations, PaymentModes } from '@invyce/global-constants';
import {
  IPage,
  IRequest,
  IContact,
  IBaseUser,
  IContactWithResponse,
} from '@invyce/interfaces';
import { ContactDto, ContactIds } from '../dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private contactModel) {}

  async FindAll(
    req: IRequest,
    queryData: IPage
  ): Promise<IContactWithResponse> {
    const { page_size, page_no, query, purpose, type: contactType } = queryData;
    const ps: number = parseInt(page_size);
    const pn: number = parseInt(page_no);

    let contacts;

    if (purpose === 'ALL') {
      contacts = await this.contactModel.find({
        status: 1,
        organizationId: req.user.organizationId,
      });
    } else {
      if (query) {
        const filterData = Buffer.from(query, 'base64').toString();
        const data = JSON.parse(filterData);

        const myCustomLabels = {
          docs: 'result',
          totalDocs: 'total',
          meta: 'pagination',
          limit: 'page_size',
          page: 'page_no',
          nextPage: 'next',
          prevPage: 'prev',
          totalPages: 'total_pages',
        };

        for (const i in data) {
          if (data[i].type === 'search') {
            const val = data[i].value?.split('%')[1];
            contacts = await this.contactModel.paginate(
              {
                status: 1,
                organizationId: req.user.organizationId,
                [i]: { $regex: val },
              },
              {
                offset: pn * ps - ps,
                limit: ps,
                customLabels: myCustomLabels,
              }
            );
          } else if (data[i].type === 'date-between') {
            const start_date = data[i].value[0];
            const end_date = data[i].value[1];
            const add_one_day = moment(end_date).add(1, 'day');

            contacts = await this.contactModel.paginate(
              {
                status: 1,
                organizationId: req.user.organizationId,
                [i]: { $gt: start_date, $lt: add_one_day },
              },
              {
                offset: pn * ps - ps,
                limit: ps,
                customLabels: myCustomLabels,
              }
            );
          } else if (data[i].type === 'compare') {
            contacts = await this.contactModel.paginate(
              {
                status: 1,
                organizationId: req.user.organizationId,
                [i]: { $in: data[i]['value'] },
              },
              {
                offset: pn * ps - ps,
                limit: ps,
                customLabels: myCustomLabels,
              }
            );
          } else if (data[i].type === 'in') {
            contacts = await this.contactModel.paginate(
              {
                status: 1,
                organizationId: req.user.organizationId,
                [i]: { $in: data[i]['value'] },
              },
              {
                offset: pn * ps - ps,
                limit: ps,
                customLabels: myCustomLabels,
              }
            );
          } else if (data[i].type === 'equals') {
            contacts = await this.contactModel.paginate(
              {
                status: 1,
                organizationId: req.user.organizationId,
                [i]: data[i].value,
              },
              {
                offset: pn * ps - ps,
                limit: ps,
                customLabels: myCustomLabels,
              }
            );
          }
        }
      } else {
        const myCustomLabels = {
          docs: 'result',
          limit: 'pageSize',
          page: 'currentPage',
          nextPage: 'next',
          prevPage: 'prev',
          totalPages: 'totalPages',
          pagingCounter: 'slNo',
          meta: 'pagination',
        };

        contacts = await this.contactModel.paginate(
          {
            status: 1,
            organizationId: req.user.organizationId,
            contactType,
          },
          {
            offset: pn * ps - ps,
            limit: ps,
            customLabels: myCustomLabels,
          }
        );
      }
    }

    return contacts;
  }

  async CreateContact(
    contactDto: ContactDto,
    contactData: IBaseUser
  ): Promise<IContact> {
    if (contactDto && contactDto.isNewRecord === false) {
      const contact = await this.FindById(contactDto.id);

      if (contact) {
        const updatedContact = {
          businessName: contactDto.businessName || contact.businessName,
          accountNumber: contactDto.accountNumber || contact.accountNumber,
          email: contactDto.email || contact.email,
          name: contactDto.name || contact.name,
          contactType: contactDto.contactType || contact.contactType,
          cnic: contactDto.cnic || contact.cnic,
          phoneNumber: contactDto.phoneNumber || contact.phoneNumber,
          cellNumber: contactDto.cellNumber || contact.cellNumber,
          faxNumber: contactDto.faxNumber || contact.faxNumber,
          skypeName: contactDto.skypeName || contact.skypeName,
          webLink: contactDto.webLink || contact.webLink,
          creditLimit: contactDto.creditLimit || contact.creditLimit,
          creditLimitBlock:
            contactDto.creditLimitBlock || contact.creditLimitBlock,
          salesDiscount: contactDto.salesDiscount || contact.salesDiscount,
          openingBalance: contactDto.openingBalance || contact.openingBalance,
          paymentDaysLimit:
            contactDto.paymentDaysLimit || contact.paymentDaysLimit,

          branchId: contact.branchId,
          addresses: contactDto.addresses || contact.addresses,
          status: 1 || contact.status,
          createdById: contact.createdById,
          organizationId: contact.organizationId,
          updatedById: contactData._id,
        };

        await this.contactModel.updateOne(
          { _id: contactDto.id },
          updatedContact
        );
      }
      return await this.FindById(contactDto.id);
    } else {
      try {
        const contact = new this.contactModel(contactDto);
        contact.organizationId = contactData.organizationId;
        contact.branchId = contactData.branchId;
        contact.createdById = contactData._id;
        contact.updatedById = contactData._id;
        contact.status = 1;
        return await contact.save();
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async SyncContactBalances(req: IRequest) {
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

    const http = axios.create({
      baseURL: 'http://localhost',
      headers: {
        [type]: value,
      },
    });

    const contacts = await this.contactModel.find({
      status: 1,
      organizationId: req.user.organizationId,
      branchId: req.user.branchId,
    });

    const mapContactIds = contacts.map((c) => ({
      id: c.id,
      type: c.contactType,
    }));

    const { data: payments } = await http.post(`payments/payment/contact`, {
      ids: mapContactIds,
    });

    for (const i of contacts) {
      const balance = payments.find((pay) => pay.id == i._id);
      if (i.balance !== balance.payment.balance) {
        await this.contactModel.updateOne(
          { _id: i.id },
          {
            balance:
              i.contactType === PaymentModes.BILLS
                ? Math.abs(balance.payment.balance)
                : balance.payment.balance,
          }
        );
      }
    }
  }

  async FindById(id: string): Promise<IContact> {
    return await this.contactModel.findById(id);
  }

  async Remove(deletedIds: ContactIds): Promise<void> {
    for (const i of deletedIds.ids) {
      await this.contactModel.updateOne(
        { _id: i },
        {
          status: 0,
        }
      );
    }
  }

  async ContactByIds(data: ContactIds): Promise<IContact[]> {
    return await this.contactModel.find({
      importedContactId: { $in: data.ids },
    });
  }

  async SyncContacts(data, req: IRequest): Promise<void> {
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

    const http = axios.create({
      baseURL: 'http://localhost',
      headers: {
        [type]: value,
      },
    });

    const transactionArr = [];
    if (data.type === Integrations.XERO) {
      for (const i of data.contacts) {
        const contacts = await this.contactModel.find({
          importedContactId: i.contactID,
          organizationId: req.user.organizationId,
        });

        if (contacts.length === 0) {
          const getNumbers = (numbers, type) =>
            numbers.find((p) => p.phoneType === type);

          // ruturns 1 if customer 2 if supplier else null
          const ContactType = (customer, supplier) =>
            customer === true ? 1 : supplier === true ? 2 : null;

          const contact = new this.contactModel({
            accountNumber: i.accountNumber,
            email: i.emailAddress,

            name: i.name,
            skypeName: i.skypeUserName,
            contactType: ContactType(i.isCustomer, i.isSupplier),
            webLink: i.website,
            salesDiscount: i.discount,
            cellNumber: getNumbers(i.phones, 'MOBILE').phoneNumber || null,
            faxNumber: getNumbers(i.phones, 'FAX').phoneNumber || null,
            phoneNumber: getNumbers(i.phones, 'DEFAULT').phoneNumber || null,
            importedContactId: i.contactID,
            importedFrom: Integrations.XERO,
            addresses: JSON.stringify(i.addresses),
            organizationId: req.user.organizationId,

            createdById: req.user.id,
            updatedById: req.user.id,
            status: 1,
          });
          await contact.save();
          if (
            i.balances &&
            (i?.balaces?.accountsReceivable?.outstanding !== 0 ||
              i?.balances?.accountsPayable?.outstanding !== 0)
          ) {
            transactionArr.push({
              contactId: contact.id,
              contactType: i.isCustomer
                ? 'customer'
                : i.isSupplier
                ? 'supplier'
                : null,
              balance:
                i?.balances?.accountsReceivable?.outstanding ||
                i?.balances?.accountsPayable?.outstanding,
              ref: 'Xe',
              narration: 'XE contact balance',
              createdAt: contact.createdAt,
            });
          }
        }
      }
    } else if (data.type === Integrations.QUICK_BOOK) {
      for (const i of data.contacts.customers) {
        const contacts = await this.contactModel.find({
          importedContactId: i.Id,
          organizationId: req.user.organizationId,
        });

        if (contacts.length === 0 && i?.GivenName) {
          const contact = new this.contactModel({
            businessName: i.CompanyName,
            name: i.GivenName,
            phoneNumber: i.PrimaryPhone ? i.PrimaryPhone.FreeFormNumber : '',
            email: i.PrimaryEmailAddr ? i.PrimaryEmailAddr.Address : '',
            webLink: i.WebAddr ? i.WebAddr.URI : '',
            contactType: 1,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
            createdById: req.user.id,
            updatedById: req.user.id,
            importedContactId: i.Id,
            importedFrom: Integrations.QUICK_BOOK,
            status: 1,
          });
          await contact.save();
          if (i?.balances > 0) {
            transactionArr.push({
              balance: i.Balance,
              contactId: contact.id,
              ref: 'QB',
              narration: 'QB contact balance',
              name: 'Cash Receiveable',
              contactType: 'customer',
              transactionType: Entries.DEBITS,
              createdAt: contact.createdAt,
            });
          }
        }
      }

      for (const i of data.contacts.vendors) {
        const contacts = await this.contactModel.find({
          importedContactId: i.Id,
          organizationId: req.user.organizationId,
        });

        if (contacts.length === 0 && i?.GivenName) {
          const contact = new this.contactModel({
            businessName: i.CompanyName,
            name: i.GivenName,
            phoneNumber: i.PrimaryPhone ? i.PrimaryPhone.FreeFormNumber : '',
            email: i.PrimaryEmailAddr ? i.PrimaryEmailAddr.Address : '',
            webLink: i.WebAddr ? i.WebAddr.URI : '',
            contactType: 2,
            organizationId: req.user.organizationId,
            branchId: req.user.branchId,
            createdById: req.user.id,
            updatedById: req.user.id,
            importedContactId: i.Id,
            importedFrom: Integrations.QUICK_BOOK,
            status: 1,
          });
          await contact.save();
          if (i?.balances > 0) {
            transactionArr.push({
              balance: i.Balance,
              contactId: contact.id,
              ref: 'QB',
              narration: 'QB contact balance',
              contactType: 'supplier',
              name: 'Cash Receiveable',
              transactionType: Entries.DEBITS,
              createdAt: contact.createdAt,
            });
          }
        }
      }
    }

    await http.post(`accounts/transaction/add`, {
      transactions: transactionArr,
    });
  }
}
