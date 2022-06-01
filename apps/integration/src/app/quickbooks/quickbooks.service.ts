import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as OAuthClient from 'intuit-oauth';
import axios from 'axios';
import { IRequest } from '@invyce/interfaces';
import { Integrations } from '@invyce/global-constants';

const oauthClient = new OAuthClient({
  clientId: 'AB1KBgEm89GDkRABX31aNcTdNadA0ri9Gtx6yOPkNn3hez4fgF',
  clientSecret: 'HTkO9v7liZEk7F2Onpffy9G6trDvhmIrWSrZvuGv',
  environment: 'sandbox',
  redirectUri: ['http://localhost:4200/verify/quickbooks'],
});

@Injectable()
export class QuickbooksService {
  async QuickbooksConnect() {
    const authUri = await oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.openid],
      state: 'testState',
    });
    return authUri;
  }

  async QuickbooksVerify(token) {
    try {
      const query = `verify/quickbooks${token}`;
      await oauthClient.createToken(query);

      //   const getIntegration = await getCustomRepository(
      //     IntegrationRepository,
      //   ).find({
      //     where: {
      //       tenantId: quickbookData.token.realmId,
      //       status: 1,
      //     },
      //   });

      //   let integration;
      //   if (getIntegration.length === 0) {
      //     integration = await getCustomRepository(IntegrationRepository).save({
      //       name: 'quickbooks',
      //       token: JSON.stringify(quickbookData.token),
      //       data: JSON.stringify(quickbookData),
      //       enabled: true,
      //       organizationId: userData.organizationId,
      //       tenantId: quickbookData.token.realmId,
      //       createdById: userData.userId,
      //       updatedById: userData.userId,
      //       status: 1,
      //     });
      //   }

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
        // integration: integration ? integration : getIntegration,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async GetQuickbooksData(req: IRequest, data) {
    const realmId = oauthClient.token.realmId;
    const refresh_data = await oauthClient.refresh();
    const access_token = refresh_data.token.access_token;
    const apiUri = 'https://sandbox-quickbooks.api.intuit.com/v3/company/'; //process.env.API_URI;
    let url = apiUri + realmId + '/query?query=';
    const request = {
      url: '',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
        Accept: 'application/json',
      },
    };

    // let token;
    // if (process.env.NODE_ENV === 'development') {
    //   const header = req.headers?.authorization?.split(' ')[1];
    //   token = header;
    // } else {
    //   if (!req || !req.cookies) return null;
    //   token = req.cookies['access_token'];
    // }

    // const type =
    //   process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
    // const value =
    //   process.env.NODE_ENV === 'development'
    //     ? `Bearer ${token}`
    //     : `access_token=${token}`;

    if (!req || !req.cookies) return null;
    const token = req?.cookies['access_token'];

    const http = axios.create({
      baseURL: 'https://localhost',
      headers: {
        cookie: `access_token=${token}`,
      },
    });

    if (data.indexOf('accounts') >= 0) {
      url = url += 'select * from Account';
      request.url = url;

      const { data: qboAccounts } = await axios(request as unknown);
      if (qboAccounts?.QueryResponse?.Account?.length > 0) {
        await http.post(`accounts/account/sync`, {
          accounts: qboAccounts.QueryResponse.Account,
          type: Integrations.QUICK_BOOK,
        });
      }
    }

    if (data.indexOf('contacts') >= 0) {
      const customerUrl = url + 'select * from Customer';
      const vendorUrl = url + 'select * from Vendor';

      const customerRequest = { ...request };
      const vendorRequest = { ...request };
      customerRequest.url = customerUrl;
      vendorRequest.url = vendorUrl;

      const { data: qbCustomers } = await axios(customerRequest as unknown);
      const { data: qbVendors } = await axios(vendorRequest as unknown);

      if (
        qbCustomers?.QueryResponse?.Customer?.length > 0 &&
        qbVendors?.QueryResponse.Vendor?.length > 0
      ) {
        await http.post('contacts/contact/sync', {
          contacts: {
            customers: qbCustomers.QueryResponse.Customer,
            vendors: qbVendors.QueryResponse.Vendor,
          },
          type: Integrations.QUICK_BOOK,
        });
      }
    }

    if (data.indexOf('items') >= 0) {
      url = url += 'select * from Item';
      request.url = url;

      const { data: qbItems } = await axios(request as unknown);

      if (qbItems?.QueryResponse?.Item?.length > 0) {
        await http.post('items/item/sync', {
          items: qbItems.QueryResponse.Item,
          type: Integrations.QUICK_BOOK,
        });
      }
    }

    if (data.indexOf('invoices') >= 0) {
      url = url += 'select * from Invoice';
      request.url = url;

      const { data: qbInvoices } = await axios(request as unknown);

      if (qbInvoices?.QueryResponse?.Invoice?.length > 0) {
        await http.post('invoices/invoice/sync', {
          type: Integrations.QUICK_BOOK,
          invoices: qbInvoices.QueryResponse.Invoice,
        });
      }
    }

    return true;
  }
}
