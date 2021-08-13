import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { EntityManager, getCustomRepository } from 'typeorm';
import { ContactRepository } from '../repositories/contact.repository';
import { Contacts } from '../entities';
import { Pagination } from '../Common/services/pagination.service';
import { AddressRepository } from '../repositories';
import { EmailService } from '../Common/services/email.service';
import { PdfService } from '../Common/services/pdf.service';

@Injectable()
export class ContactService {
  constructor(
    private manager: EntityManager,
    private pagination: Pagination,
    private emailService: EmailService,
    private pdfService: PdfService,
  ) {}

  async ListContact(contactData, take, page_no, sort, query) {
    try {
      const contactRepository = getCustomRepository(ContactRepository);

      const sql = `
          select c.id, c."businessName", c."accountNumber", c.email, c.name, c.cnic,
          c."phoneNumber", c."cellNumber", c."faxNumber", c."skypeName", c."webLink", 
          c."creditLimit", c."creditLimitBlock", c."salesDiscount", c."paymentDaysLimit", 
          c."createdAt", c."updatedAt", c."branchId", c."addressId", c."createdById", 
          c."updatedById", c.status, a.description, a.type, a."postalCode", a.town, a.city
          from contacts c
          left join addresses a
          on c."addressId" = a.id

          and c.status = 1
          `;
      // where c."branchId" = ${contactData.branchId}

      return await this.pagination.ListApi(
        contactRepository,
        take,
        page_no,
        sort,
        sql,
        contactData,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async CreateOrUpdateContact(contactDto, contactData) {
    const contactRepository = getCustomRepository(ContactRepository);
    const addressRepository = getCustomRepository(AddressRepository);
    if (contactDto && contactDto.isNewRecord === false) {
      // we need to update
      try {
        const result = await this.FindContactById(contactDto);

        if (Array.isArray(result) && result.length > 0) {
          const [contact] = result;
          const updatedContact = { ...contact };
          delete updatedContact.id;

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
          updatedContact.updatedById =
            contactData.userId || contact.updatedById;

          await this.manager.update(
            Contacts,
            { id: contactDto.id },
            updatedContact,
          );

          const [getUpdatedContact] = await this.FindContactById(contactDto);
          return getUpdatedContact;
        }
        throw new HttpException('Invalid params', HttpStatus.BAD_REQUEST);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    } else {
      // we need to create
      try {
        const contact = await contactRepository.save({
          businessName: contactDto.businessName,
          accountName: contactDto.accountName,
          contactType: contactDto.contactType,
          email: contactDto.email,
          name: contactDto.name,
          cnic: contactDto.cnic,
          phoneNumber: contactDto.phoneNumber,
          cellNumber: contactDto.cellNumber,
          faxNumber: contactDto.faxNumber,
          skypeName: contactDto.skypeName,
          webLink: contactDto.webLink,
          creditLimit: contactDto.creditLimit,
          creditLimitBlock: contactDto.creditLimitBlock,
          salesDiscount: contactDto.salesDiscount,
          paymentDaysLimit: contactDto.paymentDaysLimit,
          branchId: contactData.branchId,
          organizationId: contactData.organizationId,
          createdById: contactData.userId,
          updatedById: contactData.userId,
          status: 1,
        });

        let addressArr = [];
        for (let i of contactDto.addresses) {
          const address = await addressRepository.save({
            description: i.address,
            addressType: i.addressType,
            city: i.city,
            country: i.country,
            postalCode: i.postalCode,
            town: i.town,
            contactId: contact.id,
            status: 1,
          });
          addressArr.push(address);
        }
        return {
          ...contact,
          address: addressArr,
        };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
  async FindContactById(params) {
    try {
      const contactRepository = getCustomRepository(ContactRepository);
      const contact = await contactRepository.find({
        where: { id: params.id, status: 1 },
      });

      return contact;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async DeleteContact(contactDto) {
    try {
      for (let i of contactDto.ids) {
        await this.manager.update(Contacts, { id: i }, { status: 0 });
      }
      const contactRepository = getCustomRepository(ContactRepository);
      const [contact] = await contactRepository.find({
        where: {
          id: contactDto.ids[0],
        },
      });

      return contact;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async CreateContactPdf(contactDto) {
    const contactRepository = getCustomRepository(ContactRepository);

    const contactArr = [];
    for (let i of contactDto.ids) {
      const [contact] = await contactRepository.find({
        where: {
          id: i,
        },
      });

      contactArr.push(contact);
    }

    let newArr = [];
    let heading = [
      [
        '#',
        'business name',
        'account number',
        'email',
        'name',
        'cnic',
        'phone number',
        'cell number',
        'fax number',
        'skype name',
        'web link',
        'credit limit',
        'credit limit block',
        'sale discount',
        'payment days limit',
      ].map(i => i.toUpperCase()),
    ];

    contactArr.forEach((tr, index) => {
      heading.push([
        index + 1,
        tr.businessName,
        tr.accountNumber,
        tr.email,
        tr.name,
        tr.cnic,
        tr.phoneNumber,
        tr.cellNumber,
        tr.faxNumber,
        tr.skypeName,
        tr.webLink,
        tr.creditLimit,
        tr.creditLimitBlock,
        tr.salesDiscount,
        tr.paymentDaysLimit,
      ]);
      newArr.push({
        sno: index + 1,
        business: tr.businessName,
        account: tr.accountNumber,
        email: tr.email,
        name: tr.name,
        cnic: tr.cnic,
        phone_no: tr.phoneNumber,
        cell_no: tr.cellNumber,
        fax_no: tr.faxNumber,
        skype_name: tr.skypeName,
        web_link: tr.webLink,
        credit_limit: tr.creditLimit,
        creditLimitBlock: tr.creditLimitBlock,
        sale_discount: tr.salesDiscount,
        payment_days_limit: tr.paymentDaysLimit,
      });
    });

    let pdfArr = [...heading, ...newArr];
    const pdf = await this.pdfService.GeneratePdf(pdfArr);

    // const email = await this.email
    //   .compose(
    //     invoiceData.invoice.contact.email,
    //     'Order Invoice',
    //     '',
    //     'phunar@uconnect.pk',
    //     '',
    //     [
    //       {
    //         filename: 'download.pdf',
    //         path: 'download.pdf',
    //         contentType: 'application/pdf',
    //       },
    //     ],
    //   )
    //   .send();

    console.log(pdf);
    return pdf;
  }

  async CreateContactUs(contactDto) {
    // const email = await this.emailService.SendEmail(
    //   contactDto.name,
    //   contactDto.message,
    //   contactDto.subject,
    //   contactDto.cc,
    //   contactDto.bcc,
    // );

    const email = await this.emailService
      .compose(
        contactDto.email,
        'Request for Contact',
        `${contactDto.message}`,
        'admin@invyce.com',
      )
      .send();

    // console.log(email, 'okk');

    return contactDto;
  }
}
