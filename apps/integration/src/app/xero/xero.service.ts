import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { XeroClient } from 'xero-node';
// import * as jwtDecode from 'jwt-decode';
import axios from 'axios';
import { Integrations } from '@invyce/global-constants';

const scopes = `openid profile email accounting.transactions accounting.reports.read accounting.settings accounting.contacts offline_access`;

// const client_id = process.env.XERO_CLIENT_ID;
// const client_secret = process.env.XERO_CLIENT_SECRET;

const xero = new XeroClient({
  clientId: '8DB0A3AE9F13409B818BE0DAF4EE05F2',
  //   client_id,
  clientSecret: '9YYrYIUq7mrIq6-AsB46fruJQmlfy7AEUmvbSvuuWWhrGuMi',
  //   client_secret,
  redirectUris: ['http://localhost:4200/verify/xero'],
  //    [process.env.XERO_REDIRECT_URI],
  scopes: scopes.split(' '),
  state: 'returnPage=my-sweet-dashboard', // custom params (optional)
  httpTimeout: 1000000000, // ms (optional)
});

@Injectable()
export class XeroService {
  async XeroConnect() {
    const consetUrl = await xero.buildConsentUrl();

    return consetUrl;
  }

  async XeroCallback(data: unknown) {
    try {
      // const payload = `/integration/xero${data}`;
      // const tokenSet = await xero.apiCallback(payload);
      // const [tenant] = await xero.updateTenants(false);

      // const getIntegration = await getCustomRepository(
      //   IntegrationRepository,
      // ).find({
      //   where: {
      //     tenantId: tenant.tenantId,
      //     status: 1,
      //   },
      // });

      // let integration;
      // if (getIntegration.length === 0) {
      // const decodedIdToken = await jwtDecode(tokenSet.id_token);
      //   integration = await getCustomRepository(IntegrationRepository).save({
      //     name: 'xero',
      //     token: JSON.stringify(tokenSet),
      //     data: JSON.stringify(decodedIdToken),
      //     enabled: true,
      //     organizationId: userData.organizationId,
      //     tenantId: tenant.tenantId,
      //     createdById: userData.userId,
      //     updatedById: userData.userId,
      //     status: 1,
      //   });
      // }

      const modules = [
        'accounts',
        'transactions',
        'contacts',
        'items',
        'invoices',
        'bills',
        'payments',
        'creditnotes',
      ];
      return {
        // integration: integration ? integration : getIntegration[0],
        modules,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async ImportDataFromXero(data, req) {
    const tenant = xero.tenants[0];

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

    if (data.indexOf('accounts') >= 0) {
      const trailBalance = await xero.accountingApi.getReportTrialBalance(
        tenant.tenantId
      );

      const xeroAccounts = await xero.accountingApi.getAccounts(
        tenant.tenantId
      );

      const balances = [];
      if (
        Array.isArray(xeroAccounts.body.accounts) &&
        xeroAccounts.body.accounts.length > 0
      ) {
        const sections = trailBalance.body.reports[0].rows.filter(
          (item: any) => item.rowType === 'Section'
        );

        const arr = [];
        sections.forEach((i) => {
          return i.rows.forEach((j) => {
            const row = j.cells.filter((item) => {
              return item.value !== '';
            });
            arr.push(row);
          });
        });

        arr?.map((item) => {
          let obj = { name: '', balance: null, id: null };
          item?.forEach((feach) => {
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
          balances.push(obj);
        });
      }

      if (balances.length > 0 && xeroAccounts.body.accounts.length > 0) {
        await http.post(`accounts/account/sync`, {
          accounts: xeroAccounts.body.accounts,
          balances,
          type: Integrations.XERO,
        });
      }
    }

    if (data.indexOf('contacts') >= 0) {
      const xeroContacts = await xero.accountingApi.getContacts(
        tenant.tenantId
      );

      if (xeroContacts.body.contacts.length > 0) {
        await http.post(`contacts/contact/sync`, {
          contacts: xeroContacts.body.contacts,
          type: Integrations.XERO,
        });
      }
    }

    if (data.indexOf('items') >= 0) {
      const xeroItems = await xero.accountingApi.getItems(tenant.tenantId);

      if (xeroItems.body.items.length > 0) {
        await http.post(`items/item/sync`, {
          items: xeroItems.body.items,
          type: Integrations.XERO,
        });
      }
    }

    if (data.indexOf('invoices') >= 0) {
      console.log('fetching invoices data please wait...');

      const xeroInvoices = await xero.accountingApi.getInvoices(
        tenant.tenantId
      );

      const inv_arr = [];
      for (const i of xeroInvoices.body.invoices) {
        const inv = await xero.accountingApi.getInvoice(
          tenant.tenantId,
          i.invoiceID
        );
        const xeroInvoice = inv.body.invoices[0];
        inv_arr.push(xeroInvoice);
      }

      const xeroCreditNotes = await xero.accountingApi.getCreditNotes(
        tenant.tenantId
      );

      const cn_arr = [];
      for (const i of xeroCreditNotes.body.creditNotes) {
        const cn = await xero.accountingApi.getCreditNote(
          tenant.tenantId,
          i.creditNoteID
        );
        const creditNote = cn.body.creditNotes[0];
        cn_arr.push(creditNote);
      }

      const xeroPayments = await xero.accountingApi.getPayments(
        tenant.tenantId
      );

      await http.post(`invoices/invoice/sync`, {
        type: Integrations.XERO,
        invoices: inv_arr,
        credit_notes: cn_arr,
        payments: xeroPayments.body.payments,
      });
    }

    return true;
  }
}
