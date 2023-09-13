/**
 * 
import Axios from "axios";
let token = localStorage.getItem("accessToken") || "";

const axios = Axios.create({
  // baseURL: `https://api-lazma.b2gsoft.xyz/api/v1`, // testing

  baseURL:
    process.env.NODE_ENV === "development"
      ? `http://localhost:3680/api/v1`
      : `https://api-lazma.b2gsoft.xyz/api/v1`, // testing

  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default axios;

*/

import Axios from "axios";
let token = localStorage.getItem("accessToken") || "";

const axios = Axios.create({
  // baseURL: `https://apii.lazma.com/api/v1`, // testing

  baseURL:
    process.env.NODE_ENV === "development"
      ? `http://192.168.0.242:4311/api/v1`
      : `http://192.168.0.242:4311/api/v1`, // testing

  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default axios;
