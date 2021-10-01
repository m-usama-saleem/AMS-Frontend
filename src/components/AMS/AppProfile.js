import React, { Component } from 'react';
import classNames from 'classnames';
import  AuthenticationService from '../../api/user';

export class AppProfile extends Component {

    constructor() {
        super();
        this.state = {
            expanded: false
        };
        this.onClick = this.onClick.bind(this);
        this.authenticationService = new AuthenticationService();
    }

    onClick(event) {
        this.setState({expanded: !this.state.expanded});
        event.preventDefault();
    }
    signOut =() =>{
        this.authenticationService.logout();
    }

    render() {
        return  (
            <div className="layout-profile">
                {/* <div>
                    <img src="assets/layout/images/transparent-default.png" alt="" />
                </div> */}
                <button className="p-link layout-profile-link" onClick={this.onClick}>
                    {/* <span className="username">{this.props.authUser.username}</span> */}
                    <i className="pi pi-fw pi-cog"/> 
                </button>
                <ul className={classNames({'layout-profile-expanded': this.state.expanded})}>
                    {/* <li><button className="p-link"><i className="pi pi-fw pi-inbox"/><span>Notifications</span><span className="menuitem-badge">2</span></button></li> */}
                    <li><button className="p-link" onClick={this.signOut}><i className="pi pi-fw pi-power-off"/><span>Logout</span></button></li>
                </ul>
            </div>
        );
    }
}