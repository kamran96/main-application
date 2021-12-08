// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoJS = require('crypto-js');

const EncriptData = (data) => {
  const encription = CryptoJS.AES.encrypt(JSON.stringify(data), `nothing`);
  return encription;
};

const DecriptionData = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, `nothing`);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
};

export { EncriptData, DecriptionData };
