import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as OAuthClient from 'intuit-oauth';
import axios from 'axios';
import {
  AccountRepository,
  AddressRepository,
  ContactRepository,
  IntegrationRepository,
  InvoiceItemRepository,
  InvoiceRepository,
  ItemRepository,
  PriceRepository,
  PurchaseItemRepository,
  PurchaseRepository,
  TransactionItemRepository,
  TransactionRepository,
  SecondaryAccountRepository,
  PrimaryAccountRepository,
} from '../../repositories';
import { getCustomRepository, Raw } from 'typeorm';
import { integrations } from '../integration.enum';

const client_id = process.env.QUICKBOOKS_CLIENT_ID;
const client_secret = process.env.QUICKBOOKS_CLIENT_SECRET;

const oauthClient = new OAuthClient({
  clientId: client_id,
  clientSecret: client_secret,
  environment: 'sandbox',
  redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
});

@Injectable()
export class QuickbooksService {
  async QuickbooksConnect() {
    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.openid],
      state: 'testState',
    });
    return authUri;
  }

  async QuickbooksVerify(token, userData) {
    try {
      const query = `verify/quickbooks${token}`;
      const quickbookData = await oauthClient.createToken(query);

      const getIntegration = await getCustomRepository(
        IntegrationRepository
      ).find({
        where: {
          tenantId: quickbookData.token.realmId,
          status: 1,
        },
      });

      let integration;
      if (getIntegration.length === 0) {
        integration = await getCustomRepository(IntegrationRepository).save({
          name: 'quickbooks',
          token: JSON.stringify(quickbookData.token),
          data: JSON.stringify(quickbookData),
          enabled: true,
          organizationId: userData.organizationId,
          tenantId: quickbookData.token.realmId,
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
        modules,
        integration: integration ? integration : getIntegration,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async test() {
    const invoice_items: any = [
      {
        Id: '1',
        LineNum: 1,
        Description: 'Rock Fountain',
        Amount: 275,
        LinkedTxn: [[Object]],
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: [Object],
          UnitPrice: 275,
          Qty: 1,
          TaxCodeRef: [Object],
        },
      },
      {
        Id: '2',
        LineNum: 2,
        Description: 'Fountain Pump',
        Amount: 12.75,
        LinkedTxn: [[Object]],
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: [Object],
          UnitPrice: 12.75,
          Qty: 1,
          TaxCodeRef: [Object],
        },
      },
      {
        Id: '3',
        LineNum: 3,
        Description: 'Concrete for fountain installation',
        Amount: 47.5,
        LinkedTxn: [[Object]],
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: [Object],
          UnitPrice: 9.5,
          Qty: 5,
          TaxCodeRef: [Object],
        },
      },
    ];

    for (let j of invoice_items) {
      const [item] = await getCustomRepository(ItemRepository).find({
        select: ['id'],
        where: {
          importedItemId: j.Id,
          organizationId: 23,
        },
      });

      console.log(item);

      await getCustomRepository(InvoiceItemRepository).save({
        invoiceId: 797,
        itemId: item.id,
        description: j.Description,
        total: j.SalesItemLineDetail.UnitPrice * j.SalesItemLineDetail.Qty,
        unitPrice: j.SalesItemLineDetail.UnitPrice,
        quantity: j.SalesItemLineDetail.Qty,
        organizationId: 23,
        // createdById: userData.userId,
        status: 1,
      });
    }
  }

  async GetQuickbooksData(userData, modules) {
    try {
      const realmId = oauthClient.token.realmId;
      const refresh_data = await oauthClient.refresh();
      const access_token = refresh_data.token.access_token;
      const apiUri = process.env.API_URI;

      // QB accounts
      if (modules.indexOf('accounts') >= 0) {
        const url =
          apiUri + realmId + '/query?query=' + 'select * from Account';
        console.log('Making API call to: ' + url);

        const requestObj: any = {
          url: url,
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + access_token,
            Accept: 'application/json',
          },
        };

        const { data } = await axios(requestObj);
        console.log(data.QueryResponse.Account);

        for (let acc of data.QueryResponse.Account) {
          const account = await getCustomRepository(AccountRepository).find({
            where: {
              importedAccountId: acc.Id,
              organizationId: userData.organizationId,
            },
          });

          if (account.length === 0) {
            const secondaryAccount = await getCustomRepository(
              SecondaryAccountRepository
            ).find({
              where: {
                name: acc.AccountType,
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
                    (alias) =>
                      `lower(${alias}) ilike lower('%${acc.Classification}%')`
                  ),
                  organizationId: userData.organizationId,
                  status: 1,
                },
              });
              newSecondaryAccount = await getCustomRepository(
                SecondaryAccountRepository
              ).save({
                name: acc.AccountType,
                primaryAccountId:
                  primaryAccount.length > 0 ? primaryAccount[0].id : null,
                organizationId: userData.organizationId,
                createdById: userData.userId,
                updatedById: userData.userId,
                status: 1,
              });
            }

            // const getCode = await this.GetUniqueCode(
            //   primaryAccount,
            //   userData.organizationId,
            // );

            const QBAccounts = await getCustomRepository(
              AccountRepository
            ).save({
              name: acc.Name,
              description: acc.FullyQualifiedName,
              secondaryAccountId:
                secondaryAccount.length > 0
                  ? secondaryAccount[0].id
                  : newSecondaryAccount.id,
              // code: getCode.toString(),
              importedAccountId: acc.Id,
              importedFrom: integrations.QUICK_BOOK,
              organizationId: userData.organizationId,
              createdById: userData.userId,
              updatedById: userData.userId,
              status: 1,
            });

            if (acc.CurrentBalance > 0) {
              const transaction = await getCustomRepository(
                TransactionRepository
              ).save({
                amount: acc.CurrentBalance,
                ref: acc.domain,
                narration: 'QB opening balance',
                date: new Date(),
                organizationId: userData.organizationId,
                branchId: userData.branchId,
                createdById: userData.userId,
                updatedById: userData.userId,
                status: 1,
              });

              await getCustomRepository(TransactionItemRepository).save({
                amount: acc.CurrentBalance,
                accountId: QBAccounts.id,
                transactionId: transaction.id,
                transactionType:
                  acc.Classification == 'Asset' || 'Expense' ? 10 : 20,
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

      if (modules.indexOf('contacts') >= 0) {
        const customerUrl =
          apiUri + realmId + '/query?query=' + 'select * from Customer';
        console.log('Making API call to: ' + customerUrl);

        const requestCustomer: any = {
          url: customerUrl,
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + access_token,
            Accept: 'application/json',
          },
        };
        const { data } = await axios(requestCustomer);

        for (let i of data.QueryResponse.Customer) {
          const contact = await getCustomRepository(ContactRepository).find({
            where: {
              importedContactId: i.Id,
              organizationId: userData.organizationId,
            },
          });

          if (Array.isArray(contact) && contact.length === 0) {
            const QBContact = await getCustomRepository(ContactRepository).save(
              {
                businessName: i.CompanyName,
                name: i.GivenName,
                phoneNumber: i.PrimaryPhone
                  ? i.PrimaryPhone.FreeFormNumber
                  : '',
                email: i.PrimaryEmailAddr ? i.PrimaryEmailAddr.Address : '',
                webLink: i.WebAddr ? i.WebAddr.URI : '',
                contactType: 1,
                organizationId: userData.organizationId,
                branchId: userData.branchId,
                createdById: userData.userId,
                updatedById: userData.userId,
                importedContactId: i.Id,
                importedFrom: integrations.QUICK_BOOK,
                status: 1,
              }
            );

            if (i.BillAddr) {
              await getCustomRepository(AddressRepository).save({
                city: i.BillAddr.City,
                postalCode: parseInt(i.BillAddr.PostalCode),

                contactId: QBContact.id,
                organizationId: userData.organizationId,
                branchId: userData.branchId,
                status: 1,
              });
            }
            if (i.Balance !== undefined && i.Balance !== 0) {
              const [account] = await getCustomRepository(
                AccountRepository
              ).find({
                where: {
                  name: 'Cash Receiveable',
                  organizationId: userData.organizationId,
                },
              });

              const transaction = await getCustomRepository(
                TransactionRepository
              ).save({
                amount: i.Balance,
                ref: 'QB',
                narration: 'QB contact balance',
                date: new Date(),
                branchId: userData.branchId,
                organizationId: userData.organizationId,
                createdById: userData.userId,
                updatedById: userData.userId,
                status: 1,
              });

              await getCustomRepository(TransactionItemRepository).save({
                amount: i.Balance,
                accountId: account.id,
                transactionId: transaction.id,
                transactionType: 10,
                branchId: userData.branchId,
                organizationId: userData.organizationId,
                createdById: userData.userId,
                updatedById: userData.userId,
                status: 1,
              });
            }
          }
        }
        const vendorUrl =
          apiUri + realmId + '/query?query=' + 'select * from Vendor';
        console.log('Making API call to: ' + vendorUrl);

        const requestVendor: any = {
          url: vendorUrl,
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + access_token,
            Accept: 'application/json',
          },
        };

        const vendorData = await axios(requestVendor);

        for (let i of vendorData.data.QueryResponse.Vendor) {
          const contact = await getCustomRepository(ContactRepository).find({
            where: {
              importedContactId: i.Id,
              organizationId: userData.organizationId,
            },
          });

          if (contact.length === 0) {
            const QBContact = await getCustomRepository(ContactRepository).save(
              {
                businessName: i.CompanyName,
                name: i.GivenName,
                contactType: 2,
                phoneNumber: i.PrimaryPhone
                  ? i.PrimaryPhone.FreeFormNumber
                  : '',
                email: i.PrimaryEmailAddr ? i.PrimaryEmailAddr.Address : '',
                webLink: i.WebAddr ? i.WebAddr.URI : '',
                organizationId: userData.organizationId,
                branchId: userData.branchId,
                createdById: userData.userId,
                updatedById: userData.userId,
                importedContactId: i.Id,
                importedFrom: integrations.QUICK_BOOK,
                status: 1,
              }
            );

            if (i.BillAddr) {
              await getCustomRepository(AddressRepository).save({
                city: i.BillAddr.City,
                postalCode: parseInt(i.BillAddr.PostalCode),

                contactId: QBContact.id,
                organizationId: userData.organizationId,
                branchId: userData.branchId,
                status: 1,
              });
            }

            if (i.Balance !== undefined && i.Balance !== 0) {
              const [account] = await getCustomRepository(
                AccountRepository
              ).find({
                where: {
                  name: 'Cash Receiveable',
                  organizationId: userData.organizationId,
                },
              });

              const transaction = await getCustomRepository(
                TransactionRepository
              ).save({
                amount: i.Balance,
                ref: 'QB',
                narration: 'QB contact balance',
                date: new Date(),
                branchId: userData.branchId,
                organizationId: userData.organizationId,
                createdById: userData.userId,
                updatedById: userData.userId,
                status: 1,
              });

              await getCustomRepository(TransactionItemRepository).save({
                amount: i.Balance,
                accountId: account.id,
                transactionId: transaction.id,
                transactionType: 10,
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

      if (modules.indexOf('items') >= 0) {
        const url = apiUri + realmId + '/query?query=' + 'select * from Item';
        console.log('Making API call to: ' + url);

        const requestVendor: any = {
          url: url,
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + access_token,
            Accept: 'application/json',
          },
        };

        const { data } = await axios(requestVendor);
        console.log(data.QueryResponse.Item);

        for (let i of data.QueryResponse.Item) {
          const item = await getCustomRepository(ItemRepository).find({
            where: {
              organizationId: userData.organizationId,
              importedItemId: i.Id,
            },
          });

          if (item.length === 0) {
            const QBItem = await getCustomRepository(ItemRepository).save({
              name: i.Name,
              description: i.Description,
              hasInventory: i.TrackQtyOnHand,
              stock: i.TrackQtyOnHand === true ? i.QtyOnHand : null,
              openingStock: i.TrackQtyOnHand === true ? i.QtyOnHand : null,
              importedItemId: i.Id,
              importedFrom: integrations.QUICK_BOOK,
              organizationId: userData.organizationId,
              branchId: userData.branchId,
              createdById: userData.userId,
              updatedById: userData.userId,
              status: 1,
            });

            await getCustomRepository(PriceRepository).save({
              purchasePrice: i.PurchaseCost,
              salePrice: i.UnitPrice,
              itemId: QBItem.id,
            });

            if (i.TrackQtyOnHand === true) {
              const [account] = await getCustomRepository(
                AccountRepository
              ).find({
                where: {
                  organizationId: userData.organizationId,
                  name: i.AssetAccountRef.name,
                },
              });

              const transaction = await getCustomRepository(
                TransactionRepository
              ).save({
                amount: i.PurchaseCost * i.QtyOnHand,
                ref: i.domain,
                narration: 'QB item opening stock balance',
                date: new Date(),
                organizationId: userData.organizationId,
                branchId: userData.branchId,
                createdById: userData.userId,
                updatedById: userData.userId,
                status: 1,
              });

              await getCustomRepository(TransactionItemRepository).save({
                amount: i.PurchaseCost * i.QtyOnHand,
                accountId: account.id,
                transactionId: transaction.id,
                transactionType: 10,
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

      if (modules.indexOf('invoices') >= 0) {
        const url =
          apiUri + realmId + '/query?query=' + 'select * from Invoice';
        console.log('Making API call to: ' + url);

        const request: any = {
          url: url,
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + access_token,
            Accept: 'application/json',
          },
        };

        const { data } = await axios(request);

        for (let i of data.QueryResponse.Invoice) {
          const invoice = await getCustomRepository(InvoiceRepository).find({
            where: {
              importedInvoiceId: i.Id,
              organizationId: userData.organizationId,
            },
          });

          if (invoice.length === 0) {
            const [contact] = await getCustomRepository(ContactRepository).find(
              {
                where: {
                  businessName: i.CustomerRef.name,
                  organizationId: userData.organizationId,
                },
              }
            );

            const QBInvoice = await getCustomRepository(InvoiceRepository).save(
              {
                reference: i.domain,
                contactId: contact ? contact.id : null,
                issueDate: i.TxnDate,
                dueDate: i.DueDate,
                grossTotal: i.TotalAmt,
                netTotal:
                  i.TxnTaxDetail.TotalTax > 0
                    ? i.TotalAmt - i.TxnTaxDetail.TotalTax
                    : i.TotalAmt,
                date: new Date().toString(),
                currency: i.CurrencyRef.value,
                importedInvoiceId: i.Id,
                importedFrom: integrations.QUICK_BOOK,
                organizationId: userData.organizationId,
                createdById: userData.userId,
                updatedById: userData.userId,
                status: 1,
              }
            );

            const invoice_items = i.Line.filter(
              (item) => item.Id !== undefined
            );

            for (let j of invoice_items) {
              const [item] = await getCustomRepository(ItemRepository).find({
                select: ['id'],
                where: {
                  importedItemId: j.Id,
                  organizationId: userData.organizationId,
                },
              });

              await getCustomRepository(InvoiceItemRepository).save({
                invoiceId: QBInvoice.id,
                itemId: item.id,
                description: j.Description,
                total:
                  j.SalesItemLineDetail.UnitPrice * j.SalesItemLineDetail.Qty,
                unitPrice: j.SalesItemLineDetail.UnitPrice,
                quantity: j.SalesItemLineDetail.Qty,
                organizationId: userData.organizationId,
                createdById: userData.userId,
                status: 1,
              });
            }
          }
        }
      }

      if (modules.indexOf('bills') >= 0) {
        const url = apiUri + realmId + '/query?query=' + 'select * from Bill';
        console.log('Making API call to: ' + url);

        const request: any = {
          url: url,
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + access_token,
            Accept: 'application/json',
          },
        };

        const { data } = await axios(request);

        for (let i of data.QueryResponse.Bill) {
          const bill = await getCustomRepository(PurchaseRepository).find({
            where: {
              importedBillId: i.Id,
              organizationId: userData.organizationId,
            },
          });

          if (bill.length === 0) {
            const [contact] = await getCustomRepository(ContactRepository).find(
              {
                where: {
                  businessName: i.VendorRef.name,
                  organizationId: userData.organizationId,
                },
              }
            );

            const QBBill = await getCustomRepository(PurchaseRepository).save({
              reference: i.domain,
              contactId: contact ? contact.id : null,
              issueDate: i.TxnDate,
              dueDate: i.DueDate,
              grossTotal: i.TotalAmt,
              netTotal: i.TotalAmt,
              date: new Date().toString(),
              // currency: i.CurrencyRef.value,
              importedBillId: i.Id,
              importedFrom: integrations.QUICK_BOOK,
              organizationId: userData.organizationId,
              createdById: userData.userId,
              updatedById: userData.userId,
              status: 1,
            });

            const invoice_items = i.Line.filter(
              (item) => item.Id !== undefined
            );

            for (let j of invoice_items) {
              const [item] = await getCustomRepository(ItemRepository).find({
                select: ['id'],
                where: {
                  importedItemId: j.Id,
                  organizationId: userData.organizationId,
                },
              });

              await getCustomRepository(PurchaseItemRepository).save({
                purchaseId: QBBill.id,
                itemId: item.id,
                description: j.Description,
                total: i.Amount,
                unitPrice: j.ItemBasedExpenseLineDetail
                  ? j.ItemBasedExpenseLineDetail.UnitPrice
                  : 0,
                quantity: j.ItemBasedExpenseLineDetail
                  ? j.ItemBasedExpenseLineDetail.Qty
                  : 0,
                organizationId: userData.organizationId,
                // createdBy: userData.userId,
                status: 1,
              });
            }
          }
        }
      }

      return 'okk';
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async GetUniqueCode(primaryAccount, organizationId) {
    const [secondaryAccount] = await getCustomRepository(
      SecondaryAccountRepository
    ).find({
      where: {
        organizationId,
        primaryAccountId: primaryAccount.id,
      },
    });

    const [account] = await getCustomRepository(AccountRepository).find({
      where: {
        organizationId,
        // secondaryAccountId: ,
      },
    });

    const code = parseInt(account.code) + 1;
    return code;
  }
}
