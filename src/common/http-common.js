import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44328/api",
});

export const handleResponseError = (error) => {
  if (error !== undefined && error !== null) {
    if (error.response !== undefined && error.response !== null) {
      if ([401, 403].indexOf(error.response.status) !== -1) {
        const errorMsg = "Zugriff verweigert, Admin für Zugriff anfordern";
        return errorMsg
      }
      else if (error.response.status === 304) {
        const errorMsg = "Keine Änderung in den gegebenen Daten zur Aktualisierung gefunden";
        return errorMsg;
      }
      else if (error.response.status === 500) {
        const errorMsg = "Interner Serverfehler, Support kontaktieren";
        return errorMsg;
      }
    } else {
      const errorMsg = "Interner Serverfehler, Support kontaktieren";
      return errorMsg;
    }
  }
};
