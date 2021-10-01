import React from 'react';
import AuthUserContext from './context';
import  AuthenticationService from '../../api/user';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          authUser: JSON.parse(localStorage.getItem('currentUser')),
        };
        this.AuthenticationService = new AuthenticationService();
    }

    componentDidMount() {
      this.listener = this.AuthenticationService.onAuthUserListener(
        authUser => {
          localStorage.setItem('currentUser', JSON.stringify(authUser));
          this.setState({ authUser: authUser });
        },
        () => {
          localStorage.removeItem('currentUser');
          this.setState({ authUser: null });
        },
      );
    }

    // componentWillUnmount() {
    //     this.listener();
    // }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
  return WithAuthentication;
};
export default withAuthentication;