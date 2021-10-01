// import React, { Component } from 'react';
// import classNames from 'classnames';
// import { AppTopbar } from './AppTopbar';
// import { AppFooter } from './AppFooter';
// import { AppMenu } from './AppMenu';
// import { AppProfile } from './AppProfile';
// import { Route } from 'react-router-dom';
// import * as ROUTES from '../../constants/routes';
// import * as ROLES from '../../constants/roles';

// import SignInPage from '../SignIn';
// import HomePage from '../Home';
// import { withAuthentication } from '../Session';
// import 'primereact/resources/themes/nova-light/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';
// import '../../layout/layout.scss'
// import './App.scss';

// import { AuthUserContext } from '../Session';
// import AddEmployee from '../Employees/Add';
// import EmployeeList from '../Employees/List';
// import AddClient from '../Client/Add';
// import ClientList from '../Client/List';
// import SecurityLogs from '../Forms/securityLog/add/SecurityLogs';
// import ListSecurityLogs from '../Forms/securityLog/list/ListSecurityLogs';
// import GeneralOccReport from '../Forms/generalOccurence/add/GeneralOccReport';
// import ListGeneralOccurence from '../Forms/generalOccurence/list/ListGeneralOccurence';
// import AlarmResponse from '../Forms/alarmResponse/add/AlarmResponse';
// import ListAlarmResponse from '../Forms/alarmResponse/list/ListAlarmResponse';
// import ParkingEnforcement from '../Forms/parkingEnforcement/add/ParkingEnforcement';
// import ListParkingEnforcement from '../Forms/parkingEnforcement/list/ListParkingEnforcement';
// import TressPassNotice from '../Forms/tressPassNotice/add/TressPassNotice';
// import ListTressPassNotice from '../Forms/tressPassNotice/list/ListTressPassNotice';
// import LossPreventionReport from '../Forms/lossPreventionReports/add/LossPreventionReport';
// import ListLossPreventionReport from '../Forms/lossPreventionReports/list/ListLossPreventionReport';
// import  AuthenticationService from '../../api/user';
// import ForceReport from '../Forms/ForceReport';
// import ReportWriting from '../Forms/lossPreventionReports/ReportWriting';

// const App = (props) => (
//     <div>
//         <AuthUserContext.Consumer>
//             {authUser =>
//                 authUser ? (
//                     <AuthenticatedApp authUser={authUser} />
//                 ) : (<SignInPage />)
//             }
//         </AuthUserContext.Consumer>
//     </div>
// );

// class AuthenticatedApp extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             layoutMode: 'static',
//             layoutColorMode: 'light',
//             staticMenuInactive: false,
//             overlayMenuActive: false,
//             mobileMenuActive: false
//         };

//         this.onWrapperClick = this.onWrapperClick.bind(this);
//         this.onToggleMenu = this.onToggleMenu.bind(this);
//         this.onSidebarClick = this.onSidebarClick.bind(this);
//         this.onMenuItemClick = this.onMenuItemClick.bind(this);
//         this.createDynamicMenu();
//         this.AuthenticationService = new AuthenticationService();
//     }

//     componentDidMount(){
//         var dt = new Date(Date.parse(this.props.authUser.date));
//         var date = new Date(dt.setDate(dt.getDate() + 7))
//         var datenow = new Date();
//         if(date < datenow){
//             this.AuthenticationService.logout()
//         }
//     }
//     onWrapperClick(event) {
//         if (!this.menuClick) {
//             this.setState({
//                 overlayMenuActive: false,
//                 mobileMenuActive: false
//             });
//         }

//         this.menuClick = false;
//     }

//     setLayoutModeStatic = () => {
//         this.setState({ layoutMode: 'static' })
//     }
//     setLayoutModeOverlay = () => {
//         this.setState({ layoutMode: 'overlay' })
//     }
//     setLayoutColorModeDark = () => {
//         this.setState({ layoutColorMode: 'dark' })
//     }
//     setLayoutColorModeLight = () => {
//         this.setState({ layoutColorMode: 'light' })
//     }

//     onToggleMenu(event) {
//         this.menuClick = true;

//         if (this.isDesktop()) {
//             if (this.state.layoutMode === 'overlay') {
//                 this.setState({
//                     overlayMenuActive: !this.state.overlayMenuActive
//                 });
//             }
//             else if (this.state.layoutMode === 'static') {
//                 this.setState({
//                     staticMenuInactive: !this.state.staticMenuInactive
//                 });
//             }
//         }
//         else {
//             const mobileMenuActive = this.state.mobileMenuActive;
//             this.setState({
//                 mobileMenuActive: !mobileMenuActive
//             });
//         }

//         event.preventDefault();
//     }

//     onSidebarClick(event) {
//         this.menuClick = true;
//     }

