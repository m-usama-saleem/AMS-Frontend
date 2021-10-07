import http, { handleResponseError } from "../../common/http-common";
import FileDownload from 'js-file-download'

class AppointmentService {

    constructor() {
        this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'))
    }

    Add = (appointment) => {
        return new Promise((resolve, reject) => {
            http.post("/AppointmentService/CreateAppointment", appointment,
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

    Edit = (appointment) => {
        return new Promise((resolve, reject) => {
            http.post("/AppointmentService/EditAppointment", appointment,
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

    Delete = (appId) => {
        return new Promise((resolve, reject) => {
            http.post("/AppointmentService/DeleteAppointment", { id: appId },
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

    UploadFile(formData) {
        return new Promise((resolve, reject) => {
            http.post('/appointmentService/upload', formData, {
                headers: {
                    // 'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    if (response.data !== null) {
                        resolve(response.data)
                    }
                })
                .catch(function (error) {
                    throw error
                });
        });
    }
    downloadFile(data) {
        http.post("appointmentService/download", { 'Name': data },
            {
                headers: {
                    // 'Authorization': 'Bearer ' + this.currentUserSubject.token,
                },
                responseType: 'arraybuffer'

            }).then(response => {
                if (response.data != null) {
                    FileDownload(response.data, data);
                }
            }).catch(ex => {
            })
    }
}

export default AppointmentService;