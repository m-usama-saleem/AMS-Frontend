import React, {Component} from 'react';
import {InputText} from 'primereact/inputtext';
import PropTypes from 'prop-types';
import {Menu} from 'primereact/menu';
import  AuthenticationService from '../../api/user';

export class AppTopbar extends Component {

    constructor() {
        super();
        this.authenticationService = new AuthenticationService();
    }
    static defaultProps = {
        onToggleMenu: null
    }

    static propTypes = {
        onToggleMenu: PropTypes.func.isRequired
    }

    signOut =() =>{
        this.authenticationService.logout();
    }
    render() {
        let userItems = [
            {label: 'Logout', icon: 'pi pi-sign-out',
                command: (event) => {
                    this.signOut();
                }
            },
        ];
        let settingItems = [
            {label: 'Static Menu', icon: 'pi pi-fw pi-bars',  command: () => this.props.setLayoutModeStatic() },
            {label: 'Overlay Menu', icon: 'pi pi-fw pi-bars',  command: () => this.props.setLayoutModeOverlay() },
            {label: 'Dark', icon: 'pi pi-fw pi-bars',  command: () =>  this.props.setLayoutColorModeDark()},
            {label: 'Light', icon: 'pi pi-fw pi-bars',  command: () => this.props.setLayoutColorModeLight()}
             
        ];

        return (
            <div className="layout-topbar clearfix">
                <button className="p-link layout-menu-button" onClick={(e) => this.props.onToggleMenu(e)}>
                    <span className="pi pi-bars"/>
                </button>
                <div className="layout-topbar-icons">
                    {/* <span className="layout-topbar-search">
                        <InputText type="text" placeholder="Search" />
                        <span className="layout-topbar-search-icon pi pi-search"/>
                    </span>
                    <button className="p-link">
                        <span className="layout-topbar-item-text">Events</span>
                        <span className="layout-topbar-icon pi pi-calendar"/>
                        <span className="layout-topbar-badge">5</span>
                    </button> */}
                    {/* <Menu model={settingItems} popup={true} ref={el => this.menuSettings=el} /> */}
                    {/* <button className="p-link"  onClick={(event)=>{this.menuSettings.toggle(event)}}>
                        <span className="layout-topbar-item-text">Settings</span>
                        <span className="layout-topbar-icon pi pi-cog"/>
                    </button> */}
                    {/* <Menu className="p-menu" model={userItems} popup={true} ref={el => this.menuUserItem=el} />
                    <button className="p-link" onClick={(event)=>{debugger;this.menuUserItem.toggle(event)}}>
                        <span className="layout-topbar-item-text">User</span>
                        <span className="layout-topbar-icon pi pi-user"/>
                    </button> */}
                </div>
            </div>
        );
    }
}