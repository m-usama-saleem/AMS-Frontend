import React, { Component } from 'react';
import * as ROLES from '../../constants/roles'
import { UserService } from '../../api/user';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';

import { InputText } from 'primereact/inputtext';
import AMSInputField from '../Common/AMSInputField';

class AppUsers extends Component {
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
            ValidPassword: false,
            ValidName: false,
            ValidEmail: false,
            error: '',
            CheckFields: false
        };
        this.userSerivce = new UserService();

        this.deleteUser = this.deleteUser.bind(this);
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.userSerivce
            .AppUserList()
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
                this.growl.show({ severity: 'error', summary: 'Fehler', detail: error });
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
            this.userSerivce.DeleteAppUser(id).then(() => {
                var list = this.state.users.filter(x => x.id !== id)
                this.growl.show({ severity: 'success', summary: 'Erfolg', detail: 'Benutzer erfolgreich entfernt' });
                this.setState({
                    users: [...list],
                    displayDeleteDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayDeleteDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Fehler', detail: error });
                });
        }
    }

    saveUser = () => {
        let user = {
            Name: this.state.name,
            Email: this.state.email,
            Password: this.state.password,
            Type: "Admin",
            Status: "Active",
            CreatedAt: new Date(),
            CreatedBy: this.props.authUser.id
        }
        this.userSerivce
            .AddAppUser(user)
            .then((data) => {
                if (data.success == true) {
                    this.growl.show({ severity: 'success', summary: 'Erfolg', detail: 'Benutzer erfolgreich erstellt' });
                    var savedUser = data.user;
                    this.setState({
                        users: [...this.state.users, savedUser],
                        isLoading: false,
                        displayCreateDialog: false
                    });
                    this.onReset();
                }
                else {
                    this.growl.show({
                        severity: "error",
                        summary: "Fehler",
                        detail: data.message,
                    });
                    this.setState({
                        isLoading: false,
                    });
                }
            })
            .catch((error) => {
                this.growl.show({ severity: 'error', summary: 'Fehler', detail: 'Fehler: beim Benutzer erstellen' });
                this.setState({ isLoading: false });
            })
    }

    editUser = () => {
        let user = {
            Id: this.state.selectedUserId,
            Name: this.state.name,
            Email: this.state.email,
            Type: "Admin",
            Status: "Active",
            Password: this.state.password,
            CreatedBy: this.props.authUser.id
        }
        this.userSerivce
            .EditAppUser(user)
            .then((data) => {
                if (data.success == true) {
                    this.growl.show({ severity: 'success', summary: 'Erfolg', detail: 'Benutzer erfolgreich aktualisiert' });
                    var UsersList = this.state.users;

                    var ind = UsersList.findIndex(x => x.id == user.Id);
                    UsersList[ind] = {
                        id: user.Id,
                        name: user.Name,
                        email: user.Email,
                        type: "Admin",
                        password: user.Password,
                    };

                    this.setState({
                        users: UsersList,
                        isLoading: false,
                        displayEditDialog: false
                    });
                    this.onReset();
                }
                else {
                    this.growl.show({
                        severity: "error",
                        summary: "Fehler",
                        detail: data.message,
                    });
                    this.setState({
                        isLoading: false,
                    });
                }
            })
            .catch((error) => {
                this.growl.show({ severity: 'error', summary: 'Fehler', detail: 'Fehler: beim Benutzer aktualisieren' });
                this.setState({ isLoading: false });
            })
    }

    validateForm() {
        return new Promise((resolve, reject) => {
            this.setState({ CheckFields: true },
                () => {
                    this.setState({ abc: 0 }, () => {
                        const { ValidEmail, ValidName, ValidPassword } = this.state
                        if (ValidEmail == true && ValidName == true && ValidPassword == true) {
                            resolve(true);
                        }
                        resolve(false);
                    })
                });
        })
    }

    onAddUser = (e) => {
        this.setState({ isLoading: true, CheckFields: false }, () => {
            this.validateForm().then(result => {
                if (result !== false) {
                    this.saveUser();
                }
                else {
                    this.growl.show({ severity: 'error', summary: 'Fehler', detail: 'Fehler: beim Benutzer erstellen' });
                    this.setState({ isLoading: false });
                }
            });
        });
    }

    onEditUser = (e) => {
        this.setState({ isLoading: true, CheckFields: false }, () => {
            this.validateForm().then(result => {
                if (result !== false) {
                    this.editUser();
                }
                else {
                    this.growl.show({ severity: 'error', summary: 'Fehler', detail: 'Fehler: beim Benutzer aktualisieren' });
                    this.setState({ isLoading: false });
                }
            });
        });
    }

    onReset() {
        this.setState({
            name: '', email: '', type: '', password: '', CheckFields: false,
            ValidPassword: false,
            ValidName: false,
            ValidEmail: false,
        });
    }

    EditMode(user) {
        if (user) {
            this.setState({
                selectedUserId: user.id,
                name: user.name,
                email: user.email,
                type: "Admin",
                password: user.password,
                displayEditDialog: true,
            })
        }
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

    AddNew() {
        this.setState({ displayCreateDialog: true }, () => this.onReset())
    }

    dblClickAppointment = (e) => {
        this.EditMode(e.data)
    }

    render() {
        const { users, loading } = this.state;
        const header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Suche" size="20" />
            </div>
            <div className="col-sm-4 col-md-2 col-lg-2" style={{ position: 'absolute', right: 0 }}>
                <Button className="p-button-info" icon="pi pi-plus" iconPos="left" label="hinzufügen"
                    onClick={(e) => this.AddNew()} />
            </div>
        </div>

        return (
            <div>
                <Toast ref={(el) => this.growl = el} />
                <ContextMenu model={this.menuModel} ref={el => this.cm = el} onHide={() => this.setState({ selectedUser: null })} />
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Nutzerliste</h1>
                        <div className="content-section implementation">
                            <DataTable header={header} value={users} globalFilter={this.state.globalFilter}
                                onRowDoubleClick={this.dblClickAppointment} responsive={true}
                                selection={this.state.selectedUser}
                                onSelectionChange={e => this.setState({ selectedUser: e.value })}
                                style={{ fontSize: 12 }}
                            >
                                <Column field="name" header="Name" sortable={true} />
                                <Column field="email" header="E-Mail" sortable={true} />
                                <Column header="Aktion" body={this.actionBodyTemplate}></Column>
                            </DataTable>
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ paddingTop: '20px' }}>
                                {loading === true ?
                                    <div>
                                        <p style={{ textAlign: 'center', fontSize: '20px' }}>Daten laden </p>
                                        <ProgressBar style={{ marginTop: '40px', height: '2px' }} mode="indeterminate" />
                                    </div>
                                    : null
                                }{this.state.error ?
                                    <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ color: 'red', whiteSpace: "pre-wrap" }}>
                                        {this.state.error}
                                    </div> : null
                                }

                            </div>
                            <Dialog visible={this.state.displayDeleteDialog} width="400px" header="Benutzer wirklich löschen??"
                                modal={true} onHide={() => this.setState({ displayDeleteDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix" style={{ textAlign: 'center' }}>
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

                            <Dialog style={{ width: '50vw' }} visible={this.state.displayCreateDialog} header="Neuen Benutzer erstellen"
                                modal={true} onHide={() => this.setState({ displayCreateDialog: false }, () => this.onReset())}
                                contentStyle={{ minHeight: "350px", maxHeight: "550px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid" >
                                        <div className="card card-w-title">
                                            <div className="p-grid ">
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Name" Type="text" IsRequired={true}
                                                            Value={this.state.name}
                                                            onChange={(val) => this.setState({ name: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidName: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="E-Mail" Type="email" IsRequired={true}
                                                            Value={this.state.email}
                                                            onChange={(val) => this.setState({ email: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidEmail: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Passwort" Type="password" IsRequired={true}
                                                            Value={this.state.password}
                                                            onChange={(val) => this.setState({ password: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidPassword: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                    {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12" style={{ color: 'red', whiteSpace: "pre-wrap" }}>
                                                    {(this.state.isValidForm === false || this.state.error) ? this.state.error : ''}
                                                </div>
                                                <div className="row" style={{ marginTop: 15, justifyContent: 'right' }}>
                                                    <div className="col-sm-4 col-md-3 col-lg-3">
                                                        <span className="ui-float-label">
                                                            <Button label="Zurücksetzen" className="p-button-secondary " disabled={this.state.isLoading} onClick={(e) => this.onReset()} />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-4 col-md-3 col-lg-3" style={{ float: 'right' }}>
                                                        <span className="ui-float-label">
                                                            <Button label="Speichern" className="p-button-primary ui-btns" disabled={this.state.isLoading} onClick={(e) => this.onAddUser(e)} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Dialog>

                            <Dialog style={{ width: '50vw' }} visible={this.state.displayEditDialog} header="Nutzer bearbeiten"
                                modal={true} onHide={() => this.setState({ displayEditDialog: false }, () => this.onReset())}
                                contentStyle={{ minHeight: "350px", maxHeight: "550px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid" >
                                        <div className="card card-w-title">
                                            <div className="p-grid ">
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Name" Type="text" IsRequired={true}
                                                            Value={this.state.name}
                                                            onChange={(val) => this.setState({ name: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidName: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="E-Mail" Type="email" IsRequired={true}
                                                            Value={this.state.email}
                                                            onChange={(val) => this.setState({ email: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidEmail: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Passwort" Type="password" IsRequired={true}
                                                            Value={this.state.password}
                                                            onChange={(val) => this.setState({ password: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidPassword: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                    {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-lg-12" style={{ color: 'red', whiteSpace: "pre-wrap" }}>
                                                    {(this.state.isValidForm === false || this.state.error) ? this.state.error : ''}
                                                </div>
                                                <div className="row" style={{ marginTop: 15, justifyContent: 'right' }}>
                                                    <div className="col-sm-4 col-md-3 col-lg-3">
                                                        <span className="ui-float-label">
                                                            <Button label="Zurücksetzen" className="p-button-secondary " disabled={this.state.isLoading} onClick={(e) => this.onReset(e)} />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-4 col-md-3 col-lg-3" style={{ float: 'right' }}>
                                                        <span className="ui-float-label">
                                                            <Button label="Aktualisieren" className="p-button-primary ui-btns" disabled={this.state.isLoading} onClick={(e) => this.onEditUser(e)} />
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

export default AppUsers;