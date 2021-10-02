import http from "../../common/http-common";
import { handleResponseError } from "../../common/http-common";
import { BehaviorSubject, Observable } from 'rxjs';

export default class UserService {
  constructor() {
    this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
  }

  Register = (user) => {
    return new Promise((resolve, reject) => {
      http.post("/users/register", user,
        {
          headers: {
            'Authorization': 'Bearer ' + this.currentUserSubject.token,
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

  ListUserId = () => {
    return new Promise((resolve, reject) => {
      http.get("/users/list",
        {
          headers: {
            'Authorization': 'Bearer ' + this.currentUserSubject.token,
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

  ClientList = () => {
    return new Promise((resolve, reject) => {
      http.get("/users/list",
        {
          headers: {
            'Authorization': 'Bearer ' + this.currentUserSubject.token,
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

  TranslatorList = () => {
    return new Promise((resolve, reject) => {
      http.get("/TranslatorService/GetAll",
        {
          headers: {
            'Authorization': 'Bearer ' + this.currentUserSubject.token,
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

  InstitutionList = () => {
    return new Promise((resolve, reject) => {
      http.get("/InstitutionService/GetAll",
        {
          headers: {
            'Authorization': 'Bearer ' + this.currentUserSubject.token,
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
  IsUserExists = async (userId) => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      params: {
        userId: userId
      }
    };
    return new Promise((resolve, reject) => {
      http.get("/users/isuserexists", requestOptions)
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

  DeleteUser = async (userId) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.currentUserSubject.token,
        'Content-Type': 'application/json'
      },
      params: {
        userId: userId
      }
    };
    return new Promise((resolve, reject) => {
      http.get("/users/deleteuser", requestOptions)
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

  ChangePassword = async (user) => {
    return new Promise((resolve, reject) => {
      http.post("/users/changepassword", user,
        {
          headers: {
            'Authorization': 'Bearer ' + this.currentUserSubject.token,
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

  AppUserList = () => {
    return new Promise((resolve, reject) => {
      http.get("/UserService/GetAll",
        {
          headers: {
            'Authorization': 'Bearer ' + this.currentUserSubject.token,
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
  AddAppUser = (user) => {
    return new Promise((resolve, reject) => {
      http.post("/UserService/CreateUser", user,
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
  EditAppUser = (user) => {
    return new Promise((resolve, reject) => {
      http.post("/UserService/EditUser", user,
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
  DeleteAppUser = (user) => {
    return new Promise((resolve, reject) => {
      http.post("/UserService/DeleteUser", { id: user },
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

  AddTranslator = (user) => {
    return new Promise((resolve, reject) => {
      http.post("/TranslatorService/CreateTranslator", user,
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
  EditTranslator = (user) => {
    return new Promise((resolve, reject) => {
      http.post("/TranslatorService/EditTranslator", user,
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
  DeleteTranslator = (user) => {
    return new Promise((resolve, reject) => {
      http.post("/TranslatorService/DeleteTranslator", { id: user },
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


  AddInstitution = (user) => {
    return new Promise((resolve, reject) => {
      http.post("/InstitutionService/CreateInstitution", user,
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
  EditInstitution = (user) => {
    return new Promise((resolve, reject) => {
      http.post("/InstitutionService/EditInstitution", user,
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
  DeleteInstitution = (user) => {
    return new Promise((resolve, reject) => {
      http.post("/InstitutionService/DeleteInstitution", { id: user },
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
}
