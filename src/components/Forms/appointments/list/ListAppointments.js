import React, { Component } from 'react';

import { withAuthorization } from '../../../Session';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
//import {DataTableCrudDoc} from 'primereact/datatablecruddoc';
import { Growl } from 'primereact/growl';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import DatePicker from "react-datepicker";
import TimePicker from '../../../timepicker';
import { RadioButton } from 'primereact/radiobutton';
import Select from 'react-select'

import "react-datepicker/dist/react-datepicker.css";
import AppointmentService from '../../../../api/appointments/appointmentservice';
import * as ROLES from '../../../../constants/roles';
import AMSInputField from '../../../Common/AMSInputField';
import { Languages, ListAppointmentType } from '../../../../constants/staticValues';

const errorBox = {
    borderRadius: '3px', borderColor: 'rgba(242, 38, 19, 1)'
};
const normalBox = {
    border: '1px solid #a6a6a6'
};
const errorBoxForCheckBox = {
    border: '1px solid red', borderRadius: '3px'
};

const INITIAL_STATE = {
    Id: 0,
    AppointmentId: '',
    TranslatorNames: [],
    SelectedTranslatorName: '',
    langList: [],
    SelectedLanguageName: '',
    InstituteNames: [],
    SelectedInstituteName: '',
    EntryDate: new Date(),
    AppointmentDate: '',
    Type: '',
    Attachments: '',
    files: [],

    displayDeleteDialog: false,
    displayApproveDialog: false,
    disableFields: false,
    disableDeleteButton: true,
    disableApproveButton: true,
    displayCreateDialog: false,

    ValidAppointmentId: false,
    ValidInstitute: false,
    ValidLanguage: false,
    ValidTranslator: false,

    isAppointmentDateValid: true,
    isTypeValid: true,
    CheckFields: false,
    AllAppointments: [],
    AllInstitutions: [],
    AllTranslators: []
}

