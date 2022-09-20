import { Database } from 'arangojs';
import { ARANGO_DB_CONNECTION } from '@invyce/global-constants';

console.log(ARANGO_DB_CONNECTION(), 'arango data');
export const DB = new Database(ARANGO_DB_CONNECTION());
