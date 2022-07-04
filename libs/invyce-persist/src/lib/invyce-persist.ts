import { PersistManager } from './manager';

export function invycePersist(
  key?: string,
  data?: any,
  storage: 'localStorage' | 'sessionStorage' | 'cookie' = 'localStorage',
  expiresAt?: string | any
) {
  const _ = new PersistManager(key, data, storage, expiresAt);

  return _;
}
