import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import AuthUserContext from './context';
//import UserService  from '../../api/user';
import  AuthenticationService from '../../api/user';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    constructor(props){
      super(props);
      this.AuthenticationService = new AuthenticationService();
    }

    componentDidMount() {
      this.listener = this.AuthenticationService.onAuthUserListener(
        authUser => {
          if (!condition(authUser)) {
            this.AuthenticationService.logout();
            this.props.history.push(ROUTES.SIGN_IN);
          }          
        },
        () => this.props.history.push(ROUTES.SIGN_IN),
      );
    }

    // componentWillUnmount() {
    //   this.listener();
    // }
    render() {
      return (
        <AuthUserContext.Consumer>
        {authUser =>
          condition(authUser) ? <Component {...this.props} /> : null
        }
      </AuthUserContext.Consumer>
      );
    }
  }
  return compose(
    withRouter
  )(WithAuthorization);
};
export default withAuthorization;