//     onMenuItemClick(event) {
//         if (!event.item.items) {
//             this.setState({
//                 overlayMenuActive: false,
//                 mobileMenuActive: false
//             })
//         }
//     }
//     createDynamicMenu() {
//         var role = this.props.authUser.roles;
//         if (role === ROLES.ADMIN) {
//             this.createMenuForAdmin()
//         }
//         else if (role === ROLES.CLIENT) {
//             this.createMenuForClient()
//         }
//         else if (role === ROLES.EMPLOYEE) {
//             this.createMenuForEmployee()
//         }
//     }
//     createMenuForClient() {
//         this.menu = [
//             { label: 'Security Log', icon: 'fa fa-file', to: ROUTES.SECURITY_LOGS_LIST },
//             { label: 'General Occurence Report', icon: 'fa fa-address-book', to: ROUTES.GENERAL_OCCURENCE_LIST },
//         ]
//     }
//     createMenuForEmployee() {
//         this.menu = [
//             { label: 'Security Log', icon: 'fa fa-file', to: ROUTES.SECURITY_LOGS_ADD },
//             { label: 'General Occurence Report', icon: 'fa fa-address-book', to: ROUTES.GENERAL_OCCURENCE_ADD },
//             {
//                 label: 'Loss Prevention Case Report', icon: 'fa fa-globe',
//                 items: [
//                     { label: 'Incident Report', icon: 'fa fa-file-archive-o', to: ROUTES.INCIDENT_REPORT_ADD },
//                     { label: 'Trespass Report', icon: 'fa fa-sticky-note', to: ROUTES.TRESSPAS_REPORT_ADD },
//                     { label: 'Employee Time Sheet', icon: 'fa fa-file-archive-o ', to: ROUTES.EMP_TIMESHEET_ADD },
//                     { label: 'Report Writing', icon: 'fa fa-pencil-square-o', to: ROUTES.REPORT_WRITING },
//                     { label: 'Adult Rights To Counsel', icon: 'fa fa-pencil-square-o ', to: ROUTES.ADULT_RIGHT_ADD },
//                     { label: 'Youth Rights To Counsel', icon: 'fa fa fa-info-circle ', to: ROUTES.YOUTH_RIGHT_ADD },
//                     { label: 'Civil Forms', icon: 'fa fa fa-info-circle ', to: ROUTES.CIVIL_FORMS_ADD },
//                 ]
//             },
//             { label: 'Alarm Responses', icon: 'fa fa-flag', to: ROUTES.ALARM_RESPONSE_ADD },
//             { label: 'Parking Enforcements', icon: 'fa fa-pencil-square-o', to: ROUTES.PARKING_ENFORCEMENT_ADD },
//             { label: 'Tress Pass Notices', icon: 'fa fa-shield ', to: ROUTES.TRESSPASS_NOTICE_ADD },
//             { label: 'Use Of Force Report', icon: 'fa fa-users', to: ROUTES.FORCE_REPORT }, 
//         ]
//     }
//     createMenuForAdmin() {
//         this.menu = [
//             {
//                 label: 'Security Log', icon: 'fa fa-file',
//                 items: [
//                     { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.SECURITY_LOGS_ADD },
//                     { label: 'View All', icon: 'fa fa-rss', to: ROUTES.SECURITY_LOGS_LIST },
//                 ]
//             },
//             {
//                 label: 'General Occurence Report', icon: 'fa fa-address-book',
//                 items: [
//                     { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.GENERAL_OCCURENCE_ADD },
//                     { label: 'View All', icon: 'fa fa-rss', to: ROUTES.GENERAL_OCCURENCE_LIST },
//                 ]
//             },
//             {
//                 label: 'Loss Prevention Case Report', icon: 'fa fa-globe',
//                 items: [
//                     {
//                         label: 'Incident Report', icon: 'fa fa-sticky-note',
//                         items: [
//                             { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.INCIDENT_REPORT_ADD },
//                             { label: 'View All', icon: 'fa fa-rss', to: ROUTES.INCIDENT_REPORT_LIST },
//                         ]
//                     },
//                     {
//                         label: 'Tresspass Report', icon: 'fa fa-sticky-note',
//                         items: [
//                             { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.TRESSPAS_REPORT_ADD },
//                             { label: 'View All', icon: 'fa fa-rss', to: ROUTES.TRESSPAS_REPORT_LIST },
//                         ]
//                     },
//                     {
//                         label: 'Employee Time Sheet', icon: 'fa fa-clock-o',
//                         items: [
//                             { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.EMP_TIMESHEET_ADD },
//                             { label: 'View All', icon: 'fa fa-rss', to: ROUTES.EMP_TIMESHEET_LIST },
//                         ]
//                     },
//                     {
//                         label: 'Report Writing', icon: 'fa fa-pencil-square-o', to: ROUTES.REPORT_WRITING
//                     },
//                     {
//                         label: 'Adult Right To Counsel', icon: 'fa fa-info-circle',
//                         items: [
//                             { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.ADULT_RIGHT_ADD },
//                             { label: 'View All', icon: 'fa fa-rss', to: ROUTES.ADULT_RIGHT_LIST },
//                         ]
//                     },
//                     {
//                         label: 'Youth Right To Counsel', icon: 'fa fa-info-circle',
//                         items: [
//                             { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.YOUTH_RIGHT_ADD },
//                             { label: 'View All', icon: 'fa fa-rss', to: ROUTES.YOUTH_RIGHT_LIST },
//                         ]
//                     },
//                     {
//                         label: 'Civil Forms', icon: 'fa fa-pencil-square-o',
//                         items: [
//                             { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.CIVIL_FORMS_ADD },
//                             { label: 'View All', icon: 'fa fa-rss', to: ROUTES.CIVIL_FORMS_LIST },
//                         ]
//                     },
//                 ]
//             },
//             {
//                 label: 'Alarm Responses', icon: 'fa fa-flag',
//                 items: [
//                     { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.ALARM_RESPONSE_ADD },
//                     { label: 'View All', icon: 'fa fa-rss', to: ROUTES.ALARM_RESPONSE_LIST },
//                 ]
//             },
//             {
//                 label: 'Parking Enforcements', icon: 'fa fa-pencil-square-o',
//                 items: [
//                     { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.PARKING_ENFORCEMENT_ADD },
//                     { label: 'View All', icon: 'fa fa-rss', to: ROUTES.PARKING_ENFORCEMENT_LIST },
//                 ]
//             },
//             {
//                 label: 'Tress Pass Notices', icon: 'fa fa-shield',
//                 items: [
//                     { label: 'Add New', icon: 'fa fa-file-archive-o', to: ROUTES.TRESSPASS_NOTICE_ADD },
//                     { label: 'View All', icon: 'fa fa-rss', to: ROUTES.TRESSPASS_NOTICE_LIST },
//                 ]
//             },
//             {
//                 label: 'Use Of Force Report', icon: 'fa fa-users', to: ROUTES.FORCE_REPORT
//             },  
//             {
//                 label: 'Employees', icon: 'fa fa-users', roles:[ROLES.ADMIN],
//                 items: [
//                     {label: 'List', icon: 'fa fa-list',to: ROUTES.EMPLOYEE_LIST},          
//                     {label: 'New', icon: 'fa fa-user-plus',to: ROUTES.EMPLOYEE_ADD},             
//                 ]
//             },  
//             {
//                 label: 'Clients', icon: 'fa fa-users', roles:[ROLES.ADMIN],
//                 items: [
//                     {label: 'List', icon: 'fa fa-list',to: ROUTES.CLIENT_LIST},            
//                     {label: 'New', icon: 'fa fa-user-plus',to: ROUTES.CLIENT_ADD},             
//                 ]
//             },    
//         ];
//     }

