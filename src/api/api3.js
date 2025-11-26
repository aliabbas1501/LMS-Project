// api3.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://691342b9f34a2ff1170b4eca.mockapi.io", // <- your MockAPI base url
  timeout: 8000,
});

export default api;
