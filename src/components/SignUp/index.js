import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: [],
  role: 0
};

const UserRoles = [
  { label: 'Administrator', value: '1' },
  { label: 'Employee', value: '2' },
  { label: 'Client', value: '3' },
];

var userRoles = ["Admin", "Employee", "Client"]

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  onSubmit = event => {
    const { username, email, passwordOne, role } = this.state;
    const roles = [];
    // this.props.firebase
    //   .doCreateUserWithEmailAndPassword(email, passwordOne)
    //   .then(authUser => {
    //     // Create a user in your Firebase realtime database
    //     this.props.firebase
    //       .user(authUser.user.uid)
    //       .set({
    //         username,
    //         email,
    //         roles,
    //       })
    //       .then(() => {
    //         this.setState({ ...INITIAL_STATE });
    //         this.props.history.push(ROUTES.HOME);
    //       })
    //       .catch(error => {
    //         this.setState({ error });
    //       });
    //   })
    //   .catch(error => {
    //     this.setState({ error });
    //   });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      role,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholderText="Full Name"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholderText="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholderText="Passwort"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholderText="Confirm Password"
        />
        <label>
          Admin:
          <Dropdown optionLabel="Select Role" value={this.state.role} options={UserRoles} onChange={(e) => { this.setState({ role: e.value }) }} placeholder="Select a City" />
          <input
            name="role"
            type="dropdown"
            onChange={this.onChangeDropDown}
          />
        </label>
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = withRouter(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };