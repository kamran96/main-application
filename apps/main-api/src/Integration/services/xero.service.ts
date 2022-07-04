import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { XeroClient } from 'xero-node';
import jwtDecode from 'jwt-decode';
import { getCustomRepository, In, Raw } from 'typeorm';
import {
  ItemRepository,
  PriceRepository,
  InvoiceItemRepository,
  InvoiceRepository,
  ContactRepository,
  AccountRepository,
  IntegrationRepository,
  PaymentRepository,
  TransactionRepository,
  TransactionItemRepository,
  AddressRepository,
  SecondaryAccountRepository,
  PrimaryAccountRepository,
} from '../../repositories';

import { integrations } from '../integration.enum';

const scopes = `openid profile email accounting.transactions accounting.reports.read accounting.settings accounting.contacts offline_access`;

const client_id = process.env.XERO_CLIENT_ID;
const client_secret = process.env.XERO_CLIENT_SECRET;

const xero = new XeroClient({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: scopes.split(' '),
  state: 'returnPage=my-sweet-dashboard', // custom params (optional)
  httpTimeout: 1000000000, // ms (optional)
});

@Injectable()
export class XeroService {
  constructor() {}

  async XeroConnect() {
    // `buildConsentUrl()` will also call `await xero.initialize()`
    const consetUrl = await xero.buildConsentUrl();

    return consetUrl;
  }

