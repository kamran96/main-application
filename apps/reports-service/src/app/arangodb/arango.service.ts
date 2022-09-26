import { arangojs, Database } from 'arangojs';
import { ARANGO_DB_CONNECTION } from '@invyce/global-constants';

// console.log(ARANGO_DB_CONNECTION(), 'arango data');
// export const DB = new Database(ARANGO_DB_CONNECTION());

export const Arango = async () => {
  const { host, databaseName, username, password } = ARANGO_DB_CONNECTION();

  const db = arangojs({
    url: host,
    // highly risky will remove this later for production mode
    agentOptions: {
      rejectUnauthorized: false,
    },
  });

  await db.useBasicAuth(username, password);
  const dbs = await db.listDatabases();

  if (!dbs.includes(databaseName)) {
    await db.createDatabase(databaseName, [{ username: 'root' }]);
  }
  return new Database({
    url: host,
    databaseName,
    auth: {
      username,
      password,
    },
  });
};
