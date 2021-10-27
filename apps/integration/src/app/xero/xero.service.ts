import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { XeroClient } from 'xero-node';
import * as jwtDecode from 'jwt-decode';

const scopes = `openid profile email accounting.transactions accounting.reports.read accounting.settings accounting.contacts offline_access`;

const client_id = process.env.XERO_CLIENT_ID;
const client_secret = process.env.XERO_CLIENT_SECRET;

const xero = new XeroClient({
  clientId: '715C12BC94124671B60DD50FEC9D3DAB',
  //   client_id,
  clientSecret: '8jQ0m3uH8mHdXfigUYIlMNff0z98uYtnpEuaP5hHu-IUHp7N',
  //   client_secret,
  redirectUris: ['http://localhost/4200/callback'],
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

  async XeroCallback(data, userData) {
    try {
      const payload = `/verify/xero${data}`;
      const tokenSet = await xero.apiCallback(payload);
      const [tenant] = await xero.updateTenants(false);

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

  async ImportDataFromXero(data, user) {
    const tenant = xero.tenants[0];

    if (data.indexOf('contacts') >= 0) {
      const xeroContacts = await xero.accountingApi.getContacts(
        tenant.tenantId
      );

      console.log(xeroContacts.body.contacts, 'contacts here');
      const contactIds = xeroContacts.body.contacts.map((ids) => ids.contactID);

      for (let i of xeroContacts?.body?.contacts) {
      }
    }

    return true;
  }
}
