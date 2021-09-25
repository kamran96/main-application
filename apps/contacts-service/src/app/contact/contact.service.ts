import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Contact } from '../Schemas/contact.schema';

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private contactModel) {}

  async FindAll(contactData, queryData) {
    const { page_size, page_no, query, purpose, type } = queryData;

    let contacts;

    if (purpose === 'ALL') {
      contacts = await this.contactModel.find({
        status: 1,
        organizationId: contactData.organizationId,
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
          pagingCounter: 'page_no',
        };

        for (let i in data) {
          if (data[i].type === 'search') {
            const val = data[i].value?.split('%')[1];
            contacts = await this.contactModel.paginate(
              {
                status: 1,
                organizationId: contactData.organizationId,
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
                organizationId: contactData.organizationId,
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
                organizationId: contactData.organizationId,
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
                organizationId: contactData.organizationId,
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
                organizationId: contactData.organizationId,
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
            organizationId: contactData.organizationId,
            contactType: type,
          },
          {
            offset: page_no * page_size - page_size,
            limit: page_size,
            customLabels: myCustomLabels,
          }
        );
      }
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
}
