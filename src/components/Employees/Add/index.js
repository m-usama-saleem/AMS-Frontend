import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { ProgressBar } from 'primereact/progressbar';
import { UserService } from '../../../api/user';
import { compose } from 'recompose';
import { withAuthorization } from '../../Session';
import * as ROLES from '../../../constants/roles'

const INITIAL_STATE = {
    userId:'',
    password: '',
    isUploading: '',
    progress: 0,
    isLoading: false,
    isUserIdValid: true,
    isPasswordValid: true,
    isUserIdAlreadyExists: false,
    
    usersList: [],
}

const errorBox = {
    borderRadius: '3px', borderColor: 'rgba(242, 38, 19, 1)'
};
const normalBox = {
    border: '1px solid #a6a6a6'
};

class AddEmployee extends Component {

    constructor(props) {
        super(props);
        this.userSerivce = new UserService();
        this.state = INITIAL_STATE;
    }
    
    componentDidMount() {
        this.loadUsers();
    }

    loadUsers = () => {
        this.setState({ isLoading: true });
        this.userSerivce
            .ListUserId()
            .then(data => {
                debugger;
                if (data !== undefined && data !== null) {
                    this.setState({
                        usersList: data,
                        isLoading: false,
                    });
                } else {
                    this.setState({ isLoading: false })
                }
            })
            .catch(error => {
                this.setState({ isLoading: false, error: error })
                debugger;
            });
    }

    isUserExistOnServer = () => {
        var result = false;
        this.userSerivce
            .IsUserExists(this.state.userId)
            .then(data => {
                if (data !== undefined && data !== null) {
                   return data;
                }
            });
        return result;
    }

    onUserIdBlur = (e) => {
        debugger;
        let userId = this.state.userId;
        if (this.state.userId.trim() === "") {
            this.setState({ isUserIdValid: false });
            return;
        } else {
            this.setState({ isUserIdValid: true });
        }
        let userIds = this.state.usersList;
        if (userIds != null && userIds != undefined && userIds.length > 0 && userIds !== "" && userIds !== " ") {
            let result;
            for (let i = 0; i < userIds.length; i++) {
                result = userIds[i].replace(" ", "").toLowerCase().includes(userId.replace(" ", "").toLowerCase());
                if (result) {
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'EmployeeId already exists on server' });
                    this.setState({ isUserIdValid: false,isUserIdAlreadyExists: result });
                    return;
                }
            }
            this.setState({ isUserIdValid: true,isUserIdAlreadyExists: false });
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

    onAddUser = (e) => {
        debugger;
        this.setState({ isLoading: true });
        let result = this.validateForm();
        if (result !== false) {
            this.saveUser();
        }
        this.setState({ isLoading: false });
    }

    onReset = (e) =>{
        this.setState({userId: '', password :''});
    }

    saveUser = () => {
        let user = {UserId: this.state.userId, Password: this.state.password, RoleId: 2}
        this.userSerivce
            .Register(user)
            .then((data) => {
                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Employee Created' });
                let userIds = this.state.usersList;
                userIds.push(user.UserId)
                this.setState({
                    usersList: userIds,
                    isLoading: false,
                });
                this.resetForm();
            })
            .catch((error) => {
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while creating Empl user' });
                this.setState({ isLoading: false });
            })
    }

    validateForm = () => {
        debugger;
        let error = "";
        if (this.state.userId.trim() == '') {
            error += "User cannot be empty \n";  
            this.setState({ isUserIdValid: false });          
        }else{
            if (!this.state.isUserIdAlreadyExists) {
                if (this.isUserExistOnServer()) {
                    error += "EmployeeId already exists \n";                    
                }
            } else {
                error += "EmployeeId already exists \n";
            }
        }
        if (this.state.password.trim() == '') {
            this.setState({ isPasswordValid: false });
            error += "Password cannot be empty \n";
        }
        if (error !== ''){
            this.setState({ isValidForm: false, error: error })
            return false;
        }
        else{
            this.setState({ isValidForm: true, error: null })
            return true;
        }
    }

    resetForm = () => {
        this.setState({
            isLoading: false,
            isUserIdValid: true,
            isPasswordValid: true,            
            userId: '',
            password: '',
            isValidForm: true,
            errors: '',
        })
    }

    render() {
        return (
            <div><Growl ref={(el) => this.growl = el}></Growl>

                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>New Employee</h1>

                        <div className="p-grid ">

                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">EmployeeId or Email</label>
                                    {this.state.isUserIdValid === false ? <label htmlFor="float-input" style={{ color: 'red' }}>  *</label> : null}
                                    <InputText id="txtUserId" value={this.state.userId} type="text" style={this.state.isUserIdValid === false ? errorBox : normalBox} readOnly={this.state.isLoading} size="30" onBlur={(e) => this.onUserIdBlur(e)} onChange={(e) => this.setState({ userId: e.target.value })} />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Password</label>
                                    {this.state.isPasswordValid === false ? <label htmlFor="float-input" style={{ color: 'red' }}>  *</label> : null}
                                    <InputText id="txtPassword" value={this.state.password} type="password" style={this.state.isPasswordValid === false ? errorBox : normalBox} readOnly={this.state.isLoading} size="30" onBlur={(e) => this.onPasswordBlur(e)} onChange={(e) => this.setState({ password: e.target.value })} />
                                </span>
                            </div>
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                                {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                            </div>
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{color:'red', whiteSpace:"pre-wrap"}}>
                                {(this.state.isValidForm === false || this.state.error) ? this.state.error:''}
                            </div>
                            <div className="p-col-4 p-sm-4 p-md-2 p-lg-2">
                                <span className="ui-float-label">
                                    <Button label="Save" className="p-button-primary ui-btns" disabled={this.state.isLoading} onClick={(e) => this.onAddUser(e)} />
                                </span>
                            </div>
                            <div className="p-col-4 p-sm-4 p-md-2 p-lg-2">
                                <span className="ui-float-label">
                                    <Button label="Reset" className="p-button-secondary " disabled={this.state.isLoading} onClick={(e) => this.onReset(e)} />
                                </span>
                            </div>

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
)(AddEmployee);

