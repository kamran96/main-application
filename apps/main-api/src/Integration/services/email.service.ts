import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { getCustomRepository } from 'typeorm';
import { IntegrationRepository } from '../../repositories';
import jwtDecode from 'jwt-decode';

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  'http://localhost:3000/verify/gmail'
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
];

google.options({
  auth: oauth2Client,
});

@Injectable()
export class EmailService {
  async GmailConnect() {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    return url;
  }

  async VerifyGmail(code, user) {
    const token = await oauth2Client.getToken(code);
    const decodeIdToken: any = jwtDecode(token.tokens.id_token);
    const [integration]: any = await getCustomRepository(
      IntegrationRepository
    ).find({
      where: {
        name: 'gmail',
        tenantId: decodeIdToken.sub,
      },
    });

    if (integration !== undefined) {
      oauth2Client.setCredentials(integration.token);
    } else {
      await getCustomRepository(IntegrationRepository).save({
        name: 'gmail',
        token: JSON.stringify(token.tokens),
        data: JSON.stringify(token),
        enabled: true,
        tenantId: decodeIdToken.sub,
        status: 1,
        organizationId: user.organizationId,
        createdById: user.userId,
        updatedById: user.userId,
      });

      oauth2Client.setCredentials(token.tokens);
    }

    const query = 'no-reply@invyce.com';
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
    });

    let message_arr = [];
    for (let i of response.data.messages) {
      const message = await gmail.users.messages.get({
        userId: 'me',
        id: i.id,
      });

      message_arr.push(message.data);
    }

    return message_arr;
  }
}
