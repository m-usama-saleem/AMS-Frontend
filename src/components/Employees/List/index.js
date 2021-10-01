import React, { Component } from 'react';
import { compose } from 'recompose';
import { withAuthorization } from '../../Session';
import * as ROLES from '../../../constants/roles'
import { UserService } from '../../../api/user';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';

import { InputText } from 'primereact/inputtext';

const errorBox = {
    borderRadius: '3px', borderColor: 'rgba(242, 38, 19, 1)'
};
const normalBox = {
    border: '1px solid #a6a6a6'
};
class EmployeeList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            loadingModel: false,
            users: [],
            selectedUser: null, 
            displayDeleteDialog: false,
            displayPasswordChangeDialog: false,
            error: '',
            password: '',
            isPasswordValid: true
        };
        this.userSerivce = new UserService();
        this.menuModel = [
            {label: 'Change Password', icon: 'pi pi-fw pi-key', command: () => this.changePassword(this.state.selectedUser)},
            {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteUser(this.state.selectedUser)}
        ];

        this.changePassword = this.changePassword.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.userSerivce
            .EmployeeList()
            .then(data => {
                if (data !== undefined && data !== null) {
                    this.setState({
                        users: data,
                        loading: false,
                    });
                } else {
                    this.setState({ loading: false })
                }
            })
            .catch(error => {
                debugger;
                this.setState({ loading: false, error: error })
                this.growl.show({ severity: 'error', summary: 'Error', detail: error});
            });
    }

    changePassword(user) {
        debugger;
        if (user !=undefined && user != null ) {
            this.setState({
                displayPasswordChangeDialog: true,
                selectedUserName: user.userName
            })
        }
    }

    deleteUser(user) {
        debugger;
        if (user !=undefined && user != null ) {
            this.setState({
                displayDeleteDialog: true,
                selectedUserName: user.userName
            })
        }
    }

    onDeleteUser() {
        var userName = this.state.selectedUserName;
        this.setState({loadingModel: true});
        if(userName != undefined && userName != null){
            this.userSerivce.DeleteUser(userName).then(() => {
                debugger;
                var list = this.state.users.filter(x => x.userName !== userName)
                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Employee Deleted Successfully' });
                this.setState({
                    users: [...list],
                    displayDeleteDialog: false,
                    loadingModel: false,
                    error :''
                })
            })
            .catch(error => {
                debugger;
                this.setState({ loading: false, error: error,displayDeleteDialog: false, })
                this.growl.show({ severity: 'error', summary: 'Error', detail: error});
            });
        }        
    }
    showDeleteModal = (e) => {
        if (this.state.selectedUser !=undefined && this.state.selectedUser != null ) {
            this.setState({
                displayDeleteDialog: true,
                selectedUserName: e.data.userName
            })
        }
    }
    
    onChangePassword() {
        this.setState({loadingModel: true});
        debugger;
        let user = {UserId: this.state.selectedUserName, Password: this.state.password, RoleId: -1}
        if(this.state.isPasswordValid != false){
            this.userSerivce.ChangePassword(user).then(() => {
                debugger;
                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Password Changed Successfully' });
                this.setState({
                    displayPasswordChangeDialog: false,
                    loadingModel: false,
                    password: '',
                    error: ''
                })
            })
            .catch(error => {
                debugger;
                this.setState({ loadingModel: false, error: error,displayPasswordChangeDialog: false, password:'', })
                this.growl.show({ severity: 'error', summary: 'Error', detail: error});
            });
        }        
    }
    onPasswordBlur = (e) => {
        if (this.state.password.trim() === "") {
            this.setState({ isPasswordValid: false });
            return;
        } else {
            this.setState({ isPasswordValid: true });
        }
    }
    
    render() {
        const { users, loading } = this.state;
        debugger;
        return (
            <div>
        <Growl ref={(el) => this.growl = el}></Growl>
        <ContextMenu model={this.menuModel} ref={el => this.cm = el} onHide={() => this.setState({ selectedUser: null })}/>
        <div className="p-grid p-fluid" >
          <div className="card card-w-title">
            <h1>Employee List</h1>
            <div className="content-section implementation">
                <DataTable value={this.state.users} contextMenuSelection={this.state.selectedUser}
                        onContextMenuSelectionChange={e => this.setState({ selectedUser: e.value })}
                        onContextMenu={e => this.cm.show(e.originalEvent)}>   
                    <Column field="userName" header="EmployeeId or Email" filter={true} filterMatchMode="contains" filterPlaceholder="EmployeeId or Email" />
              </DataTable>
              <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ paddingTop: '20px' }}>
                {this.state.loading === true ?
                  <div>
                    <p style={{ textAlign: 'center', fontSize: '20px' }}>Loading Data </p>
                    <ProgressBar style={{ marginTop: '40px', height: '2px' }} mode="indeterminate" />

                  </div>
                  : null
                }{this.state.error ?
                    <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{color:'red', whiteSpace:"pre-wrap"}}>
                        {this.state.error}
                    </div> : null
                }
                
              </div>
              <Dialog visible={this.state.displayDeleteDialog} width="400px" header="You sure to delete this Employee?"
                modal={true} onHide={() => this.setState({ displayDeleteDialog: false })}>
                {
                  <div className="ui-dialog-buttonpane p-clearfix">
                    <Button label="Yes" style={{ width: 100 }} className="p-button-danger" onClick={() => this.onDeleteUser()} />
                    <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayDeleteDialog: false })} />
                    {this.state.loadingModel === true ?
                    <div>
                        <ProgressBar style={{ marginTop: '10px', height: '2px' }} mode="indeterminate" />
                    </div>
                    : null
                    }
                  </div>
                }
              </Dialog>
              <Dialog visible={this.state.displayPasswordChangeDialog}  header="Change Employee Password" style={{width: '250px'}}
                modal={true} onHide={() => this.setState({ displayPasswordChangeDialog: false })}>
                {
                  <div className="ui-dialog-buttonpane p-clearfix">
                      <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                            <span className="ui-float-label">
                                    <label htmlFor="float-input">New Password</label>
                                    {this.state.isPasswordValid === false ? <label htmlFor="float-input" style={{ color: 'red' }}>  *</label> : null}
                                    <InputText id="txtPassword" value={this.state.password} type="password" style={this.state.isPasswordValid === false ? errorBox : normalBox} readOnly={this.state.isLoading} size="30" onBlur={(e) => this.onPasswordBlur(e)} onChange={(e) => this.setState({ password: e.target.value })} />
                           </span>
                           <div style={{marginTop: '10px'}}>
                                <Button label="Change" style={{ width: 100 }} className="p-button-success" onClick={() => this.onChangePassword()} />
                                <Button label="Cancel" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayPasswordChangeDialog: false, password:'' })} />
                                {this.state.loadingModel === true ?
                                    <div>
                                        <ProgressBar style={{ marginTop: '10px', height: '2px' }} mode="indeterminate" />
                                    </div>
                                    : null
                                }
                           </div>
                           
                        </div>
                        
                  </div>
                }
              </Dialog>
            </div>

          </div>


        </div>
      </div>
        );
    }
}

const condition = authUser =>
    authUser && !!authUser.roles.includes(ROLES.ADMIN);

export default compose(
    withAuthorization(condition)
)(EmployeeList);