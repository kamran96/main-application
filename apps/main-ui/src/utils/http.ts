import axios from 'axios';
import { DecriptionData } from './encription';

const localIP = `http://192.168.6.235/`;
let RailsBaseURL = '';
let NodeBaseURL = ``;
const cancelSource = axios.CancelToken.source();

const host = window.location.hostname;

if (host && host === 'app.invyce.com') {
  // set online server endpoints

  RailsBaseURL = `https://api.rails.invyce.com/`;
  NodeBaseURL = `https://api.node.invyce.com/`;
} else if (host && host === 'dev.app.invyce.com') {
  // Staging server endpoints

  RailsBaseURL = `https://dev.api.rails.invyce.com/`;
  NodeBaseURL = `https://dev.api.node.invyce.com/`;
} else {
  // local development
  RailsBaseURL = localIP; // + ":3000"
  NodeBaseURL = localIP; //+ ":8081"
}

const http = axios.create({
  baseURL: NodeBaseURL,
  withCredentials: true,
  cancelToken: cancelSource.token,
});

export const railsHttp = axios.create({
  baseURL: RailsBaseURL,
  cancelToken: cancelSource.token,
  headers: {
    'Content-type': 'application/json',
  },
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
  railsHttp.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const CancelRequest = () => {
  cancelSource.cancel();
};

if (access_token) {
  updateToken(access_token);
}

export { NodeBaseURL, RailsBaseURL };
export default http || railsHttp;
