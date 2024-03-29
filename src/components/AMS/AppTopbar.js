import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import PropTypes from 'prop-types';
import { Menu } from 'primereact/menu';
import AuthenticationService from '../../api/user';
import * as ROUTES from '../../constants/routes';

export class AppTopbar extends Component {

    constructor() {
        super();
        this.authenticationService = new AuthenticationService();
        this.state = {
            showMenu: 'none'
        }
    }
    static defaultProps = {
        onToggleMenu: null
    }

    static propTypes = {
        onToggleMenu: PropTypes.func.isRequired
    }

    signOut = () => {
        this.authenticationService.logout();
    }
    userManagement = () => {
        window.location.hash = ROUTES.USER_LIST;
    }

    toggleMenu() {
        if (this.state.showMenu == "none") {
            this.setState({ showMenu: 'block' })
        }
        if (this.state.showMenu == "block") {
            this.setState({ showMenu: 'none' })
        }
    }
    render() {
        let userItems = [
            {
                label: 'abmelden', icon: 'pi pi-sign-out',
                command: (event) => {
                    this.signOut();
                }
            },
             {
                label: 'Auftragnehmer', icon: 'fa fa-user-plus',
                command: (event) => {
                    this.userManagement();
                }
            },
        ];
        let settingItems = [
            { label: 'Static Menu', icon: 'pi pi-fw pi-bars', command: () => this.props.setLayoutModeStatic() },
            { label: 'Overlay Menu', icon: 'pi pi-fw pi-bars', command: () => this.props.setLayoutModeOverlay() },
            { label: 'Dark', icon: 'pi pi-fw pi-bars', command: () => this.props.setLayoutColorModeDark() },
            { label: 'Light', icon: 'pi pi-fw pi-bars', command: () => this.props.setLayoutColorModeLight() }

        ];

        return (
            <div className="layout-topbar clearfix">
                <button className="p-link layout-menu-button" onClick={(e) => this.props.onToggleMenu(e)}>
                    <span className="pi pi-bars" />
                </button>
                <div className="layout-topbar-icons">
                    {/* <span className="layout-topbar-search">
                        <InputText type="text" placeholderText="Suche" />
                        <span className="layout-topbar-search-icon pi pi-search"/>
                    </span>
                    <button className="p-link">
                        <span className="layout-topbar-item-text">Events</span>
                        <span className="layout-topbar-icon pi pi-calendar"/>
                        <span className="layout-topbar-badge">5</span>
                    </button> */}
                    {/* <Menu model={settingItems} popup={true} ref={el => this.menuSettings = el} />
                    <button className="p-link" onClick={(event) => { this.menuSettings.toggle(event) }}>
                        <span className="layout-topbar-item-text">Settings</span>
                        <span className="layout-topbar-icon pi pi-cog" />
                    </button> */}
                    <Menu style={{ right: 0 }} className="" model={userItems} popup={true} ref={el => this.menuUserItem = el} />
                    <button className="p-link" onClick={(event) => { this.menuUserItem.toggle(event) }}>
                        <span className="layout-topbar-item-text">User</span>
                        <span className="layout-topbar-icon pi pi-user" />
                    </button>
                    {/* <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" onClick={() => this.toggleMenu()}>
                            {this.props.authUser.name}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginRight:20, display: this.state.showMenu }}
                            onClick={() => this.signOut()} >
                            <button className="p-link layout-menu-button" >
                                <span style={{ fontSize: 16, color: 'black' }}>abmelden</span>
                            </button>
                            <button className="p-link layout-menu-button">
                                <span style={{ fontSize: 16, float: 'right', marginRight: 20, color: 'black' }} className="pi pi-sign-out" />
                            </button>
                        </div>
                    </div> */}
                </div>
            </div >
        );
    }
}