import React, { Component } from 'react';
import * as ROLES from '../../constants/roles'
import { UserService } from '../../api/user';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import Select from 'react-select'

import { InputText } from 'primereact/inputtext';
import AMSInputField from '../Common/AMSInputField';

const errorBox = {
    borderRadius: '3px', borderColor: 'rgba(242, 38, 19, 1)'
};
const normalBox = {
    border: '1px solid #a6a6a6'
};
const errorBoxForCheckBox = {
    border: '1px solid red', borderRadius: '3px'
};

class InstitutionList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            loadingModel: false,
            users: [],
            selectedUser: null,
            displayDeleteDialog: false,
            displayCreateDialog: false,
            displayEditDialog: false,
            isTypeValid: true,
            error: '',
        };
        this.userSerivce = new UserService();

        this.deleteUser = this.deleteUser.bind(this);
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.userSerivce
            .InstitutionList()
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
                this.setState({ loading: false, error: error })
                this.growl.show({ severity: 'error', summary: 'Error', detail: error });
            });
    }

    deleteUser(id) {
        if (id != undefined && id != null) {
            this.setState({
                displayDeleteDialog: true,
                selectedUserId: id
            })
        }
    }

    onDeleteUser() {
        var id = this.state.selectedUserId;
        this.setState({ loadingModel: true });
        if (id != undefined && id != null && id != 0) {
            this.userSerivce.DeleteInstitution(id).then(() => {
                var list = this.state.users.filter(x => x.id !== id)
                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Instituition Deleted Successfully' });
                this.setState({
                    users: [...list],
                    displayDeleteDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayDeleteDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Error', detail: error });
                });
        }
    }
    showDeleteModal = (e) => {
        if (this.state.selectedUser != undefined && this.state.selectedUser != null) {
            this.setState({
                displayDeleteDialog: true,
                selectedUserId: e.data.id
            })
        }
    }

    saveUser = () => {
        let user = {
            Name: this.state.name,
            Email: this.state.email,
            Type: this.state.type,
            Address: this.state.address,
            CreatedAt: new Date(),
            CreatedBy: this.props.authUser.id
        }
        this.userSerivce
            .AddInstitution(user)
            .then((data) => {
                if (data.success == true) {
                    this.growl.show({ severity: 'success', summary: 'Success', detail: 'Instituition Created' });
                    var savedUser = data.user;
                    this.setState({
                        users: [...this.state.users, savedUser],
                        isLoading: false,
                        displayCreateDialog: false
                    });
                    this.onReset();
                }
            })
            .catch((error) => {
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while creating Instituition' });
                this.setState({ isLoading: false });
            })
    }
    editUser = () => {
        let user = {
            Id: this.state.selectedUserId,
            Name: this.state.name,
            Email: this.state.email,
            Type: this.state.type,
            Address: this.state.address,
            CreatedBy: this.props.authUser.id
        }
        this.userSerivce
            .EditInstitution(user)
            .then((data) => {
                if (data.success == true) {
                    this.growl.show({ severity: 'success', summary: 'Success', detail: 'Instituition Updated' });
                    var UsersList = this.state.users;

                    var ind = UsersList.findIndex(x => x.id == user.Id);
                    UsersList[ind] = {
                        id: user.Id,
                        name: user.Name,
                        email: user.Email,
                        type: user.Type,
                        address: user.Address,
                    };

                    this.setState({
                        users: UsersList,
                        isLoading: false,
                        displayEditDialog: false
                    });
                    this.onReset();
                }
            })
            .catch((error) => {
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while creating Instituition' });
                this.setState({ isLoading: false });
            })
    }

    validateForm = () => {
        let error = "";

        if (error !== '') {
            this.setState({ isValidForm: false, error: error })
            return false;
        }
        else {
            this.setState({ isValidForm: true, error: null })
            return true;
        }
    }

    onAddUser = (e) => {
        this.setState({ isLoading: true });
        let result = this.validateForm();
        if (result !== false) {
            this.saveUser();
        }
    }
    onEditUser = (e) => {
        this.setState({ isLoading: true });
        let result = this.validateForm();
        if (result !== false) {
            this.editUser();
        }
    }

    onReset() {
        this.setState({ name: '', email: '', type: '', address: '', isTypeValid: true });
    }

    EditMode(user) {
        if (user) {
            this.setState({
                selectedUserId: user.id,
                name: user.name,
                email: user.email,
                type: user.type,
                address: user.address,
                displayEditDialog: true,
            })
        }
    }
    AddNew() {
        this.setState({ name: '', email: '', type: '', address: '', isTypeValid: true }, () => {
            this.setState({ displayCreateDialog: true })
        });
    }

    actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-success p-mr-2"
                    onClick={() => this.EditMode(rowData)} />
                <Button icon="pi pi-trash" style={{ float: 'right' }} className="p-button-rounded p-button-danger"
                    onClick={() => this.deleteUser(rowData.id)} />
            </React.Fragment>
        );
    }

    render() {
        const { users, loading } = this.state;
        const header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="20" />
            </div>
            <div className="col-sm-4 col-md-2 col-lg-2" style={{ position: 'absolute', right: 0 }}>
                <Button className="p-button-info" icon="pi pi-plus" iconPos="left" label="Add"
                    onClick={() => this.AddNew()} />
            </div>
        </div>

        return (
            <div>
                <Growl ref={(el) => this.growl = el}></Growl>
                <ContextMenu model={this.menuModel} ref={el => this.cm = el} onHide={() => this.setState({ selectedUser: null })} />
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Instituition List</h1>
                        <div className="content-section implementation">
                            <DataTable header={header} value={users} globalFilter={this.state.globalFilter}
                            >
                                <Column field="name" header="Name" sortable={true} />
                                <Column field="email" header="Email" sortable={true} />
                                <Column field="address" header="address" sortable={true} />
                                <Column field="type" header="Type" sortable={true} />
                                <Column header="Action" body={this.actionBodyTemplate}></Column>
                            </DataTable>
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ paddingTop: '20px' }}>
                                {loading === true ?
                                    <div>
                                        <p style={{ textAlign: 'center', fontSize: '20px' }}>Loading Data </p>
                                        <ProgressBar style={{ marginTop: '40px', height: '2px' }} mode="indeterminate" />
                                    </div>
                                    : null
                                }{this.state.error ?
                                    <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ color: 'red', whiteSpace: "pre-wrap" }}>
                                        {this.state.error}
                                    </div> : null
                                }

                            </div>
                            <Dialog visible={this.state.displayDeleteDialog} width="400px" header="You sure to delete this Instituition?"
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

                            <Dialog style={{ width: '50vw' }} visible={this.state.displayCreateDialog} header="Create New Instituition"
                                modal={true} onHide={() => this.setState({ displayCreateDialog: false })}
                                contentStyle={{ minHeight: "350px", maxHeight: "550px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid" >
                                        <div className="card card-w-title">
                                            <div className="p-grid ">
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Name" Type="text" IsRequired={true}
                                                            Value={this.state.name}
                                                            onChange={(val) => this.setState({ name: val })} />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Email" Type="email" IsRequired={true}
                                                            Value={this.state.email}
                                                            onChange={(val) => this.setState({ email: val })} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Type: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isTypeValid === true ? {} : errorBoxForCheckBox}>
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">SCHREIBEN</span>
                                                                <RadioButton value="SCHREIBEN" name="Type"
                                                                    onChange={(e) => this.setState({ type: e.value })}
                                                                    checked={this.state.type === 'SCHREIBEN'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">SPRACHEN</span>
                                                                <RadioButton value="SPRACHEN" name="Type"
                                                                    onChange={(e) => this.setState({ type: e.value })}
                                                                    checked={this.state.type === 'SPRACHEN'} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Address" Type="text" IsRequired={true}
                                                            Value={this.state.address}
                                                            onChange={(val) => this.setState({ address: val })} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                    {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12" style={{ color: 'red', whiteSpace: "pre-wrap" }}>
                                                    {(this.state.isValidForm === false || this.state.error) ? this.state.error : ''}
                                                </div>
                                                <div className="row" style={{ marginTop: 15, justifyContent: 'right' }}>
                                                    <div className="col-sm-4 col-md-2 col-lg-2">
                                                        <span className="ui-float-label">
                                                            <Button label="Reset" className="p-button-secondary " disabled={this.state.isLoading} onClick={() => this.onReset()} />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-4 col-md-2 col-lg-2" style={{ float: 'right' }}>
                                                        <span className="ui-float-label">
                                                            <Button label="Save" className="p-button-primary ui-btns" disabled={this.state.isLoading} onClick={(e) => this.onAddUser(e)} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Dialog>

                            <Dialog style={{ width: '50vw' }} visible={this.state.displayEditDialog} header="Edit Instituition"
                                modal={true} onHide={() => this.setState({ displayEditDialog: false })}
                                contentStyle={{ minHeight: "350px", maxHeight: "550px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid" >
                                        <div className="card card-w-title">
                                            <div className="p-grid ">
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Name" Type="text" IsRequired={true}
                                                            Value={this.state.name}
                                                            onChange={(val) => this.setState({ name: val })} />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Email" Type="email" IsRequired={true}
                                                            Value={this.state.email} ReadOnly={true}
                                                            onChange={(val) => this.setState({ email: val })} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Type: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isTypeValid === true ? {} : errorBoxForCheckBox}>
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">SCHREIBEN</span>
                                                                <RadioButton value="SCHREIBEN" name="Type"
                                                                    onChange={(e) => this.setState({ type: e.value })}
                                                                    checked={this.state.type === 'SCHREIBEN'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">SPRACHEN</span>
                                                                <RadioButton value="SPRACHEN" name="Type"
                                                                    onChange={(e) => this.setState({ type: e.value })}
                                                                    checked={this.state.type === 'SPRACHEN'} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Address" Type="text" IsRequired={true}
                                                            Value={this.state.address}
                                                            onChange={(val) => this.setState({ address: val })} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                    {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12" style={{ color: 'red', whiteSpace: "pre-wrap" }}>
                                                    {(this.state.isValidForm === false || this.state.error) ? this.state.error : ''}
                                                </div>
                                                <div className="row" style={{ marginTop: 15, justifyContent: 'right' }}>
                                                    <div className="col-sm-4 col-md-2 col-lg-2">
                                                        <span className="ui-float-label">
                                                            <Button label="Reset" className="p-button-secondary " disabled={this.state.isLoading} onClick={(e) => this.onReset(e)} />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-4 col-md-2 col-lg-2" style={{ float: 'right' }}>
                                                        <span className="ui-float-label">
                                                            <Button label="Update" className="p-button-primary ui-btns" disabled={this.state.isLoading} onClick={(e) => this.onEditUser(e)} />
                                                        </span>
                                                    </div>
                                                </div>
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

export default InstitutionList;