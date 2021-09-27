import CryptoJS from "crypto-js";

export const EncriptData = (data: any | string) => {
  let encription = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    `${process.env.REACT_APP_ENCRIPTION_KEY}`
  );
  return encription;
};

export const DecriptionData = (data:any) => {

  console.log(process.env.REACT_APP_ENCRIPTION_KEY, "what is key")
  let bytes = CryptoJS.AES.decrypt(
    data,
    `${process.env.REACT_APP_ENCRIPTION_KEY}`
  );
  let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
};

export default { EncriptData, DecriptionData };