import { BehaviorSubject, Observable } from 'rxjs';
import http from "../../common/http-common";
import FileDownload from 'js-file-download'

class TressPassNoticeService {

    constructor() {
        this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'))
    }

    Add = (model) => {
        return new Promise((resolve, reject) => {
            http.post("/TressPassNotices/save", model,
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.currentUserSubject.token,
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
        })
    }

    Edit = async (securityLogs) => {
        await http.post("/TressPassNotices/update", securityLogs,
            {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUserSubject.token,
                }
            })
            .then(response => {
                if (response.data !== null && response.data.token !== null) {
                }
            })
            .catch(function (error) {
                throw error
            });
    }

    Delete = async (obj) => {
        await http.post("/TressPassNotices/delete", obj,
            {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUserSubject.token,
                }
            })
            .then(response => {
                if (response.data !== null && response.data.token !== null) {
                }
            })
            .catch(function (error) {
                throw error
            });
    }

    GetAll(id) {
        var arg = id && id != "" ? "?id=" + id : "";
        return new Promise((resolve, reject) => {
            http.get("/TressPassNotices/getall" + arg,
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    }
                })
                .then(response => {
                    resolve(response.data)
                })
                .catch(function (error) {
                    throw error
                });
        })
    }

    GetClients() {
        return new Promise((resolve, reject) => {
            http.get("/users/clientlist",
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    }
                })
                .then(response => {
                    resolve(response.data)
                })
                .catch(function (error) {
                    throw error
                });
        })
    }

    UploadFile(formData) {
        return new Promise((resolve, reject) => {
            http.post('/GeneralOccurences/upload', formData, {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUserSubject.token,
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
        http.post("GeneralOccurences/download", { 'Name': data },
            {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUserSubject.token,
                },
                responseType: 'arraybuffer'

            }).then(response => {
                if (response.data != null) {
                    FileDownload(response.data, data);
                }
            }).catch(ex => {
            })
    }
    getReportFile() {
        return new Promise((resolve, reject) => {
            http.get("GeneralOccurences/getreport",
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    },
                    responseType: 'arraybuffer'

                }).then(response => {
                    if (response.data != null) {
                        resolve(response.data);
                    }
                }).catch(ex => {
                })
        })
    }
}

export default TressPassNoticeService;