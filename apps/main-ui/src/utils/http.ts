import axios from 'axios';
import { DecriptionData } from './encription';

const localIP = `https://localhost`;
// const localIP = `https://staging.invyce.com`;

let NodeBaseURL = ``;
const cancelSource = axios.CancelToken.source();

const host = window.location.hostname;


if (host && host === 'cloud.invyce.com') {
  // set online server endpoints

  NodeBaseURL = `https://api.cloud.invyce.com`;
} else if (host && host !== 'staging.invyce.com') {
  // Staging server endpoints

  NodeBaseURL = `https://api.staging.invyce.com`;
} else {
  // local development
  NodeBaseURL = localIP; //+ ":8081"
}

const http = axios.create({
  baseURL: NodeBaseURL,
  withCredentials: true,
  cancelToken: cancelSource.token,
});

// const requestHandler = res => {
//   if (
//     res.headers["content-type"] &&
//     res.headers["content-type"].includes("spreadsheet")
//   ) {
//     saveAs(res.data, "filenamed.xlsx");
//   }
//   return res;
// };

// http.interceptors.response.use(res => requestHandler(res));

export const encriptionData = localStorage.getItem('auth');
const access_token = encriptionData
  ? DecriptionData(encriptionData).access_token
  : false;

export const updateToken = (token: string) => {
  http.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const CancelRequest = () => {
  cancelSource.cancel();
};

if (access_token) {
  updateToken(access_token);
}

export { NodeBaseURL };
export default http;
