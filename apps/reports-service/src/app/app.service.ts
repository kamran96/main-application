import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';
const bigquery = new BigQuery({
  keyFilename: 'invyce-testing-3605e8f26be0.json',
  projectId: 'invyce-testing',
});

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to reports-service!' };
  }

  async CreateContact(data) {
    const payload = {
      // contactId: data._id,
      // name: data.name,
      // email: data.email,
      // cnic: data.cnic,
      // contactType: data.contactType,
      // businessName: data.businessName,
      // organizationId: data.organizationId,
      // branchId: data.branchId,
      // createdById: data.createdById,
      // updatedById: data.createdById,
      // status: data.status,
      // createdAt: data.createdAt,
      // updatedAt: data.updatedAt,
      // addresses: ['add', 'adfa'],
      title: 'test title',
      // values: [
      //   { name: 'test1', description: 'test desc1' },
      //   { name: 'test2', description: 'test desc2' },
      // ],
    };

    await bigquery.dataset('reports').table('test').insert(payload);
  }
}
