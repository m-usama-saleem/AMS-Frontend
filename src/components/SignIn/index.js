import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import AuthenticationService from '../../api/user';

import './SignIn.scss';

const SignInPage = () => (
  <div>
    <SignInForm />
    {/* <PasswordForgetLink />
    <SignUpLink /> */}
  </div>
);
const INITIAL_STATE = {
  userid: '',
  password: '',
  error: null,
};
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.authenticationService = new AuthenticationService();
  }
  onSubmit = async event => {
    const { userid, password } = this.state;

    this.authenticationService.login(userid, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.DASHBOARD);
      })
      .catch(error => {
        this.setState({ error: error });
      });

    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { userid, password, error } = this.state;
    const isInvalid = password === '' || userid === '';
    return (
      <div id="login" className="login-form-container">
        <header style={{ fontSize: 40 }}>Anmeldung</header>
        <form onSubmit={this.onSubmit}>
          <fieldset>
            <div className="input-wrapper">
              <input
                name="userid"
                value={userid}
                onChange={this.onChange}
                type="text"
                placeholder="Anmeldung"
                autocomplete="off"
              />
            </div>
            <div className="input-wrapper">
              <input
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
                placeholder="Passwort"
                autoComplete="off"
              />
            </div>
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <label style={{ color: 'red' }}>{error && <p>{error.message}</p>}</label>
            </div>
            <button onClick={this.onSubmit} disabled={isInvalid} type="submit">
              anmelden
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
}
const SignInForm = compose(
  withRouter,
)(SignInFormBase);
export default SignInPage;
export { SignInForm };