import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';
const bigquery = new BigQuery({
  keyFilename: 'invyce-testing-3605e8f26be0.json',
  projectId: 'invyce-testing',
});

@Injectable()
export class UserService {
  async CreateUser(data) {
    const datasetId = 'reports';
    const [dataset] = await bigquery.dataset(datasetId).get();

    if (!dataset) {
      await bigquery.createDataset(datasetId);
    }

    const [table] = await bigquery.dataset(datasetId).getTables();
    const mapTableName = table.map((t) => t.id);

    if (!mapTableName.includes('users')) {
      const schema = [
        { name: 'id', type: 'STRING', mode: 'REQUIRED' },
        { name: 'username', type: 'STRING' },
        { name: 'email', type: 'STRING' },
        { name: 'password', type: 'STRING' },
        { name: 'organizationId', type: 'STRING' },
        { name: 'branchId', type: 'STRING' },
        { name: 'roleId', type: 'STRING' },
        { name: 'status', type: 'STRING' },
        { name: 'theme', type: 'STRING' },
        { name: 'isVerified', type: 'STRING' },
        { name: 'createdAt', type: 'TIMESTAMP' },
        { name: 'updatedAt', type: 'TIMESTAMP' },
        {
          name: 'profile',
          type: 'RECORD',
          fields: [
            { name: 'fullName', mode: 'NULLABLE', type: 'STRING' },
            { name: 'country', mode: 'NULLABLE', type: 'STRING' },
            { name: 'phoneNumber', mode: 'NULLABLE', type: 'STRING' },
            { name: 'attachmentId', mode: 'NULLABLE', type: 'STRING' },
            { name: 'bio', mode: 'NULLABLE', type: 'STRING' },
            { name: 'cnic', mode: 'NULLABLE', type: 'STRING' },
            { name: 'jobTitle', mode: 'NULLABLE', type: 'STRING' },
            { name: 'location', mode: 'NULLABLE', type: 'STRING' },
            { name: 'prefix', mode: 'NULLABLE', type: 'STRING' },
            { name: 'website', mode: 'NULLABLE', type: 'STRING' },
          ],
        },
      ];

      const options = {
        schema: schema,
      };

      const [table] = await bigquery
        .dataset(datasetId)
        .createTable('users', options);

      console.log(`Table ${table.id} created.`);
    }

    if (data) {
      const rows = {
        id: data.id,
        username: data.username,
        email: data.email,
        password: data.password,
        organizationId: data.organizationId,
        branchId: data.branchId,
        roleId: data.roleId,
        theme: data.theme,
        isVerified: data.isVerified,
        status: 1,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        profile: data.profile,
      };

      await bigquery.dataset(datasetId).table('users').insert(rows);
    }
  }

  async CreateOrganization(data) {
    const datasetId = 'reports';

    const [table] = await bigquery.dataset(datasetId).getTables();
    const mapTableName = table.map((t) => t.id);

    if (!mapTableName.includes('organizations')) {
      const schema = [
        { name: 'id', type: 'STRING', mode: 'REQUIRED' },
        { name: 'name', type: 'STRING' },
        { name: 'organzationType', type: 'STRING' },
        { name: 'financialEnding', type: 'STRING' },
        { name: 'email', type: 'STRING' },
        { name: 'createdById', type: 'STRING' },
        { name: 'updatedById', type: 'STRING' },
        { name: 'status', type: 'STRING' },
        { name: 'faxNumber', type: 'STRING' },
        { name: 'niche', type: 'STRING' },
        { name: 'phoneNumber', type: 'STRING' },
        { name: 'prefix', type: 'STRING' },
        { name: 'website', type: 'STRING' },
        { name: 'createdAt', type: 'TIMESTAMP' },
        { name: 'updatedAt', type: 'TIMESTAMP' },
        {
          name: 'address',
          type: 'RECORD',
          fields: [
            { name: 'description', mode: 'NULLABLE', type: 'STRING' },
            { name: 'city', mode: 'NULLABLE', type: 'STRING' },
            { name: 'country', mode: 'NULLABLE', type: 'STRING' },
            { name: 'postalCode', mode: 'NULLABLE', type: 'STRING' },
          ],
        },
      ];

      const options = {
        schema: schema,
      };

      const [table] = await bigquery
        .dataset(datasetId)
        .createTable('organizations', options);

      console.log(`Table ${table.id} created.`);
    }

    if (data) {
      const rows = {
        id: data.id,
        name: data.name,
        email: data.email,
        niche: data.niche,
        organzationType: data.organzationType,
        financialEnding: data.financialEnding,
        website: data.website,
        prefix: data.prefix,
        phoneNumber: data.phoneNumber,
        status: data.status,
        faxNumber: data.faxNumber,
        createdById: data.createdById,
        updatedById: data.updatedById,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        address: data.address,
      };

      const dataset = bigquery.dataset(datasetId);
      await dataset.table('organizations').insert(rows);

      const query = `UPDATE reports.users
      SET organizationId = '${data.id}', branchId = '${data.branchId}'
      WHERE id = '${data.userId}'`;

      await dataset.query(query);
    }
  }
}
