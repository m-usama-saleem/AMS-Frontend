import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <NavigationAuth authUser={authUser} />
        ) : (<NavigationNonAuth />)
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = ({ authUser }) => (
  <aside className="left-sidebar">
    <div className="scroll-sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
          </li>
          <li>
            <Link to={ROUTES.HOME}>Home</Link>
          </li>
          <li>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
          </li>
          {!!authUser.roles[ROLES.ADMIN] && (
            <li>
              <Link to={ROUTES.ADMIN}>Admin</Link>
            </li>

          )}
          <li>
            <Link to={ROUTES.EXAM_LIST}>Exams</Link>
          </li>
          <li>
            <SignOutButton />
          </li>
        </ul>
      </nav>
    </div>
    <div className="sidebar-footer">
      <a href="" className="link" data-toggle="tooltip" title="Settings"><i className="ti-settings"></i></a>
      <a href="" className="link" data-toggle="tooltip" title="E-Mail"><i className="mdi mdi-gmail"></i></a>
      <a href="" className="link" data-toggle="tooltip" title="Logout"><i className="mdi mdi-power"></i></a>
    </div>
  </aside>
)

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.ADD_PAPER}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;
