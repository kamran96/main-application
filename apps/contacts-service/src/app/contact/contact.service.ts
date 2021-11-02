import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import axios from 'axios';
import { Contact } from '../Schemas/contact.schema';
import { Integrations } from '@invyce/global-constants';

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private contactModel) {}

  async FindAll(req, queryData) {
    const { page_size, page_no, query, purpose, type: contactType } = queryData;

    let contacts;

    if (purpose === 'ALL') {
      contacts = await this.contactModel.find({
        status: 1,
        organizationId: req.user.organizationId,
      });
    } else {
      if (query) {
        const filterData: any = Buffer.from(query, 'base64').toString();
        const data = JSON.parse(filterData);

        const myCustomLabels = {
          docs: 'contacts',
          totalDocs: 'total',
          meta: 'pagination',
          limit: 'page_size',
          page: 'page_no',
          nextPage: 'next',
          prevPage: 'prev',
          totalPages: 'total_pages',
        };

        for (let i in data) {
          if (data[i].type === 'search') {
            const val = data[i].value?.split('%')[1];
            contacts = await this.contactModel.paginate(
              {
                status: 1,
                organizationId: req.user.organizationId,
                [i]: { $regex: val },
              },
              {
                offset: page_no * page_size - page_size,
                limit: page_size,
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
                offset: page_no * page_size - page_size,
                limit: page_size,
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
                offset: page_no * page_size - page_size,
                limit: page_size,
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
                offset: page_no * page_size - page_size,
                limit: page_size,
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
                offset: page_no * page_size - page_size,
                limit: page_size,
                customLabels: myCustomLabels,
              }
            );
          }
        }
      } else {
        const myCustomLabels = {
          docs: 'contacts',
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
            offset: page_no * page_size - page_size,
            limit: page_size,
            customLabels: myCustomLabels,
          }
        );
      }

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

      const mapContactIds = contacts?.contacts.map((con) => ({
        id: con._id,
        type: con.contactType,
      }));

      const { data: payments } = await http.post(`payments/payment/contact`, {
        ids: mapContactIds,
      });

      let cont_arr = [];
      for (let i of contacts.contacts) {
        let balance = payments.find((pay) => pay.id == i._id);

        cont_arr.push({
          ...i.toObject(),
          balance: balance?.payment?.balance,
        });
      }

      contacts = {
        contacts: cont_arr,
        pagination: contacts.pagination,
      };
    }

    return contacts;
  }

  async CreateContact(contactDto, contactData) {
    if (contactDto && contactDto.isNewRecord === false) {
      const contact = await this.FindById(contactDto.id);

      if (contact) {
        const updatedContact: any = {};

        updatedContact.businessName =
          contactDto.businessName || contact.businessName;
        updatedContact.accountNumber =
          contactDto.accountNumber || contact.accountNumber;
        updatedContact.email = contactDto.email || contact.email;
        updatedContact.name = contactDto.name || contact.name;
        updatedContact.contactType =
          contactDto.contactType || contact.contactType;
        updatedContact.cnic = contactDto.cnic || contact.cnic;
        updatedContact.phoneNumber =
          contactDto.phoneNumber || contact.phoneNumber;
        updatedContact.cellNumber = contactDto.cellNumber || contact.cellNumber;
        updatedContact.faxNumber = contactDto.faxNumber || contact.faxNumber;
        updatedContact.skypeName = contactDto.skypeName || contact.skypeName;
        updatedContact.webLink = contactDto.webLink || contact.webLink;
        updatedContact.creditLimit =
          contactDto.creditLimit || contact.creditLimit;
        updatedContact.creditLimitBlock =
          contactDto.creditLimitBlock || contact.creditLimitBlock;
        updatedContact.salesDiscount =
          contactDto.salesDiscount || contact.salesDiscount;
        updatedContact.openingBalance =
          contactDto.openingBalance || contact.openingBalance;
        updatedContact.paymentDaysLimit =
          contactDto.paymentDaysLimit || contact.paymentDaysLimit;
        updatedContact.accountNumber =
          contactDto.accountNumber || contact.accountNumber;

        updatedContact.paymentDaysLimit =
          contactDto.paymentDaysLimit || contact.paymentDaysLimit;
        updatedContact.branchId = contact.branchId;
        updatedContact.addresses = contactDto.addresses || contact.addresses;
        updatedContact.status = 1 || contact.status;
        updatedContact.createdById = contact.createdById;
        updatedContact.organizationId = contact.organizationId;
        updatedContact.updatedById = contactData._id;

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

  async FindById(id) {
    return await this.contactModel.findById(id);
  }

  async Remove(deletedIds) {
    for (let i of deletedIds.ids) {
      await this.contactModel.updateOne(
        { _id: i },
        {
          status: 0,
        }
      );
    }

    return true;
  }

  async ContactByIds(data) {
    return await this.contactModel.find({
      importedContactId: { $in: data.ids },
    });
  }

  async SyncContacts(data, req) {
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

    let transactionArr = [];
    for (let i of data.contacts) {
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
            contactType: i.isCustomer || i.isSupplier,
            balance:
              i?.balances?.accountsReceivable?.outstanding ||
              i?.balances?.accountsPayable?.outstanding,
            createdAt: contact.createdAt,
          });
        }
      }
    }

    await http.post(`accounts/transaction/add`, {
      transactions: transactionArr,
    });
  }
}
