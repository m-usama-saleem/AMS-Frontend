import React, { Component } from 'react';
import classNames from 'classnames';
import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppProfile } from './AppProfile';
import { Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import SignInPage from '../SignIn';
import HomePage from '../Home';
import { withAuthentication } from '../Session';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../../layout/layout.scss'
import './App.scss';

import { AuthUserContext } from '../Session';
import ListAppointments from '../Forms/appointments/list/ListAppointments';

import InstitutiontList from '../Institutions';
import TranslatorList from '../Translators';
import AppUsers from '../AppUsers';
import TranslatorInvoice from '../Forms/invoices/TranslatorInvoice';
import TranslatorInvoiceSpeaking from '../Forms/invoices/TranslatorInvoiceSpeaking';
import ListPayables from '../Finance/Payables';
import ListReceivables from '../Finance/Receivables';

const App = (props) => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? (
                    <AuthenticatedApp authUser={authUser} />
                ) : (<SignInPage />)
            }
        </AuthUserContext.Consumer>
    </div>
);

class AuthenticatedApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            layoutMode: 'static',
            layoutColorMode: 'light',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false
        };

        this.onWrapperClick = this.onWrapperClick.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onSidebarClick = this.onSidebarClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.createDynamicMenu();
        // this.AuthenticationService = new AuthenticationService();
    }

    componentDidMount() {

    }
    onWrapperClick(event) {
        if (!this.menuClick) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            });
        }

        this.menuClick = false;
    }

    setLayoutModeStatic = () => {
        this.setState({ layoutMode: 'static' })
    }
    setLayoutModeOverlay = () => {
        this.setState({ layoutMode: 'overlay' })
    }
    setLayoutColorModeDark = () => {
        this.setState({ layoutColorMode: 'dark' })
    }
    setLayoutColorModeLight = () => {
        this.setState({ layoutColorMode: 'light' })
    }

    onToggleMenu(event) {
        this.menuClick = true;

        if (this.isDesktop()) {
            if (this.state.layoutMode === 'overlay') {
                this.setState({
                    overlayMenuActive: !this.state.overlayMenuActive
                });
            }
            else if (this.state.layoutMode === 'static') {
                this.setState({
                    staticMenuInactive: !this.state.staticMenuInactive
                });
            }
        }
        else {
            const mobileMenuActive = this.state.mobileMenuActive;
            this.setState({
                mobileMenuActive: !mobileMenuActive
            });
        }

        event.preventDefault();
    }

    onSidebarClick(event) {
        this.menuClick = true;
    }

    onMenuItemClick(event) {
        if (!event.item.items) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            })
        }
    }
    createDynamicMenu() {
        this.createMenuForAdmin()
    }

    createMenuForAdmin() {
        this.menu = [
            {
                label: 'Dashboard', icon: 'fa fa-file', to: ROUTES.DASHBOARD
            },
            {
                label: 'Appointments', icon: 'fa fa-file', to: ROUTES.APPOINTMENT_LIST
            },
            {
                label: 'Finance', icon: 'fa fa-file',
                items: [
                    { label: 'Receivables', icon: 'fa fa-file-archive-o', to: ROUTES.FINANCE_RECEIVE },
                    { label: 'Payables', icon: 'fa fa-rss', to: ROUTES.FINANCE_PAY },
                ]
            },
            {
                label: 'Translators', icon: 'fa fa-users', to: ROUTES.TRANSLATOR_LIST
            },
            {
                label: 'Institutions', icon: 'fa fa-users', to: ROUTES.INSTITUTION_LIST
            },
            {
                label: 'Users', icon: 'fa fa-users', to: ROUTES.USER_LIST
            },
        ];
    }

    addClass(element, className) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    removeClass(element, className) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    componentDidUpdate() {
        if (this.state.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    }

    render() {
        const logo = this.state.layoutColorMode === 'dark' ? '../../../assets/Qureshi-01.png' : '../../../assets/Qureshi-01.png';

        const wrapperClass = classNames('layout-wrapper', {
            'layout-overlay': this.state.layoutMode === 'overlay',
            'layout-static': this.state.layoutMode === 'static',
            'layout-static-sidebar-inactive': this.state.staticMenuInactive && this.state.layoutMode === 'static',
            'layout-overlay-sidebar-active': this.state.overlayMenuActive && this.state.layoutMode === 'overlay',
            'layout-mobile-sidebar-active': this.state.mobileMenuActive
        });

        const sidebarClassName = classNames("layout-sidebar", {
            'layout-sidebar-dark': this.state.layoutColorMode === 'dark',
            'layout-sidebar-light': this.state.layoutColorMode === 'light'
        });
        return (
            <div className={wrapperClass} onClick={this.onWrapperClick}>
                <AppTopbar authUser={this.props.authUser}
                    onToggleMenu={this.onToggleMenu}
                    setLayoutColorModeDark={this.setLayoutColorModeDark}
                    setLayoutColorModeLight={this.setLayoutColorModeLight}
                    setLayoutModeOverlay={this.setLayoutModeOverlay}
                    setLayoutModeStatic={this.setLayoutModeStatic}
                />

                <div ref={(el) => this.sidebar = el} className={sidebarClassName} onClick={this.onSidebarClick}>
                    <div className="layout-logo" >
                        <img width='80%' alt="Logo" src={logo} />
                    </div>
                    <AppProfile authUser={this.props.authUser} />
                    <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
                </div>

                <div className="layout-main">
                    <Route path={ROUTES.HOME_PAGE} component={HomePage} />

                    <Route path={ROUTES.APPOINTMENT_LIST} render={() => <ListAppointments authUser={this.props.authUser} />} />

                    <Route path={ROUTES.TRANSLATOR_LIST} render={() => <TranslatorList authUser={this.props.authUser} />} />
                    <Route path={ROUTES.INSTITUTION_LIST} render={() => <InstitutiontList authUser={this.props.authUser} />} />
                    <Route path={ROUTES.USER_LIST} render={() => <AppUsers authUser={this.props.authUser} />} />

                    <Route path={ROUTES.TRANSLATOR_INVOICE} render={(props) => <TranslatorInvoice {...props} />} />
                    <Route path={ROUTES.TRANSLATOR_INVOICE_SPEAKING} render={(props) => <TranslatorInvoiceSpeaking {...props} />} />

                    <Route path={ROUTES.FINANCE_PAY} render={(props) => <ListPayables {...props} authUser={this.props.authUser} />} />
                    <Route path={ROUTES.FINANCE_RECEIVE} render={(props) => <ListReceivables {...props} authUser={this.props.authUser} />} />

                    {/* <Route path={ROUTES.FINANCE_RECEIVE} render={() => <TranslatorInvoiceSpeaking />} /> */}

                </div>

                {/* <AppFooter  /> */}

                {/* <div className="layout-mask"></div> */}
            </div>
        );
    }
}

export default withAuthentication(App);