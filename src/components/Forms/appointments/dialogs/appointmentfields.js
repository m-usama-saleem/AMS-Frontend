import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
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

class AppointmentFields extends Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE;
        this.service = new AppointmentService();
    }

    render() {

        return (
            <div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Aktenzeichen" Type="text" IsRequired={true}
                            Value={this.state.AppointmentId} PlaceholderText="Aktenzeichen"
                            onChange={(val) => this.setState({ AppointmentId: val })} />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Datum</label>
                            <InputText placeholderText="Datum auswählen" value={new Date().toDateString()} type="text" size="30" disabled={true} />
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Dolmetscher/ Übersetzer<span style={{ color: 'red' }}>*</span></label>
                            <Select
                                value={this.state.SelectedTranslatorName}
                                onChange={(e) => this.onTranslatorSelected(e)}
                                options={this.state.AllTranslators}
                            />
                        </span>

                    </div>
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <label htmlFor="float-input">Auftraggeber<span style={{ color: 'red' }}>*</span></label>
                        <Select
                            value={this.state.SelectedInstituteName}
                            onChange={(e) => this.onInstitutionSelected(e)}
                            options={this.state.AllInstitutions}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Termin <span style={{ color: 'red' }}>*</span></label>
                            <DatePicker dateFormat="dd/MM/yyyy" placeholderText="Datum"
                                selected={this.state.SelectedAppointmentDate}
                                onChange={date => this.setAppointmentDate(date)}
                                className={this.state.isAppointmentDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"} />
                        </span>
                    </div>
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Typ: <span style={{ color: 'red' }}>*</span></label>
                            <div style={this.state.isTypeValid === true ? {} : errorBoxForCheckBox}>
                                {AppointmentType}
                            </div>
                        </span>
                    </div>
                </div>

                <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6" style={{ marginBottom: 20 }}>
                    <span className="ui-float-label">
                        <label htmlFor="float-input">Anhänge</label>
                        <div>
                            <input type="file" onChange={this.onFileSelected} multiple />
                        </div>
                    </span>
                </div>
            </div>
        );
    }
}

export default AppointmentFields;
