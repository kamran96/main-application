import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from '../Schemas/contact.schema';

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private contactModel) {}

  async FindAll() {
    return await this.contactModel.find({ status: 1 }).exec();
  }

  async CreateContact(contactDto) {
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
        updatedContact.cnic = contactDto.cnic || contact.cnic;
        updatedContact.phoneNumber =
          contactDto.phoneNumber || contact.phoneNumber;
        updatedContact.faxNumber = contactDto.faxNumber || contact.faxNumber;
        updatedContact.skypeName = contactDto.skypeName || contact.skypeName;
        updatedContact.webLink = contactDto.webLink || contact.webLink;
        updatedContact.creditLimit =
          contactDto.creditLimit || contact.creditLimit;
        updatedContact.creditLimitBlock =
          contactDto.creditLimitBlock || contact.creditLimitBlock;
        updatedContact.salesDiscount =
          contactDto.salesDiscount || contact.salesDiscount;
        updatedContact.paymentDaysLimit =
          contactDto.paymentDaysLimit || contact.paymentDaysLimit;
        updatedContact.branchId = contact.branchId;
        updatedContact.addressId = contactDto.addressId || contact.addressId;
        updatedContact.status = 1 || contact.status;
        updatedContact.createdById = contact.createdById;
        updatedContact.organizationId = contact.organizationId;
        updatedContact.updatedById = contact.updatedById;

        await this.contactModel.updateOne(
          { _id: contactDto.id },
          updatedContact
        );
      }
      return await this.FindById(contactDto.id);
    } else {
      try {
        const contact = new this.contactModel(contactDto);
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
