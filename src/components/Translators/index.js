import React, { Component } from 'react';
import * as ROLES from '../../constants/roles'
import { UserService } from '../../api/user';
import { DataTable } from 'primereact/datatable';
// import { Growl } from 'primereact/growl';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import Select from 'react-select'

import { InputText } from 'primereact/inputtext';
import { Genders, Languages } from '../../constants/staticValues';
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
const normalBoxForDDL = {
    border: '1px solid white', borderRadius: '3px'
};
const errorBoxForDDL = {
    border: '1px solid red', borderRadius: '3px'
};


class TranslatorList extends Component {
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
            CheckFields: false
        };
        this.userSerivce = new UserService();

        this.deleteUser = this.deleteUser.bind(this);
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.userSerivce
            .TranslatorList()
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
            this.userSerivce.DeleteTranslator(id).then(() => {
                var list = this.state.users.filter(x => x.id !== id)
                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Translator Deleted Successfully' });
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
        var lngNames = "";
        this.state.SelectedLanguageName.forEach(x => { lngNames += x.value + "," });

        let user = {
            Email: this.state.email,
            Type: this.state.type,
            Language: lngNames,
            CreatedAt: new Date(),
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Contact: this.state.contact,
            Address: this.state.address,
            City: this.state.city,
            PostCode: this.state.postCode,
            Country: this.state.country,
            Gender: this.state.SelectedGender && this.state.SelectedGender.value ? this.state.SelectedGender.value : "",

            CreatedBy: this.props.authUser.id
        }
        this.userSerivce
            .AddTranslator(user)
            .then((data) => {
                if (data.success == true) {
                    this.growl.show({ severity: 'success', summary: 'Success', detail: 'Translator Created' });
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
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while creating Translator' });
                this.setState({ isLoading: false });
            })
    }

    editUser = () => {
        var lngNames = "";
        this.state.SelectedLanguageName.forEach(x => { lngNames += x.value + "," });

        let user = {
            Id: this.state.selectedUserId,
            Email: this.state.email,
            Type: this.state.type,
            Language: lngNames,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Contact: this.state.contact,
            Address: this.state.address,
            City: this.state.city,
            PostCode: this.state.postCode,
            Country: this.state.country,
            Gender: this.state.SelectedGender && this.state.SelectedGender.value ? this.state.SelectedGender.value : "",
            CreatedBy: this.props.authUser.id
        }
        this.userSerivce
            .EditTranslator(user)
            .then((data) => {
                if (data.success == true) {
                    this.growl.show({ severity: 'success', summary: 'Success', detail: 'Translator Updated' });
                    var UsersList = this.state.users;
                    var ind = UsersList.findIndex(x => x.id == user.Id);
                    UsersList[ind] = {
                        id: user.Id,
                        email: user.Email,
                        type: user.Type,
                        firstName: user.FirstName,
                        lastName: user.LastName,
                        contact: user.Contact,
                        address: user.Address,
                        city: user.City,
                        postCode: user.PostCode,
                        country: user.Country,
                        gender: user.Gender,
                        language: user.Language,
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
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while creating Translator' });
                this.setState({ isLoading: false });
            })
    }

    validateForm() {
        return new Promise((resolve, reject) => {
            this.setState({ CheckFields: true },
                () => {
                    this.setState({ abc: 0 }, () => {
                        const { ValidFirstName, ValidLastName, ValidEmail } = this.state
                        let error = "";
                        if (!this.state.SelectedLanguageName || this.state.SelectedLanguageName === "" || this.state.SelectedLanguageName == undefined || this.state.SelectedLanguageName.length <= 0) {
                            this.setState({ ValidLanguage: false });
                            error += "Language cannot be empty \n";
                        } else { this.setState({ ValidLanguage: true }); }

                        if (this.state.type.trim() === '') {
                            this.setState({ isTypeValid: false });
                            error += "Type cannot be empty \n";
                        } else { this.setState({ isTypeValid: true }); }

                        if (ValidFirstName == true && ValidLastName == true && ValidEmail == true && error == "") {
                            resolve(true);
                        }
                        resolve(false);
                    });
                });
        })
    }

    onAddUser = (e) => {
        this.setState({ isLoading: true });
        this.validateForm().then(result => {
            if (result !== false) {
                this.saveUser();
            }
            else {
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while creating Translator' });
                this.setState({ isLoading: false });
            }
        });
    }

    onEditUser = (e) => {
        this.setState({ isLoading: true });
        this.validateForm().then(result => {
            if (result !== false) {
                this.editUser();
            }
            else {
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while updating Translator' });
                this.setState({ isLoading: false });
            }
        });
    }

    onReset() {
        this.setState({
            email: '', type: '', SelectedLanguageName: [], SelectedGender: '',
            firstName: '', lastName: '', contact: '',
            address: '', city: '', postCode: '', country: '',
            gender: '',
            isTypeValid: true,
            ValidLanguage: true,
            CheckFields: false
        });
    }
    onLanguageSelected(obj) {
        this.setState({ SelectedLanguageName: obj })
    }
    onGenderSelected(obj) {
        this.setState({ SelectedGender: obj })
    }

    EditMode(user) {
        const selectedLanguages = [];
        var langList = user.language.split(',');
        langList.forEach(name => {
            var langInd = Languages.findIndex(x => x.value == name)
            if (langInd != -1) {
                selectedLanguages.push(Languages[langInd]);
            }
        })
        const genderId = Genders.findIndex(x => x.value == user.gender)
        if (user) {
            this.setState({
                selectedUserId: user.id,
                email: user.email,
                type: user.type,
                firstName: user.firstName,
                lastName: user.lastName,
                contact: user.contact,
                address: user.address,
                city: user.city,
                postCode: user.postCode,
                country: user.country,
                gender: user.gender,
                SelectedLanguageName: selectedLanguages,
                SelectedGender: Genders[genderId],
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
        this.setState({
            name: '', email: '', type: '', SelectedLanguageName: [], SelectedGender: '',
            firstName: '', lastName: '', contact: '',
            address: '', city: '', postCode: '', country: '',
            gender: '', isTypeValid: true, CheckFields: false
        }, () => {
            this.setState({ displayCreateDialog: true })
        });
    }
    dblClickAppointment = (e) => {
        this.EditMode(e.data)
    }
    render() {
        const { users, loading } = this.state;
        const header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="20" />
            </div>
            <div className="col-sm-4 col-md-2 col-lg-2" style={{ position: 'absolute', right: 0 }}>
                <Button className="p-button-info" icon="pi pi-plus" iconPos="left" label="Add"
                    onClick={(e) => this.AddNew()} />
            </div>
        </div>

        const langList = Languages
        const genderList = Genders

        return (
            <div>
                {/* <Growl ref={(el) => this.growl = el}></Growl> */}
                <ContextMenu model={this.menuModel} ref={el => this.cm = el} onHide={() => this.setState({ selectedUser: null })} />
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Translaotrs List</h1>
                        <div className="content-section implementation">
                            <DataTable header={header} value={users} globalFilter={this.state.globalFilter}
                                onRowDoubleClick={this.dblClickAppointment} responsive={true}
                                selection={this.state.selectedUser}
                                onSelectionChange={e => this.setState({ selectedUser: e.value })}
                            >
                                <Column field="firstName" header="Name" sortable={true} />
                                <Column field="email" header="Email" sortable={true} />
                                <Column field="type" header="Type" sortable={true} />
                                <Column field="language" header="Languages" sortable={true} />
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
                            <Dialog visible={this.state.displayDeleteDialog} width="400px" header="You sure to delete this Translator?"
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

                            <Dialog style={{ width: '50vw' }} visible={this.state.displayCreateDialog} header="Create New Translator"
                                modal={true} onHide={() => this.setState({ displayCreateDialog: false }, () => this.onReset())}
                                contentStyle={{ minHeight: "350px", maxHeight: "550px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid" >
                                        <div className="card card-w-title">
                                            <div className="p-grid ">
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="First Name" Type="text" IsRequired={true}
                                                            Value={this.state.firstName}
                                                            onChange={(val) => this.setState({ firstName: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidFirstName: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Last Name" Type="text" IsRequired={true}
                                                            Value={this.state.lastName}
                                                            onChange={(val) => this.setState({ lastName: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidLastName: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Email" Type="email" IsRequired={true}
                                                            Value={this.state.email}
                                                            onChange={(val) => this.setState({ email: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidEmail: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginBottom: 15 }}>
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
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={this.state.ValidLanguage === false ? errorBoxForDDL : normalBoxForDDL}>
                                                        <span className="ui-float-label" >
                                                            <label htmlFor="float-input">Language<span style={{ color: 'red' }}>*</span></label>
                                                            <Select isMulti={true}
                                                                value={this.state.SelectedLanguageName}
                                                                onChange={(e) => this.onLanguageSelected(e)}
                                                                options={langList}
                                                                maxMenuHeight={150}
                                                            />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Gender</label>
                                                            <Select
                                                                value={this.state.SelectedGender}
                                                                onChange={(e) => this.onGenderSelected(e)}
                                                                options={genderList}
                                                                maxMenuHeight={150}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Contact" Type="text"
                                                            Value={this.state.contact}
                                                            onChange={(val) => this.setState({ contact: val })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Address" Type="text"
                                                            Value={this.state.address}
                                                            onChange={(val) => this.setState({ address: val })}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Postcode" Type="text"
                                                            Value={this.state.postCode}
                                                            onChange={(val) => this.setState({ postCode: val })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="City" Type="text"
                                                            Value={this.state.city}
                                                            onChange={(val) => this.setState({ city: val })}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Country" Type="text"
                                                            Value={this.state.country}
                                                            onChange={(val) => this.setState({ country: val })}
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
                                                    <div className="col-sm-4 col-md-2 col-lg-2">
                                                        <span className="ui-float-label">
                                                            <Button label="Reset" className="p-button-secondary " disabled={this.state.isLoading} onClick={(e) => this.onReset()} />
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

                            <Dialog style={{ width: '50vw' }} visible={this.state.displayEditDialog} header="Edit Translator"
                                modal={true} onHide={() => this.setState({ displayEditDialog: false }, () => this.onReset())}
                                contentStyle={{ minHeight: "350px", maxHeight: "550px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid" >
                                        <div className="card card-w-title">
                                            <div className="p-grid ">
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="First Name" Type="text" IsRequired={true}
                                                            Value={this.state.firstName}
                                                            onChange={(val) => this.setState({ firstName: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidFirstName: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Last Name" Type="text" IsRequired={true}
                                                            Value={this.state.lastName}
                                                            onChange={(val) => this.setState({ lastName: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidLastName: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Email" Type="email" IsRequired={true}
                                                            Value={this.state.email}
                                                            onChange={(val) => this.setState({ email: val })}
                                                            ChangeIsValid={(val) => this.setState({ ValidEmail: val })}
                                                            CheckField={this.state.CheckFields}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginBottom: 15 }}>
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
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Language<span style={{ color: 'red' }}>*</span></label>
                                                            <Select isMulti={true}
                                                                value={this.state.SelectedLanguageName}
                                                                onChange={(e) => this.onLanguageSelected(e)}
                                                                options={langList}
                                                                maxMenuHeight={150}
                                                            />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Gender</label>
                                                            <Select
                                                                value={this.state.SelectedGender}
                                                                onChange={(e) => this.onGenderSelected(e)}
                                                                options={genderList}
                                                                maxMenuHeight={150}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Contact" Type="text"
                                                            Value={this.state.contact}
                                                            onChange={(val) => this.setState({ contact: val })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Address" Type="text"
                                                            Value={this.state.address}
                                                            onChange={(val) => this.setState({ address: val })}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Postcode" Type="text"
                                                            Value={this.state.postCode}
                                                            onChange={(val) => this.setState({ postCode: val })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row" style={{ marginBottom: 15 }}>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="City" Type="text"
                                                            Value={this.state.city}
                                                            onChange={(val) => this.setState({ city: val })}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6">
                                                        <AMSInputField Label="Country" Type="text"
                                                            Value={this.state.country}
                                                            onChange={(val) => this.setState({ country: val })}
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

export default TranslatorList;