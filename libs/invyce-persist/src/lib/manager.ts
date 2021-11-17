enum IStorageType {
  LOCAL_STORAGE = 'localStorage',
  SESSION_STORAGE = 'sessionStorage',
  COOKIE = 'cookie',
}

export class PersistManager {
  key: string;
  data: any;
  storage:
    | IStorageType.SESSION_STORAGE
    | IStorageType.SESSION_STORAGE
    | IStorageType.COOKIE;
  expiresAt: string | null;

  constructor(key, data, storage, expiresAt) {
    this.key = key;
    this.data = data;
    this.storage = storage;
    this.expiresAt = expiresAt;
  }

  set(key?: string, data?: any, storage?: string, expiresAt?: string | null) {
    const _key = key || this?.key;
    const storageType = storage || this?.storage;
    const _data = data || this?.data;
    const jsonData = JSON.stringify(_data);

    switch (storageType) {
      case IStorageType.LOCAL_STORAGE:
        localStorage.setItem(_key, jsonData);
        break;
      case IStorageType.SESSION_STORAGE:
        sessionStorage.setItem(_key, jsonData);
        break;
      case IStorageType.COOKIE:
        // eslint-disable-next-line no-case-declarations
        const _expiresAt: string | null = this?.expiresAt || expiresAt;
        document.cookie = _expiresAt
          ? `${key}=${_data} expires=${_expiresAt}`
          : `${key}=${_data}`;
        break;

      default:
        localStorage.setItem(_key, jsonData);
        break;
    }
  }
  get(key?: string, storage?: string) {
    const _key = key || this?.key;
    const storageType = storage || this?.storage;

    switch (storageType) {
      case IStorageType.LOCAL_STORAGE:
        return JSON.parse(localStorage.getItem(_key));
      case IStorageType.SESSION_STORAGE:
        return JSON.parse(sessionStorage.getItem(_key));
      case IStorageType.COOKIE:
        // eslint-disable-next-line no-case-declarations
        const [data] = document.cookie?.split(';')?.filter((values) => {
          if (values?.includes(_key)) {
            return JSON.parse(values?.split('=')[1]);
          }
        });

        return data;
      default:
        return JSON.parse(localStorage.getItem(_key));
    }
  }

  resetData(
    key?: string,
    storage?: 'localStorage' | 'sessionStorage' | 'cookie'
  ) {
    const _key = key || this?.key;
    const storageType = storage || this?.storage;
    switch (storageType) {
      case IStorageType.LOCAL_STORAGE:
        localStorage?.removeItem(_key);
        break;
      case IStorageType.SESSION_STORAGE:
        sessionStorage?.removeItem(_key);
        break;
      case IStorageType.COOKIE:
        // eslint-disable-next-line no-case-declarations
        const expireDate = new Date(1995, 11, 17);
        document.cookie = `${key}=; expires = ${expireDate}`;
        break;
      default:
        return JSON.parse(localStorage.getItem(_key));
    }
  }
}
