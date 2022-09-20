import { Database } from 'arangojs';
import { ARANGO_DB_CONNECTION } from '@invyce/global-constants';

export const DB = new Database(ARANGO_DB_CONNECTION());
