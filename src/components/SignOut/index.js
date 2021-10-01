import React from 'react';
import  AuthenticationService from '../../api/user';

const authenticationService = new AuthenticationService();

const SignOutButton = () => (
  <button type="button" onClick={authenticationService.logout()}>
    Sign Out
  </button>
);
export default withFirebase(SignOutButton);