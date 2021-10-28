import http, { handleResponseError } from "../../common/http-common";

class ReportService {

    constructor() {
        this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'))
    }


    GetAppointmentStats() {
        return new Promise((resolve, reject) => {
            http.get("/appointmentService/GetAppointmentStats",
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

    GetCompletedPayableStats() {
        return new Promise((resolve, reject) => {
            http.get("/financeService/GetCompletedPayableStats",
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

    GetInCompletedPayableStats() {
        return new Promise((resolve, reject) => {
            http.get("/financeService/GetInCompletedPayableStats",
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
    GetCompletedReceivableStats() {
        return new Promise((resolve, reject) => {
            http.get("/financeService/GetCompletedReceivableStats",
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

    GetInCompletedReceivableStats() {
        return new Promise((resolve, reject) => {
            http.get("/financeService/GetInCompletedReceivableStats",
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

export default ReportService;