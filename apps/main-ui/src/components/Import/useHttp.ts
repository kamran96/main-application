import axios from 'axios';
import { DecriptionData } from '../../utils/encription';

export const useHttp = () => {
  const encriptionData = localStorage.getItem('auth');
  const access_token = encriptionData
    ? DecriptionData(encriptionData).access_token
    : false;

  const localIP = `http://192.168.6.109`;
  let NodeBaseURL = ``;
  const host = window.location.hostname;

  if (host && host === 'app.invyce.com') {
    // set online server endpoints

    NodeBaseURL = `https://api.node.invyce.com/`;
  } else if (host && host === 'dev.app.invyce.com') {
    // Staging server endpoints

    NodeBaseURL = `https://dev.api.node.invyce.com/`;
  } else {
    // local development
    NodeBaseURL = localIP + ':8081';
  }

  const http = axios.create({
    baseURL: NodeBaseURL,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  });

  return {
    http,
  };
};
