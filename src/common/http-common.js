import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44328/api",
});

export const handleResponseError = (error) => {
  if (error !== undefined && error !== null) {
    if (error.response !== undefined && error.response !== null) {
      if ([401, 403].indexOf(error.response.status) !== -1) {
        const errorMsg = "Access Denied, Request Admin for Access";
        console.log("Denied!!!!")
        return errorMsg
      }
      else if (error.response.status === 304) {
        const errorMsg = "No change found in given data to update";
        return errorMsg;
      }
      else if (error.response.status === 500) {
        const errorMsg = "Internal Server Error, Contact Support";
        return errorMsg;
      }
    } else {
      const errorMsg = "Internal Server Error, Contact Support";
      return errorMsg;
    }
  }
};
