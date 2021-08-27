import axios from "axios";
import { DecriptionData } from "./encription";

let localIP = `http://192.168.1.8`;
let RailsBaseURL = "";
let NodeBaseURL = ``;
let cancelToken = axios.CancelToken;

export let CancelRequest: any;

const host = window.location.hostname;

if (host && host === "app.invyce.com") {
  // set online server endpoints

  RailsBaseURL = `https://api.rails.invyce.com/`;
  NodeBaseURL = `https://api.node.invyce.com/`;
} else if (host && host === "dev.app.invyce.com") {
  // Staging server endpoints

  RailsBaseURL = `https://dev.api.rails.invyce.com/`;
  NodeBaseURL = `https://dev.api.node.invyce.com/`;
} else {
  // local development
  RailsBaseURL = localIP + ":4000";
  NodeBaseURL = localIP + ":8081";
}

const http = axios.create({
  baseURL: NodeBaseURL,
  cancelToken: new cancelToken(function executor(c) {
    CancelRequest = c;
  }),
});

export const railsHttp = axios.create({
  baseURL: RailsBaseURL,
  cancelToken: new cancelToken(function executor(c) {
    CancelRequest = c;
  }),
  headers: {
    "Content-type": "application/json",
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

export const encriptionData = localStorage.getItem("auth");
let access_token = encriptionData
  ? DecriptionData(encriptionData).access_token
  : false;

export const updateToken = (token: String) => {
  http.defaults.headers.common.Authorization = `Bearer ${token}`;
  railsHttp.defaults.headers.common.Authorization = `Bearer ${token}`;
};

if (access_token) {
  updateToken(access_token);
}

export { NodeBaseURL, RailsBaseURL };
export default http || railsHttp;
