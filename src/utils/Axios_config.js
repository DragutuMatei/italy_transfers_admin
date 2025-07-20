import axios from "axios";
const AXIOS = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

export default AXIOS;
