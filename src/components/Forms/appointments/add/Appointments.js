import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { ProgressBar } from 'primereact/progressbar';
import DatePicker from "react-datepicker";
import { RadioButton } from 'primereact/radiobutton';

import "react-datepicker/dist/react-datepicker.css";
import AppointmentService from '../../../../api/appointments/appointmentservice';
import * as ROLES from '../../../../constants/roles';

const INITIAL_STATE = {
    isLoading: false,
    Id: 0,
    AppointmentId: '',
    TranslatorNames: [],
    SelectedTranslatorName: '',
    InstituteNames: [],
    SelectedInstituteName: '',
    EntryDate: new Date(),
    AppointmentDate: '',
    TypeNames: [],
    SelectedTypeName: '',
    Tax: '',
    Rate: '',
    Hour: '',
    Discount: '',
    NetAmount: '',
    Rate: '',
    Attachments: '',
    files: [],

    isAppointmentIdValid: true,
    isSelectedTranslatorNameValid: true,
    isSelectedInstituteNameValid: true,
    isAppointmentDateValid: true,
    isAppointmentIdValid: true,
    isSelectedTypeNameValid: true,
}

const errorBox = {
    borderRadius: '3px', borderColor: 'red'
};
const normalBox = {
    border: '1px solid #a6a6a6'
};
const errorBoxForCheckBox = {
    border: '1px solid red', borderRadius: '3px'
};

class Appointments extends Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE;
        this.service = new AppointmentService();
    }

    componentDidMount() {
        this.getLists();
    }

    getLists() {
        this.service.GetInstitutions().then(data => {
            this.setState({ AllInstitutions: data })
        })
        this.service.GetTranslators().then(data => {
            this.setState({ AllTranslators: data })
        })
    }

    onSaveAppointments() {
        var validForm = this.validateForm();
        if (validForm) {
            var Obj = {
                ClientId: this.state.SelectedClientName.userId,
                Date: this.state.StartDate.toLocaleString(),
                SiteAddress: this.state.SiteAddress,
                TimeDetails: this.state.TimeDetails,
                CreatedDate: new Date(),
                CreatedBy: this.props.authUser.id,
            }
            this.service
                .Add(Obj)
                .then(() => {
                    this.growl.show({ severity: 'success', summary: 'Success', detail: 'Added' });
                    this.resetForm();
                })
                .catch((error) => {
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while adding' });
                    this.setState({ isLoading: false });
                })
        }
        else {

        }
    }

    setStartDate(date) {
        this.setState({ StartDate: date })
    }
    onClientSelected(name) {
        this.setState({ SelectedClientName: name.value })
    }

    render() {

        return (
            <div><Growl ref={(el) => this.growl = el}></Growl>

                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Add New Appointment</h1>
                        <div className="p-grid p-col-md-9 p-col-sm-12" >
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6" style={{ marginBottom: 20 }}>
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Appointment ID <span style={{ color: 'red' }}>*</span></label>
                                    <InputText placeholder="Unique Appointment ID" value={this.state.SiteAddress} type="text" size="30" onChange={(e) => this.setState({ SiteAddress: e.target.value })}
                                        style={this.state.isSiteAddressValid === true ? normalBox : errorBox} />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6" style={{ marginBottom: 20 }}>
                                <label htmlFor="float-input">Translator Name<span style={{ color: 'red' }}>*</span></label>
                                <Dropdown optionLabel="name" optionValue="id" placeholderText="Select" value={this.state.SelectedTranslatorName} readOnly={this.state.isLoading}
                                    options={this.state.AllTranslators} onChange={(e) => this.onTranslatorSelected(e)}
                                    style={this.state.isSelectedTranslatorNameValid === true ? normalBox : errorBox} />

                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6" style={{ marginBottom: 20 }}>
                                <label htmlFor="float-input">Institution Name<span style={{ color: 'red' }}>*</span></label>
                                <Dropdown optionLabel="name" placeholderText="Select" value={this.state.SelectedInstitutionName} readOnly={this.state.isLoading}
                                    options={this.state.AllInstitutions} onChange={(e) => this.onInstitutionSelected(e)}
                                    style={this.state.isSelectedInstitutionNameValid === true ? normalBox : errorBox} />

                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6" style={{ marginBottom: 20 }} >
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Date <span style={{ color: 'red' }}>*</span></label>
                                    <DatePicker placeholderText="Select Date" selected={this.state.StartDate} onChange={date => this.setStartDate(date)}
                                        className={this.state.isStartDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"} />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6" style={{ marginBottom: 20 }}>
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Type: <span style={{ color: 'red' }}>*</span></label>
                                    <div style={this.state.isTowTrucksCalledValid === true ? {} : errorBoxForCheckBox}>
                                        <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">SCHREIBEN</span>
                                        <RadioButton value="Yes" name="TowTrucksCalled"
                                            onChange={(e) => this.setState({ TowTrucksCalled: e.value })}
                                            checked={this.state.TowTrucksCalled === 'Yes'} />
                                        <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">SPRACHEN</span>
                                        <RadioButton value="No" name="TowTrucksCalled"
                                            onChange={(e) => this.setState({ TowTrucksCalled: e.value })}
                                            checked={this.state.TowTrucksCalled === 'No'} />
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


                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                                {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                            </div>
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ color: 'red' }}>
                                {this.state.error === true ? "Please fill all the required(red marked) fields" : null}
                            </div>
                            <div className="p-col-4 p-sm-4 p-md-2 p-lg-2">
                                <span className="ui-float-label">
                                    <Button label="Create Appointment" className="p-button-primary ui-btns" disabled={this.state.isLoading} onClick={(e) => this.onSaveAppointments(e)} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    validateForm = () => {
        let error = "";
        if (!this.state.StartDate || (this.state.StartDate && this.state.StartDate.toString().trim() === '')) {
            this.setState({ isStartDateValid: false });
            error += "Date cannot be empty \n";
        } else { this.setState({ isStartDateValid: true }); }
        if (!this.state.SelectedClientName.userId || (this.state.SelectedClientName && this.state.SelectedClientName.userId &&
            this.state.SelectedClientName.userId.trim() === '')) {
            this.setState({ isSelectedClientNameValid: false });
            error += "Client Name cannot be empty \n";
        } else { this.setState({ isSelectedClientNameValid: true }); }
        if (this.state.SiteAddress.trim() === '') {
            this.setState({ isSiteAddressValid: false });
            error += "Site Address cannot be empty \n";
        } else { this.setState({ isSiteAddressValid: true }); }
        if (this.state.TimeDetails.trim() === '') {
            this.setState({ isTimeDetailsValid: false });
            error += "Time Details cannot be empty \n";
        } else { this.setState({ isTimeDetailsValid: true }); }

        if (error !== "") {
            this.setState({ isValidForm: false, error: true });
            return false;
        }
        else {
            this.setState({ isValidForm: true, error: false });
            return true;
        }
    }

    resetForm = () => {
        this.setState({
            isLoading: false,
            error: false,
            StartDate: '',
            ClientNames: [],
            SelectedClientName: '',
            SiteAddress: '',
            TimeDetails: '',
            isStartDateValid: true,
            isSelectedClientNameValid: true,
            isSiteAddressValid: true,
            isTimeDetailsValid: true,
        }, () => {
            this.getClientName();
        })
    }
}

export default Appointments;