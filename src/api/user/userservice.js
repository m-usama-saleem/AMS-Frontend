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
            'Authorization': 'Bearer ' +  this.currentUserSubject.token,
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
            'Authorization': 'Bearer ' +  this.currentUserSubject.token,
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
            'Authorization': 'Bearer ' +  this.currentUserSubject.token,
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

  EmployeeList = () => {
    return new Promise((resolve, reject) => {
      http.get("/users/employeelist",
        {
          headers: {
            'Authorization': 'Bearer ' +  this.currentUserSubject.token,
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
      http.get("/users/clientlist",
        {
          headers: {
            'Authorization': 'Bearer ' +  this.currentUserSubject.token,
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
        'Authorization': 'Bearer ' +  this.currentUserSubject.token,
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
            'Authorization': 'Bearer ' +  this.currentUserSubject.token,
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