//     addClass(element, className) {
//         if (element.classList)
//             element.classList.add(className);
//         else
//             element.className += ' ' + className;
//     }

//     removeClass(element, className) {
//         if (element.classList)
//             element.classList.remove(className);
//         else
//             element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
//     }

//     isDesktop() {
//         return window.innerWidth > 1024;
//     }

//     componentDidUpdate() {
//         if (this.state.mobileMenuActive)
//             this.addClass(document.body, 'body-overflow-hidden');
//         else
//             this.removeClass(document.body, 'body-overflow-hidden');
//     }

//     render() {
//         const logo = this.state.layoutColorMode === 'dark' ? 'assets/layout/images/olympianLogoPNG.png' : 'assets/layout/images/olympianLogoPNG.png';

//         const wrapperClass = classNames('layout-wrapper', {
//             'layout-overlay': this.state.layoutMode === 'overlay',
//             'layout-static': this.state.layoutMode === 'static',
//             'layout-static-sidebar-inactive': this.state.staticMenuInactive && this.state.layoutMode === 'static',
//             'layout-overlay-sidebar-active': this.state.overlayMenuActive && this.state.layoutMode === 'overlay',
//             'layout-mobile-sidebar-active': this.state.mobileMenuActive
//         });

//         const sidebarClassName = classNames("layout-sidebar", {
//             'layout-sidebar-dark': this.state.layoutColorMode === 'dark',
//             'layout-sidebar-light': this.state.layoutColorMode === 'light'
//         });
//         return (
//             <div className={wrapperClass} onClick={this.onWrapperClick}>
//                 <AppTopbar onToggleMenu={this.onToggleMenu}
//                     setLayoutColorModeDark={this.setLayoutColorModeDark}
//                     setLayoutColorModeLight={this.setLayoutColorModeLight}
//                     setLayoutModeOverlay={this.setLayoutModeOverlay}
//                     setLayoutModeStatic={this.setLayoutModeStatic}
//                 />

