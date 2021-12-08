import CryptoJS from 'crypto-js';
import en from '../../../../../node_modules/world_countries_lists/data/en/world.json';

export const EncriptData = (data: any | string) => {
  const encription = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    `${process.env.REACT_APP_ENCRIPTION_KEY}`
  );
  return encription;
};

export const DecriptionData = (data: any) => {
  console.log(process.env.REACT_APP_ENCRIPTION_KEY, 'what is key');
  const bytes = CryptoJS.AES.decrypt(
    data,
    `${process.env.REACT_APP_ENCRIPTION_KEY}`
  );
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
};

export const getCountryById = (id: number) => {
  const [filtered] = en?.filter((i) => i.id === id);

  return filtered as {
    name: string;
    id: number;
    alpha2: string;
    alpha3: string;
  };
};

export default { EncriptData, DecriptionData };
