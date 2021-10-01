import { BehaviorSubject, Observable } from 'rxjs';
import http from "../../common/http-common";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

class AuthenticationService {

  constructor() {
    this.onAuthStateChange = currentUserSubject.asObservable();
  }

  login = async (UserName, Password) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: { UserName: UserName, Password: Password }
    };
    await http.post("/UserService/Login", { UserName: UserName, Password: Password },
      {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then(response => {
        console.log(response.data)
        if (response.data !== null) {
          //{success: true, message: 'OK'}
          var respMsg = JSON.parse(JSON.stringify(response.data));
          if (respMsg.success == true) {
            localStorage.setItem('currentUser', JSON.stringify(respMsg.user));
            currentUserSubject.next(respMsg.user);
          }
          else {
            // localStorage.setItem('currentUser', JSON.stringify({}));
            // currentUserSubject.next({});
            var error = {};
            error.message = respMsg.message;
            throw error;
          }
        }
      })
      .catch(function (error) {
        if (error !== undefined && error !== null) {
          if (error.response !== undefined && error.response !== null) {
            if ([401, 403].indexOf(error.response.status) !== -1) {
              error.message = "username or password is incorrect";
              throw error;
              // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
              //AuthenticationService.logout();
              //location.reload(true);
            }
          }
        }
        throw error;
      });
  }

  logout = () => {
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
  }

  currentUserValue = () => { return currentUserSubject.value }

  onAuthUserListener = (next, fallback) => {
    this.onAuthStateChange.subscribe((authUser) => {
      if (authUser) {
        next(authUser);
      }
      else {
        fallback();
      }
    });
  }
}

export default AuthenticationService;