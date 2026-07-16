// import axios from "axios";

// api antiga
// export const api = axios.create({
//   baseURL: "https://evolution.bigdates.com.br:3620",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

import axios from "axios";

export const api = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3720",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
