import { Database } from 'arangojs';

export const DB = new Database({
  url: 'http://127.0.0.1:8529',
  auth: { username: 'root', password: 'asdf' },
});
