const CryptoJS = require('crypto-js');


const EncriptData = (data) => {
  let encription = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    `nothing`
  );
  return encription;
};

const DecriptionData = (data) => {

  console.log(process.env.REACT_APP_ENCRIPTION_KEY, "what is key")
  let bytes = CryptoJS.AES.decrypt(
    data,
    `nothing`
  );
  let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
};

export { EncriptData, DecriptionData };
