import http, { handleResponseError } from "../../common/http-common";

class AppointmentService {

    constructor() {
        this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'))
    }

    // Add = async (securityLogs) => {
    //     await http.post("/securitylogs/save", securityLogs,
    //         {
    //             headers: {
    //                 'Authorization': 'Bearer ' + this.currentUserSubject.token,
    //             }
    //         })
    //         .then(response => {
    //             if (response.data !== null && response.data.token !== null) {
    //             }
    //         })
    //         .catch(function (error) {
    //             throw error
    //         });
    // }

    // Edit = async (securityLogs) => {
    //     await http.post("/securitylogs/update", securityLogs,
    //         {
    //             headers: {
    //                 'Authorization': 'Bearer ' + this.currentUserSubject.token,
    //             }
    //         })
    //         .then(response => {
    //             if (response.data !== null && response.data.token !== null) {
    //             }
    //         })
    //         .catch(function (error) {
    //             throw error
    //         });
    // }

    // Delete = async (obj) => {
    //     await http.post("/securitylogs/delete", obj,
    //         {
    //             headers: {
    //                 'Authorization': 'Bearer ' + this.currentUserSubject.token,
    //             }
    //         })
    //         .then(response => {
    //             if (response.data !== null && response.data.token !== null) {
    //             }
    //         })
    //         .catch(function (error) {
    //             throw error
    //         });
    // }

    GetAll() {
        return new Promise((resolve, reject) => {
            http.get("/appointmentService/getall",
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

    GetInstitutions() {
        return new Promise((resolve, reject) => {
            http.get("/commonService/GetInstitutions",
                {
                    headers: {
                    }
                })
                .then(response => {
                    var list = [];
                    if (response.data.length > 0) {
                        response.data.forEach(x => {
                            list.push({ label: x.name, value: x.id })
                        })
                    }
                    resolve(list);
                })
                .catch(function (error) {
                    throw error
                });
        })
    }
    GetTranslators() {
        return new Promise((resolve, reject) => {
            http.get("/commonService/GetTranslators",
                {
                    headers: {
                    }
                })
                .then(response => {
                    var list = [];
                    if (response.data.length > 0) {
                        response.data.forEach(x => {
                            list.push({ label: x.name, value: x.id })
                        })
                    }
                    resolve(list);
                })
                .catch(function (error) {
                    throw error
                });
        })
    }
}

export default AppointmentService;