  async XeroCallback(data, userData) {
    try {
      const payload = `/verify/xero${data}`;
      const tokenSet = await xero.apiCallback(payload);
      const [tenant] = await xero.updateTenants(false);

      const getIntegration = await getCustomRepository(
        IntegrationRepository
      ).find({
        where: {
          tenantId: tenant.tenantId,
          status: 1,
        },
      });

      let integration;
      if (getIntegration.length === 0) {
        const decodedIdToken = await jwtDecode(tokenSet.id_token);
        integration = await getCustomRepository(IntegrationRepository).save({
          name: 'xero',
          token: JSON.stringify(tokenSet),
          data: JSON.stringify(decodedIdToken),
          enabled: true,
          organizationId: userData.organizationId,
          tenantId: tenant.tenantId,
          createdById: userData.userId,
          updatedById: userData.userId,
          status: 1,
        });
      }

      const modules = [
        'accounts',
        'transactions',
        'contacts',
        'items',
        'invoices',
        'bills',
      ];
      return {
        integration: integration ? integration : getIntegration[0],
        modules,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async ImportDataFromXero(modules, userData) {
    try {
      const tenant = xero.tenants[0];

      if (modules.indexOf('accounts') >= 0) {
        const xeroAccounts: any = await xero.accountingApi.getAccounts(
          tenant.tenantId
        );

        const trailBalalance = await xero.accountingApi.getReportTrialBalance(
          tenant.tenantId
        );

        console.log(xeroAccounts.body.accounts);

        if (
          Array.isArray(xeroAccounts.body.accounts) &&
          xeroAccounts.body.accounts.length > 0
        ) {
          const sections = trailBalalance.body.reports[0].rows.filter(
            (item: any) => item.rowType === 'Section'
          );

          let arr = [];
          sections.forEach((i) => {
            return i.rows.forEach((j) => {
              const row = j.cells.filter((item) => {
                return item.value !== '';
              });
              arr.push(row);
            });
          });

          let newArr = [];
          arr?.map((item, index) => {
            let obj = { name: '', balance: null, id: null };
            item?.forEach((feach, findex) => {
              if (isNaN(feach?.value)) {
                obj = {
                  ...obj,
                  name: feach?.value,
                  id: Array.isArray(feach.attributes)
                    ? feach.attributes[0].value
                    : null,
                };
              } else {
                obj = {
                  ...obj,
                  balance: feach?.value,
                };
              }
            });
            newArr.push(obj);
          });

          for (let i of xeroAccounts.body.accounts) {
            const accountBalance = newArr.find((j) => j.id === i.accountID);
            const account = await getCustomRepository(AccountRepository).find({
              where: {
                importedAccountId: i.accountID,
                organizationId: userData.organizationId,
              },
            });

            if (account.length === 0) {
              const secondaryAccount = await getCustomRepository(
                SecondaryAccountRepository
              ).find({
                where: {
                  name: i.type,
                  organizationId: userData.organizationId,
                  status: 1,
                },
              });

              let newSecondaryAccount;
              if (secondaryAccount.length === 0) {
                const primaryAccount = await getCustomRepository(
                  PrimaryAccountRepository
                ).find({
                  where: {
                    name: Raw(
                      (alias) => `lower(${alias}) ilike lower('%${i._class}%')`
                    ),
                    organizationId: userData.organizationId,
                    status: 1,
                  },
                });

                newSecondaryAccount = await getCustomRepository(
                  SecondaryAccountRepository
                ).save({
                  name: i.type,
                  primaryAccountId:
                    primaryAccount.length > 0 ? primaryAccount[0].id : null,
                  organizationId: userData.organizationId,
                  createdById: userData.userId,
                  updatedById: userData.userId,
                  status: 1,
                });
              }

              const account = await getCustomRepository(AccountRepository).save(
                {
                  name: i.name,
                  description: i.description,
                  secondaryAccountId:
                    secondaryAccount.length > 0
                      ? secondaryAccount[0].id
                      : newSecondaryAccount.id,
                  code: i.code,
                  taxRate: null,
                  status: 1,
                  importedAccountId: i.accountID,
                  importedFrom: integrations.XERO,
                  organizationId: userData.organizationId,
                }
              );

              if (accountBalance != undefined && accountBalance.balance != 0) {
                const transaction = await getCustomRepository(
                  TransactionRepository
                ).save({
                  amount: accountBalance.balance,
                  ref: 'XERO',
                  narration: 'Xero account balance',
                  date: new Date(),
                  organizationId: userData.organizationId,
                  branchId: userData.branchId,
                  createdById: userData.userId,
                  updatedById: userData.userId,
                  status: 1,
                });

                await getCustomRepository(TransactionItemRepository).save({
                  amount: accountBalance.balance,
                  accountId: account.id,
                  transactionId: transaction.id,
                  transactionType:
                    i._class === 'ASSET' || i._class === 'EXPENSE' ? 10 : 20,
                  branchId: userData.branchId,
                  organizationId: userData.organizationId,
                  createdById: userData.userId,
                  updatedById: userData.userId,
                  status: 1,
                });
              }
            }
          }
        }
      }

      if (modules.indexOf('banks') >= 0) {
        // const xeroBanks = await xero.accountingApi
      }

      if (modules.indexOf('contacts') >= 0) {
        const xeroContacts = await xero.accountingApi.getContacts(
          tenant.tenantId
        );

        for (let i of xeroContacts.body.contacts) {
          const contact = await getCustomRepository(ContactRepository).find({
            where: {
              importedContactId: i.contactID,
              organizationId: userData.organizationId,
            },
          });

          if (contact.length === 0) {
            function getNumbers(numbers, type) {
              return numbers.find((p) => p.phoneType === type);
            }

            function ContactType(customer, supplier) {
              if (customer === true) {
                return 1;
              } else if (supplier === true) {
                return 2;
              } else {
                return 3;
              }
            }

            const contact = await getCustomRepository(ContactRepository).save({
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
              importedFrom: integrations.XERO,
              organizationId: userData.organizationId,
              status: 1,
            });

            await getCustomRepository(AddressRepository).save(
              (i.addresses.map as any)((addr) => ({
                addressType: addr.addressType == 'STREET' ? 1 : 2,
                city: addr.city,
                postalCode: parseInt(addr.postalCode) || null,

                contactId: contact.id,
                organizationId: userData.organizationId,
                branchId: userData.branchId,
                status: 1,
              }))
            );

            if (i.balances !== undefined && i.balances !== 0) {
              async function getAccount(name) {
                const [account] = await getCustomRepository(
                  AccountRepository
                ).find({
                  where: {
                    name,
                    organizationId: userData.organizationId,
                  },
                });
                return account.id;
              }

              const transaction = await getCustomRepository(
                TransactionRepository
              ).save({
                amount:
                  i.isCustomer === true
                    ? i.balances.accountsReceivable.outstanding
                    : i.balances.accountsPayable.outstanding,
                ref: 'XERO',
                narration: 'Xero contact balance',
                date: new Date(),
                organizationId: userData.organizationId,
                branchId: userData.branchId,
                createdById: userData.userId,
                updatedById: userData.userId,
                status: 1,
              });

              await getCustomRepository(TransactionItemRepository).save({
                amount:
                  i.isCustomer === true
                    ? i.balances.accountsReceivable.outstanding
                    : i.balances.accountsPayable.outstanding,
                accountId:
                  i.isCustomer === true
                    ? await getAccount('Accounts Receivable')
                    : await getAccount('Accounts Payable'),
                transactionId: transaction.id,
                transactionType: 10,
                branchId: userData.branchId,
                organizationId: userData.organizationId,
                createdById: userData.userId,
                updatedById: userData.userId,
                status: 1,
              });

              await getCustomRepository(PaymentRepository).save({
                amount:
                  i.isCustomer === true
                    ? i.balances.accountsReceivable.outstanding
                    : i.balances.accountsPayable.outstanding,
                dueDate: contact.createdAt,
                reference: 'Xero opeing balance',
                transactionId: transaction.id,
                contactId: contact.id,
                entryType: 1,

                // importedPaymentId: j.paymentID,
                importedFrom: integrations.XERO,
                organizationId: userData.organizationId,
                status: 1,
              });
            }
          }
        }
      }

      if (modules.indexOf('items') >= 0) {
        const xeroItems = await xero.accountingApi.getItems(tenant.tenantId);

        for (let i of xeroItems.body.items) {
          const item = await getCustomRepository(ItemRepository).find({
            where: {
              importedItemId: i.itemID,
              organizationId: userData.organizationId,
            },
          });

          if (item.length === 0) {
            async function getAccount(code) {
              const [account] = await getCustomRepository(
                AccountRepository
              ).find({
                where: {
                  code: code,
                  organizationId: userData.organizationId,
                },
              });
              return account.id;
            }

            const items = await getCustomRepository(ItemRepository).save({
              name: i.name,
              description: i.description,
              code: i.code,
              importedItemId: i.itemID,
              importedFrom: integrations.XERO,
              stock: i.quantityOnHand,
              openingStock: i.quantityOnHand,
              accountId:
                i.isTrackedAsInventory === true
                  ? await getAccount(i.purchaseDetails.cOGSAccountCode)
                  : null,
              branchId: userData.branchId,
              organizationId: userData.organizationId,
              createdById: userData.userId,
              updatedById: userData.userId,
              status: 1,
            });

            await getCustomRepository(PriceRepository).save({
              purchasePrice: i.purchaseDetails.unitPrice,
              salePrice: i.salesDetails.unitPrice,
              itemId: items.id,
            });
          }
        }
      }

      if (modules.indexOf('invoices') >= 0) {
        console.log('fetching invoice data please wait...');
        const xeroInvoices = await xero.accountingApi.getInvoices(
          tenant.tenantId
        );

        const getXeroInvoiceIds = xeroInvoices.body.invoices.map(
          (inv) => inv.invoiceID
        );

        for (let i of getXeroInvoiceIds) {
          const a = await xero.accountingApi.getInvoice(tenant.tenantId, i);
          const xeroInvoice = a.body.invoices[0];

          const [contact] = await getCustomRepository(ContactRepository).find({
            where: {
              importedContactId: xeroInvoice.contact.contactID,
              organizationId: userData.organizationId,
            },
          });

          const inv = await getCustomRepository(InvoiceRepository).find({
            where: {
              importedInvoiceId: xeroInvoice.invoiceID,
              organizationId: userData.organizationId,
            },
          });

          if (inv && inv.length === 0) {
            const invoice = await getCustomRepository(InvoiceRepository).save({
              reference: xeroInvoice.reference,
              contactID: contact.id,
              issueDate: xeroInvoice.date,
              invoiceNumber: xeroInvoice.invoiceNumber,
              netTotal: xeroInvoice.subTotal,
              grossTotal: xeroInvoice.total,
              discount: xeroInvoice.totalDiscount,
              currency: xeroInvoice.currencyCode,
              importedInvoiceId: xeroInvoice.invoiceID,
              importFrom: integrations.XERO,
              organizationId: userData.organizationId,
              status: 1,
            });

            for (let j of xeroInvoice.lineItems) {
              const [item] = await getCustomRepository(ItemRepository).find({
                where: {
                  organizationId: userData.organizationId,
                  code: j.itemCode,
                },
              });

              console.log(item);

              const [account] = await getCustomRepository(
                AccountRepository
              ).find({
                where: {
                  organizationId: userData.organizationId,
                  code: j.accountCode,
                },
              });

              console.log(j);

              await getCustomRepository(InvoiceItemRepository).save({
                invoiceId: invoice.id,
                itemId: item !== undefined ? item.id : null,
                description: j.description,
                total: j.lineAmount,
                tax: j.taxAmount !== undefined ? j.taxAmount.toString() : null,
                unitPrice: j.unitAmount,
                quantity:
                  j.quantity !== undefined ? j.quantity.toString() : null,
                itemDiscount:
                  j.quantity !== undefined ? j.discountAmount.toString() : null,
                accountId: account ? account.id : null,
                organizationId: userData.organizationId,
                createdById: userData.userId,
              });
            }
            if (
              xeroInvoice.payments !== undefined &&
              xeroInvoice.payments.length > 0
            ) {
              for (let j of xeroInvoice.payments) {
                await getCustomRepository(PaymentRepository).save({
                  amount: j.amount,
                  date: j.date,
                  reference: j.reference,

                  importedPaymentId: j.paymentID,
                  importedFrom: integrations.XERO,
                  organizationId: userData.organizationId,
                  status: 1,
                });
              }
            }
          }
        }
      }

      return 'okkkk';
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
