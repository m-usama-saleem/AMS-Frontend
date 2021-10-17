import http, { handleResponseError } from "../../common/http-common";

class PayableService {

    constructor() {
        this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'))
    }

    Edit = (appointment) => {
        return new Promise((resolve, reject) => {
            http.post("/FinanceService/Edit", appointment,
                {
                    headers: {
                        // 'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    }
                })
                .then(response => {
                    if (response.data !== null && response.data.token !== null) {
                        resolve(response.data);
                    }
                })
                .catch(function (error) {
                    throw error
                });
        })
    }

    Approve = (payableId) => {
        return new Promise((resolve, reject) => {
            http.post("/FinanceService/Approve", { id: payableId },
                {
                    headers: {
                        // 'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    }
                })
                .then(response => {
                    if (response.data !== null && response.data !== undefined) {
                        resolve(response.data);
                    }
                })
                .catch((error) => {
                    reject(handleResponseError(error));
                });
        });
    }

    ApproveMultiplePayables = (list) => {
        return new Promise((resolve, reject) => {
            http.post("/FinanceService/MultipleApprove", list,
                {
                    headers: {
                        // 'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    }
                })
                .then(response => {
                    if (response.data !== null && response.data !== undefined) {
                        resolve(response.data);
                    }
                })
                .catch((error) => {
                    reject(handleResponseError(error));
                });
        });
    }

    GetAll() {
        return new Promise((resolve, reject) => {
            http.get("/FinanceService/GetAllPayables",
                {
                    headers: {

                    }
                })
                .then(response => {
                    resolve(response.data)
                })
                .catch(function (error) {
                    reject(handleResponseError(error))
                });
        })
    }

}

export default PayableService;