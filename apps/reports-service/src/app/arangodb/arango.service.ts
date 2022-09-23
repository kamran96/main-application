import arangojs, { Database } from 'arangojs';
import { ARANGO_DB_CONNECTION } from '@invyce/global-constants';

// console.log(ARANGO_DB_CONNECTION(), 'arango data');
// export const DB = new Database(ARANGO_DB_CONNECTION());

export const Arango = async () => {
  const { host, databaseName, username, password } = ARANGO_DB_CONNECTION();

  const db = arangojs({
    url: host,
  });

  await db.useBasicAuth(username, password);
  const dbs = await db.listDatabases();

  if (!dbs.includes(databaseName)) {
    return await db.createDatabase(databaseName);
  } else {
    return new Database({
      url: host,
      auth: {
        username,
        password,
      },
      databaseName,
      agentOptions: {
        // highly risky will remove this later for production mode
        rejectUnauthorized: false,
      },
    });
  }
};
