import axios from "axios";

export default axios.create({

     baseURL: process.env.RREACT_APP_ADMIN_BASE_URL + "/api/",
  
  headers: {
    "Content-type": "application/json"
  }
});