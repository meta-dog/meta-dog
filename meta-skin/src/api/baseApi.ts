import axios, { Method } from "axios";


axios.defaults.baseURL = "https://meta-dog.onrender.com/api/";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common.Accept = "application/json";

export default async function apiCall(method: Method, url: string) {
  return axios.request({ method, url });
}