//                 <div ref={(el) => this.sidebar = el} className={sidebarClassName} onClick={this.onSidebarClick}>
//                     <div className="layout-logo" >
//                         <img width='55%' alt="Logo" src={logo} />
//                     </div> 
//                     <AppProfile  /*authUser={this.props.authUser}*/  />
//                     <AppMenu model={this.menu} authUser={this.props.authUser} onMenuItemClick={this.onMenuItemClick} />
//                 </div>

//                 <div className="layout-main">
//                     <Route path={ROUTES.HOME_PAGE} component={HomePage} />

//                     <Route path={ROUTES.SECURITY_LOGS_ADD} render={() => <SecurityLogs authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.SECURITY_LOGS_LIST} render={() => <ListSecurityLogs authUser = {this.props.authUser} />}  />

//                     <Route path={ROUTES.GENERAL_OCCURENCE_ADD} render={() => <GeneralOccReport authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.GENERAL_OCCURENCE_LIST} render={() => <ListGeneralOccurence authUser = {this.props.authUser} />} />

//                     <Route path={ROUTES.ALARM_RESPONSE_ADD} render={() => <AlarmResponse authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.ALARM_RESPONSE_LIST} render={() => <ListAlarmResponse authUser = {this.props.authUser} />} />

//                     <Route path={ROUTES.PARKING_ENFORCEMENT_ADD} render={() => <ParkingEnforcement authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.PARKING_ENFORCEMENT_LIST} render={() => <ListParkingEnforcement authUser = {this.props.authUser} />} />

//                     <Route path={ROUTES.TRESSPASS_NOTICE_ADD} render={() => <TressPassNotice authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.TRESSPASS_NOTICE_LIST} render={() => <ListTressPassNotice authUser = {this.props.authUser} />} />

//                     <Route path={ROUTES.INCIDENT_REPORT_ADD} render={() => <LossPreventionReport title="Incident Report" type="IncidentReport" authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.INCIDENT_REPORT_LIST} render={() => <ListLossPreventionReport title="Incident Report" type="IncidentReport" authUser = {this.props.authUser} />} />

//                     <Route path={ROUTES.TRESSPAS_REPORT_ADD} render={() => <LossPreventionReport title="Tresspass Report" type="TresspassReport" authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.TRESSPAS_REPORT_LIST} render={() => <ListLossPreventionReport title="Tresspass Report" type="TresspassReport" authUser = {this.props.authUser} />} />

//                     <Route path={ROUTES.EMP_TIMESHEET_ADD} render={() => <LossPreventionReport title="Employee Time Sheet" type="EmployeeTimeSheet" authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.EMP_TIMESHEET_LIST} render={() => <ListLossPreventionReport title="Employee Time Sheet" type="EmployeeTimeSheet" authUser = {this.props.authUser} />} />

//                     <Route path={ROUTES.ADULT_RIGHT_ADD} render={() => <LossPreventionReport title="Adult Right To Counsel" type="AdultRightToCounsel" authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.ADULT_RIGHT_LIST} render={() => <ListLossPreventionReport title="Adult Right To Counsel" type="Adult Right To Counsel" authUser = {this.props.authUser} />} />

//                     <Route path={ROUTES.YOUTH_RIGHT_ADD} render={() => <LossPreventionReport title="Youth Right To Counsel" type="YouthRightToCounsel" authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.YOUTH_RIGHT_LIST} render={() => <ListLossPreventionReport title="Youth Right To Counsel" type="YouthRightToCounsel" authUser = {this.props.authUser} />} />

//                     <Route path={ROUTES.CIVIL_FORMS_ADD} render={() => <LossPreventionReport title="Civil Forms" type="CivilForms" authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.CIVIL_FORMS_LIST} render={() => <ListLossPreventionReport title="Civil Forms" type="CivilForms" authUser = {this.props.authUser} />} />

//                     <Route path={ROUTES.FORCE_REPORT} render={() => <ForceReport authUser = {this.props.authUser} />} />
//                     <Route path={ROUTES.REPORT_WRITING} render={() => <ReportWriting authUser = {this.props.authUser} />} />

//                     {/*
//                     Report Writing
//                      */}
//                     {/* <Route path="/example" component={Example} /> */}
//                     <Route path={ROUTES.EMPLOYEE_ADD} component={AddEmployee} />
//                     <Route path={ROUTES.EMPLOYEE_LIST} component={EmployeeList} />
//                     <Route path={ROUTES.CLIENT_ADD} component={AddClient} />
//                     <Route path={ROUTES.CLIENT_LIST} component={ClientList} />
//                 </div>

//                 {/* <AppFooter  /> */}

//                 {/* <div className="layout-mask"></div> */}
//             </div>
//         );
//     }
// }

// export default withAuthentication(App);