class ListAppointments extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.service = new AppointmentService();
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
    }

    getLists() {
        this.getAppointmentList();
        this.service.GetInstitutions().then(data => {
            this.setState({ AllInstitutions: data })
        })
        this.service.GetTranslators().then(data => {
            this.setState({ AllTranslators: data })
        })

    }

    componentDidMount() {
        this.getLists();
    }

    getAppointmentList() {
        this.service.GetAllIncomplete().then(data => {
            if (data && data !== "" && data.length > 0) {
                data.forEach(x => x.appointmentDate = new Date(x.appointmentDate).toLocaleDateString())
                this.setState({ AllAppointments: data })
            }
        })
            .catch(err => {
                this.growl.show({ severity: 'error', summary: 'Error', detail: err });
            })
    }

    validateForm() {
        return new Promise((resolve, reject) => {
            this.setState({ CheckFields: true },
                () => {
                    this.setState({ abc: 0 }, () => {

                        const { ValidAppointmentId, ValidInstitute, ValidTranslator, ValidLanguage } = this.state
                        let error = "";

                        if (!this.state.SelectedAppointmentDate || (this.state.SelectedAppointmentDate && this.state.SelectedAppointmentDate.toString().trim() === '')) {
                            this.setState({ isAppointmentDateValid: false });
                            error += "Appointment Date cannot be empty \n";
                        } else { this.setState({ isAppointmentDateValid: true }); }

                        if (this.state.Type.trim() === '') {
                            this.setState({ isTypeValid: false });
                            error += "Type cannot be empty \n";
                        } else { this.setState({ isTypeValid: true }); }


                        if (ValidAppointmentId == true && ValidInstitute == true &&
                            ValidTranslator == true && ValidLanguage == true && error === "") {
                            resolve(true);
                        }
                        resolve(false);
                    });
                });
        })
    }

    resetForm = () => {
        this.setState({
            selectedAppointmentId: '',
            Id: '',
            AppointmentId: '',
            SelectedTranslatorName: '',
            SelectedInstituteName: '',
            SelectedLanguageName: '',
            EntryDate: new Date(),
            AppointmentDate: '',
            Attachments: '',
            files: [],
            Type: '',
            SelectedAppointmentDate: '',
            AttachmentFiles: '',

            isTypeValid: true,

            disableFields: false,
            displayDeleteDialog: false,
            displayApproveDialog: false,
            disableDeleteButton: true,
            disableApproveButton: true,
            displayCreateDialog: false,

        }, () => {
            // this.getLists();
        })
    }

    dblClickAppointment = (e) => {
        this.editMode(e.data)
    }

    onSaveAppointment() {
        this.setState({ isLoading: true });
        this.validateForm().then(result => {
            if (result !== false) {
                this.SaveAppointment();
            }
            else {
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while creating Appointment' });
                this.setState({ isLoading: false });
            }
        });
    }

    SaveAppointment() {
        const { AppointmentId, Type, SelectedTranslatorName, SelectedInstituteName, SelectedLanguageName, SelectedAppointmentDate } = this.state
        let app = {
            AppointmentId,
            Type,
            EntryDate: new Date(),
            TranslatorId: SelectedTranslatorName.value,
            TranslatorName: SelectedTranslatorName.label,
            InstitutionId: SelectedInstituteName.value,
            InstitutionName: SelectedInstituteName.label,
            AppointmentDate: SelectedAppointmentDate,
            Language: SelectedLanguageName.value,
            Status: 'Pending',
            CreatedBy: this.props.authUser.id
        }

        var filesArray = this.state.files;

        if (filesArray && filesArray.length > 0) {

            let f = new FormData();
            f = new FormData();
            filesArray.forEach(element => {
                f.append("File[]", element)
            });

            this.service.UploadFile(f).then((fileName) => {
                app.Attachments = fileName;

                this.service.Add(app)
                    .then((data) => {
                        if (data.success == true) {
                            var savedAppointment = data.appointment;
                            savedAppointment.appointmentDate = new Date(app.AppointmentDate).toLocaleDateString();
                            savedAppointment.translatorName = app.TranslatorName;
                            savedAppointment.institutionName = app.InstitutionName;

                            this.growl.show({ severity: 'success', summary: 'Success', detail: 'Appointment Created' });
                            this.setState({
                                AllAppointments: [...this.state.AllAppointments, savedAppointment],
                                isLoading: false,
                                displayCreateDialog: false
                            }, () => {
                                this.resetForm();
                            });

                        }
                    })
                    .catch((error) => {
                        this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while creating Appointment' });
                        this.setState({ isLoading: false });
                    })
            })
        }
        else {
            this.service.Add(app)
                .then((data) => {
                    if (data.success == true) {
                        var savedAppointment = data.appointment;
                        savedAppointment.translatorName = app.TranslatorName;
                        savedAppointment.institutionName = app.InstitutionName;
                        savedAppointment.appointmentDate = new Date(app.AppointmentDate).toLocaleDateString();

                        this.growl.show({ severity: 'success', summary: 'Success', detail: 'Appointment Created' });
                        this.setState({
                            AllAppointments: [...this.state.AllAppointments, savedAppointment],
                            isLoading: false,
                            displayCreateDialog: false
                        }, () => {
                            this.resetForm();
                        });
                    }
                })
                .catch((error) => {
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while creating Appointment' });
                    this.setState({ isLoading: false });
                })
        }

    }

    onEditAppointment() {
        this.setState({ isLoading: true });
        this.validateForm().then(result => {
            if (result !== false) {
                this.EditAppointment();
            }
            else {
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while editing Appointment' });
                this.setState({ isLoading: false });
            }
        })
    }

    EditAppointment() {
        const { selectedAppointmentId, AppointmentId, Type, SelectedTranslatorName, SelectedLanguageName,
            SelectedInstituteName, SelectedAppointmentDate, AttachmentFiles } = this.state

        let app = {
            Id: selectedAppointmentId,
            AppointmentId,
            Type,
            EntryDate: new Date(),
            TranslatorId: SelectedTranslatorName.value,
            TranslatorName: SelectedTranslatorName.label,
            InstitutionId: SelectedInstituteName.value,
            InstitutionName: SelectedInstituteName.label,
            Language: SelectedLanguageName.value,
            AppointmentDate: SelectedAppointmentDate,
            Status: 'Pending',
            CreatedBy: this.props.authUser.id,
            Attachments: AttachmentFiles
        }
        var filesArray = this.state.files;

        if (filesArray && filesArray.length > 0) {

            let f = new FormData();
            f = new FormData();
            filesArray.forEach(element => {
                f.append("File[]", element)
            });

            this.service.UploadFile(f).then((fileName) => {
                app.Attachments = fileName;

                this.service.Edit(app)
                    .then((data) => {
                        if (data.success == true) {
                            this.growl.show({ severity: 'success', summary: 'Success', detail: 'Appointment Updated' });

                            var editedAppointment = data.appointment;
                            editedAppointment.translatorName = app.TranslatorName;
                            editedAppointment.institutionName = app.InstitutionName;
                            editedAppointment.appointmentDate = new Date(app.AppointmentDate).toLocaleDateString();

                            var AllAppointments = this.state.AllAppointments;
                            var ind = AllAppointments.findIndex(x => x.id == editedAppointment.id);
                            AllAppointments[ind] = editedAppointment;

                            this.setState({
                                AllAppointments: AllAppointments,
                                isLoading: false,
                                displayEditDialog: false
                            }, () => {
                                this.resetForm();
                            });
                        }
                    })
                    .catch((error) => {
                        this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while updating Appointment' });
                        this.setState({ isLoading: false });
                    })
            });
        }
        else {
            this.service.Edit(app)
                .then((data) => {
                    if (data.success == true) {
                        this.growl.show({ severity: 'success', summary: 'Success', detail: 'Appointment Updated' });

                        var editedAppointment = data.appointment;
                        editedAppointment.translatorName = app.TranslatorName;
                        editedAppointment.institutionName = app.InstitutionName;
                        editedAppointment.appointmentDate = new Date(app.AppointmentDate).toLocaleDateString();

                        var AllAppointments = this.state.AllAppointments;
                        var ind = AllAppointments.findIndex(x => x.id == editedAppointment.id);
                        AllAppointments[ind] = editedAppointment;

                        this.setState({
                            AllAppointments: AllAppointments,
                            isLoading: false,
                            displayEditDialog: false
                        }, () => {
                            this.resetForm();
                        });
                    }
                })
                .catch((error) => {
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while updating Appointment' });
                    this.setState({ isLoading: false });
                })
        }
    }

    onTranslatorSelected(obj) {
        var LanguageSelection = [];
        const translator_languages = obj.languages.split(',');
        translator_languages.forEach(name => {
            var langInd = Languages.findIndex(x => x.value == name)
            if (langInd != -1) {
                LanguageSelection.push(Languages[langInd]);
            }
        })
        this.setState({
            SelectedTranslatorName: obj,
            langList: LanguageSelection
        })
    }

    setAppointmentDate(date) {
        this.setState({ SelectedAppointmentDate: date })
    }

    editMode(appointment) {
        const { AllTranslators, AllInstitutions } = this.state
        const transInd = AllTranslators.findIndex(x => x.value == appointment.translatorId)
        const instInd = AllInstitutions.findIndex(x => x.value == appointment.institutionId)
        const langId = Languages.findIndex(x => x.value == appointment.language)

        var LanguageSelection = [];
        const translator_languages = AllTranslators[transInd].languages.split(',');
        translator_languages.forEach(name => {
            var langInd = Languages.findIndex(x => x.value == name)
            if (langInd != -1) {
                LanguageSelection.push(Languages[langInd]);
            }
        })

        if (appointment) {
            this.setState({
                selectedAppointmentId: appointment.id,

                Id: appointment.id,
                AppointmentId: appointment.appointmentId,
                SelectedTranslatorName: AllTranslators[transInd],
                SelectedInstituteName: AllInstitutions[instInd],
                SelectedLanguageName: Languages[langId],
                Type: appointment.type,
                EntryDate: new Date(appointment.entryDate).toLocaleDateString(),
                SelectedAppointmentDate: new Date(appointment.appointmentDate),
                displayEditDialog: true,
                langList: LanguageSelection,
                AttachmentFiles: appointment.attachments
            })
        }
    }

    confirmDeleteAppointment(appointment) {
        if (appointment != undefined && appointment != null) {
            this.setState({
                displayDeleteDialog: true,
                selectedAppointmentId: appointment.id
            })
        }
    }
    confirmApproveAppointment(appointment) {
        if (appointment != undefined && appointment != null) {
            this.setState({
                displayApproveDialog: true,
                selectedAppointmentId: appointment.id
            })
        }
    }

    onApproveAppointment() {
        var id = this.state.selectedAppointmentId;
        this.setState({ loadingModel: true });
        if (id != undefined && id != null && id != 0) {
            this.service.Approve(id).then(() => {
                var AllAppointments = this.state.AllAppointments;
                var ind = AllAppointments.findIndex(x => x.id == id);
                AllAppointments[ind].status = "Approved";

                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Appointment Approved Successfully' });
                this.setState({
                    AllAppointments,
                    displayApproveDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayApproveDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error Approving Appointment' });
                });
        }
    }

    onDeleteAppointment() {
        var id = this.state.selectedAppointmentId;
        this.setState({ loadingModel: true });
        if (id != undefined && id != null && id != 0) {
            this.service.Delete(id).then(() => {
                var list = this.state.AllAppointments.filter(x => x.id !== id)
                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Appointment Deleted Successfully' });
                this.setState({
                    AllAppointments: [...list],
                    displayDeleteDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayDeleteDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error Deleting Appointment' });
                });
        }
    }

    actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-check" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-info p-mr-2"
                    onClick={() => this.confirmApproveAppointment(rowData)} title="Approve" />
                <Button icon="pi pi-pencil" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-success p-mr-2"
                    onClick={() => this.editMode(rowData)} title="Edit" />
                <Button icon="pi pi-trash" style={{ float: 'right' }} className="p-button-rounded p-button-danger"
                    onClick={() => this.confirmDeleteAppointment(rowData)} title="Delete" />
            </React.Fragment>
        );
    }

    onFileSelected = (event) => {
        const { target: { files } } = event;
        const filesToStore = [];

        [...files].map(file => {
            filesToStore.push(file)
        });

        this.setState({ files: filesToStore });
    }
    downloadFile(name) {
        this.service.downloadFile(name);
    }

    getEditAppointmentDialog() {

        const { langList, Status } = this.state;
        var EditAppointmentButton;

        if (Status !== "PartiallyCompleted") {
            EditAppointmentButton = <span className="ui-float-label" style={{ float: 'right' }}>
                <Button label="Update Appointment" className="ui-btns" disabled={this.state.isLoading} onClick={() => this.onEditAppointment()} />
            </span>
        }

        var AppointmentType = ListAppointmentType.map(obj =>
            <div key={obj.value} style={{ display: 'inline-block' }}>
                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">{obj.value}</span>
                <RadioButton value={obj.value} name="Type"
                    onChange={(e) => this.setState({ Type: e.value })}
                    checked={this.state.Type === obj.value} />
            </div>
        )

        var DownloadPhotos;
        if (this.state.AttachmentFiles && this.state.AttachmentFiles != "" && this.state.AttachmentFiles.split(',').length > 0) {
            DownloadPhotos = this.state.AttachmentFiles.split(',').map((x, ind) =>
                <div key={ind} >
                    <span onClick={() => { this.downloadFile(x) }} style={{ color: 'blue', cursor: 'pointer' }}>{x.split('_')[1]}</span>
                </div>
            )
        }

        return (
            <Dialog visible={this.state.displayEditDialog} style={{ width: '60vw' }} header="Appointment Information"
                modal={true} onHide={() => this.setState({ displayEditDialog: false }, () => this.resetForm())}
                contentStyle={{ maxHeight: "550px", overflow: "auto" }}>
                {
                    <div className="p-grid p-fluid">
                        <div className="card card-w-title">
                            <h1>Edit Appointment Information</h1>
                            <div className="p-grid" >
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Appointment ID" Type="text" IsRequired={true}
                                            Value={this.state.AppointmentId} PlaceholderText="Unique Appointment ID"
                                            onChange={(val) => this.setState({ AppointmentId: val })}
                                            ChangeIsValid={(val) => this.setState({ ValidAppointmentId: val })}
                                            CheckField={this.state.CheckFields}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Date</label>
                                            <InputText placeholderText="Select Date" value={this.state.EntryDate}
                                                type="text" size="30" disabled={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Institution Name" Type="ddl_select" IsRequired={true}
                                            Value={this.state.SelectedInstituteName} PlaceholderText="Select Institution"
                                            ItemsList={this.state.AllInstitutions}
                                            onChange={(val) => this.setState({ SelectedInstituteName: val })}
                                            CheckField={this.state.CheckFields}
                                            ChangeIsValid={(val) => this.setState({ ValidInstitute: val })}
                                        />
                                    </div>
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Appointment Date <span style={{ color: 'red' }}>*</span></label>
                                            <DatePicker dateFormat="dd/MM/yyyy" placeholderText="Select date for appointment"
                                                selected={this.state.SelectedAppointmentDate}
                                                onChange={date => this.setAppointmentDate(date)}
                                                className={this.state.isAppointmentDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"} />
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Translator Name" Type="ddl_select" IsRequired={true}
                                            Value={this.state.SelectedTranslatorName} PlaceholderText="Select Translator"
                                            ItemsList={this.state.AllTranslators}
                                            onChange={(val) => this.onTranslatorSelected(val)}
                                            CheckField={this.state.CheckFields}
                                            ChangeIsValid={(val) => this.setState({ ValidTranslator: val })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Language" Type="ddl_select" IsRequired={true}
                                            Value={this.state.SelectedLanguageName} PlaceholderText="Select Language"
                                            ItemsList={langList}
                                            onChange={(val) => this.setState({ SelectedLanguageName: val })}
                                            CheckField={this.state.CheckFields}
                                            ChangeIsValid={(val) => this.setState({ ValidLanguage: val })}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Type: <span style={{ color: 'red' }}>*</span></label>
                                            <div style={this.state.isTypeValid === true ? {} : errorBoxForCheckBox}>
                                                {AppointmentType}
                                            </div>
                                        </span>
                                    </div>
                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6" style={{ marginBottom: 20 }}>
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Attachments</label>
                                            <div>
                                                <input type="file" onChange={this.onFileSelected} multiple />
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6" style={{ marginBottom: 20 }}>
                                    <span className="ui-float-label">
                                        <label htmlFor="float-input">Download Attachments</label>
                                        <div>{DownloadPhotos}</div>
                                    </span>
                                </div>

                                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                                    {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                                </div>
                                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ color: 'red' }}>
                                    {this.state.error === true ? "Please fill all the required(red marked) fields" : null}
                                </div>
                                <div className="sm-4 md-2 lg-2">
                                    {EditAppointmentButton}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Dialog>
        )
    }

    getNewAppointmentDialog() {
        const { langList } = this.state;

        var AppointmentType = ListAppointmentType.map(obj =>
            <div key={obj.value} style={{ display: 'inline-block' }}>
                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">{obj.value}</span>
                <RadioButton value={obj.value} name="Type"
                    onChange={(e) => this.setState({ Type: e.value })}
                    checked={this.state.Type === obj.value} />
            </div>
        )

        return (
            <Dialog visible={this.state.displayCreateDialog} style={{ width: '60vw' }} header="Create New Appointment"
                modal={true} onHide={() => this.setState({ displayCreateDialog: false })}
                contentStyle={{ maxHeight: "550px", overflow: "auto", }}>
                {
                    <div className="p-grid p-fluid">
                        <div className="card card-w-title">
                            <h1>Appointment Information</h1>
                            <div className="p-grid" >
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Appointment ID" Type="text" IsRequired={true}
                                            Value={this.state.AppointmentId} PlaceholderText="Unique Appointment ID"
                                            onChange={(val) => this.setState({ AppointmentId: val })}
                                            CheckField={this.state.CheckFields}
                                            ChangeIsValid={(val) => this.setState({ ValidAppointmentId: val })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Date</label>
                                            <InputText placeholderText="Select Date" value={new Date().toLocaleDateString()} type="text" size="30" disabled={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Institution Name" Type="ddl_select" IsRequired={true}
                                            Value={this.state.SelectedInstituteName} PlaceholderText="Select Institution"
                                            ItemsList={this.state.AllInstitutions}
                                            onChange={(val) => this.setState({ SelectedInstituteName: val })}
                                            CheckField={this.state.CheckFields}
                                            ChangeIsValid={(val) => this.setState({ ValidInstitute: val })}
                                        />
                                    </div>
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Appointment Date <span style={{ color: 'red' }}>*</span></label>
                                            <DatePicker dateFormat="dd/MM/yyyy" placeholderText="Select date for appointment"
                                                selected={this.state.SelectedAppointmentDate}
                                                onChange={date => this.setAppointmentDate(date)}
                                                className={this.state.isAppointmentDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"} />
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Translator Name" Type="ddl_select" IsRequired={true}
                                            Value={this.state.SelectedTranslatorName} PlaceholderText="Select Translator"
                                            ItemsList={this.state.AllTranslators}
                                            onChange={(val) => this.onTranslatorSelected(val)}
                                            CheckField={this.state.CheckFields}
                                            ChangeIsValid={(val) => this.setState({ ValidTranslator: val })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Language" Type="ddl_select" IsRequired={true}
                                            Value={this.state.SelectedLanguageName} PlaceholderText="Select Language"
                                            ItemsList={langList}
                                            onChange={(val) => this.setState({ SelectedLanguageName: val })}
                                            CheckField={this.state.CheckFields}
                                            ChangeIsValid={(val) => this.setState({ ValidLanguage: val })}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Type: <span style={{ color: 'red' }}>*</span></label>
                                            <div style={this.state.isTypeValid === true ? {} : errorBoxForCheckBox}>
                                                {AppointmentType}
                                            </div>
                                        </span>
                                    </div>
                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6" style={{ marginBottom: 20 }}>
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Attachments</label>
                                            <div>
                                                <input type="file" onChange={this.onFileSelected} multiple />
                                            </div>
                                        </span>
                                    </div>
                                </div>

                                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                                    {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                                </div>
                                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ color: 'red' }}>
                                    {this.state.error === true ? "Please fill all the required(red marked) fields" : null}
                                </div>
                                <div className="sm-4 md-2 lg-2">
                                    <span className="ui-float-label" style={{ float: 'right' }}>
                                        <Button label="Create Appointment" className="ui-btns" disabled={this.state.isLoading} onClick={() => this.onSaveAppointment()} />
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                }
            </Dialog>
        )
    }
    onResetFields() {
        this.setState({
            selectedAppointmentId: '',
            Id: '',
            AppointmentId: '',
            SelectedInstituteName: '',
            SelectedTranslatorName: '',
            SelectedLanguageName: '',
            Type: '',
            EntryDate: '',
            SelectedAppointmentDate: '',
            AttachmentFiles: ''
        })
    }
    render() {
        var { disableFields, disableDeleteButton, disableApproveButton } = this.state
        var header;

        header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="20" />
            </div>
            <div className="col-sm-4 col-md-2 col-lg-2" style={{ position: 'absolute', right: 0 }}>
                <Button className="p-button-info" icon="pi pi-plus" iconPos="left" label="Add"
                    onClick={(e) => this.setState({ displayCreateDialog: true })} />
            </div>
        </div>

        var NewAppointmentDialog = this.getNewAppointmentDialog();
        var EditAppointmentDialog = this.getEditAppointmentDialog();

        return (
            <div>
                <Growl ref={(el) => this.growl = el}></Growl>
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Appointments List</h1>
                        <div className="p-grid" style={{ marginTop: '8px' }} ></div>
                        <div className="content-section implementation">
                            <DataTable ref={(el) => this.dt = el}
                                header={header} value={this.state.AllAppointments}
                                // paginator={this.state.isLoading === false} rows={15}
                                onRowDoubleClick={this.dblClickAppointment} responsive={true}
                                selection={this.state.selectedAppointment}
                                onSelectionChange={e => this.setState({ selectedAppointment: e.value })}
                                resizableColumns={true} columnResizeMode="fit" /*rowClassName={this.rowClass}*/
                                globalFilter={this.state.globalFilter}
                                sortField="appointmentDate" sortOrder={-1}
                                paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                dataKey="id"

                            >
                                <Column field="appointmentId" header="Appointment ID" sortable={true} />
                                <Column field="appointmentDate" header="Appointment Date" sortable={true} style={{ textAlign: 'center' }} />
                                <Column field="translatorName" header="Translator" sortable={true} />
                                <Column field="institutionName" header="Institution" sortable={true} />
                                <Column field="type" header="Type" sortable={true} />
                                <Column field="status" header="Status" sortable={true} />
                                <Column header="Action" body={this.actionBodyTemplate}></Column>
                            </DataTable>

                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ paddingTop: '20px' }}>
                                {this.state.isLoading === true ?
                                    <div>
                                        <p style={{ textAlign: 'center', fontSize: '20px' }}>Loading Data </p>
                                        <ProgressBar style={{ marginTop: '40px', height: '2px' }} mode="indeterminate" />
                                    </div>
                                    : null
                                }
                            </div>

                            <Dialog visible={this.state.displayDeleteDialog} width="300px" header="You sure to delete this Appointment?"
                                modal={true} onHide={() => this.setState({ displayDeleteDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix" style={{ textAlign: 'center' }}>
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-danger" onClick={() => this.onDeleteAppointment()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayDeleteDialog: false })} />
                                    </div>
                                }
                            </Dialog>

                            <Dialog visible={this.state.displayApproveDialog} width="300px" header="You sure to Approve this Appointment?"
                                modal={true} onHide={() => this.setState({ displayApproveDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix" style={{ textAlign: 'center' }}>
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-success" onClick={() => this.onApproveAppointment()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayApproveDialog: false })} />
                                    </div>
                                }
                            </Dialog>

                            {
                                EditAppointmentDialog
                            }
                            {
                                NewAppointmentDialog
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
export default ListAppointments;