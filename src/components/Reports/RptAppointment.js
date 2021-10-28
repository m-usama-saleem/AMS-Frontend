import React, { Component } from 'react';
import * as ROLES from '../../constants/roles'
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import { Column } from 'primereact/column';
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
import { ContextMenu } from 'primereact/contextmenu';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import Select from 'react-select'
import DatePicker from "react-datepicker";

import { InputText } from 'primereact/inputtext';
import { Genders, Languages, ListAppointmentType } from '../../constants/staticValues';
import AMSInputField from '../Common/AMSInputField';
import AppointmentService from '../../api/appointments/appointmentservice';
import * as ROUTES from '../../constants/routes';
import TimePicker from '../timepicker';

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


class RptAppointment extends Component {
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
            displayPayableDialog: false,
            displayReceivableDialog: false,
            isTypeValid: true,
            error: '',
            CheckFields: false,
            AllAppointments: []
        };
        this.service = new AppointmentService();

        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
        this.exportPdf = this.exportPdf.bind(this);
        this.exportCSV = this.exportCSV.bind(this);

        this.cols = [
            { field: 'appointment.appointmentId', header: 'Appointment ID' },
            { field: 'appointment.appointmentDate', header: 'Appointment Date' },
            { field: 'appointment.translatorName', header: 'Translator' },
            { field: 'appointment.institutionName', header: 'Institution' },
            { field: 'appointment.type', header: 'Type' },
            { field: 'appointment.status', header: 'Status' },
            { field: 'payable.netPayment', header: 'Payable Amount' },
            { field: 'receivable.netPayment', header: 'Receivable Amount' }
        ];
        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    componentDidMount() {
        this.getLists();
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

    getAppointmentList() {
        this.service.GetAll().then(data => {
            if (data && data !== "" && data.length > 0) {
                data.forEach(x => x.appointment.appointmentDate = new Date(x.appointment.appointmentDate).toLocaleDateString())
                this.setState({ AllAppointments: data })
            }
        })
            .catch(err => {
                this.growl.show({ severity: 'error', summary: 'Error', detail: err });
            })
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

    dblClickAppointment = (e) => {
        this.EditMode(e.data.appointment)
    }

    EditMode(appointment) {
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

    getEditAppointmentDialog() {

        const { langList } = this.state;

        var AppointmentType = ListAppointmentType.map(obj =>
            <div key={obj.value} style={{ display: 'inline-block' }}>
                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">{obj.value}</span>
                <RadioButton value={obj.value} name="Type" disabled={true}
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
                modal={true} onHide={() => this.setState({ displayEditDialog: false }, () => this.onReset())}
                contentStyle={{ maxHeight: "550px", overflow: "auto" }}>
                {
                    <div className="p-grid p-fluid">
                        <div className="card card-w-title">
                            <div className="p-grid" >
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Appointment ID" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentId} PlaceholderText="Unique Appointment ID"
                                            ChangeIsValid={(val) => { }}
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
                                        <AMSInputField Label="Institution Name" Type="text" ReadOnly={true}
                                            Value={this.state.SelectedInstituteName ? this.state.SelectedInstituteName.label : ""}
                                            ChangeIsValid={(val) => { }}
                                        />
                                    </div>
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Appointment Date <span style={{ color: 'red' }}>*</span></label>
                                            <DatePicker dateFormat="dd/MM/yyyy" placeholderText="Select date for appointment"
                                                selected={this.state.SelectedAppointmentDate}
                                                className="p-inputtext normalbox" readOnly={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Translator Name" Type="text" ReadOnly={true}
                                            Value={this.state.SelectedTranslatorName ? this.state.SelectedTranslatorName.label : ""}
                                            ChangeIsValid={(val) => { }}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Language" Type="text" ReadOnly={true}
                                            Value={this.state.SelectedLanguageName ? this.state.SelectedLanguageName.label : ""}
                                            ChangeIsValid={(val) => { }}
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
                                    <span className="ui-float-label" style={{ float: 'right' }}>
                                        <Button label="Update Appointment" className="ui-btns" disabled={this.state.isLoading} onClick={() => this.onEditAppointment()} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Dialog>
        )
    }

    getSpeakingFields() {
        return (
            <div>
                <h3 style={{ borderBottomStyle: 'solid', borderBottomWidth: 2, borderColor: 'black' }}>Trip Details</h3>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Start Of The Trip</label>
                            <TimePicker className="form-control" time={this.state.StartOfTheTrip} theme="Ash" placeholder="Start Of The Trip"
                                onSet={(val) => this.ChangeStartOfTheTrip(val.format24)} />
                        </span>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Appointment start</label>
                            <TimePicker className="form-control" time={this.state.AppointmentStart} theme="Ash" placeholder="Appointment start time"
                                onSet={(val) => this.ChangeAppointmentStart(val.format24)} />
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">End of the appointment</label>
                            <TimePicker className="form-control" time={this.state.EndOfTheAppointment} theme="Ash" placeholder="End of the appointment time"
                                onSet={(val) => this.ChangeEndOfTheAppointment(val.format24)} />
                        </span>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">End of the trip</label>
                            <TimePicker className="form-control" time={this.state.EndOfTheTrip} theme="Ash" placeholder="End of the trip time"
                                onSet={(val) => this.ChangeEndOfTheTrip(val.format24)} />
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Total hours" PlaceholderText="Total hours" Type="text"
                            Value={this.state.TotalHours} onChange={(val) => this.setState({ TotalHours: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidTotalHours: val })}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Ride Distance (KM)" PlaceholderText="Ride Distance (KM)" Type="number"
                            Value={this.state.RideDistance} onChange={(val) => this.setState({ RideDistance: val }, () => this.calculateRideCost())}
                            ChangeIsValid={(val) => this.setState({ ValidRideDistance: val })}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Ride Cost" PlaceholderText="Ride Cost" Type="number" /* ReadOnly={true} */
                            Value={this.state.RideCost} onChange={(val) => this.setState({ RideCost: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidRideCost: val })}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                        <AMSInputField Label="Daily Allowance" PlaceholderText="Daily Allowance" Type="number"
                            Value={this.state.DailyAllowance} onChange={(val) => this.setState({ DailyAllowance: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidDailyAllowance: val })}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Ticket Cost" PlaceholderText="Ticket Cost" Type="number"
                            Value={this.state.TicketCost} onChange={(val) => this.setState({ TicketCost: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidTicketCost: val })}
                        />
                    </div>
                </div>
            </div>
        )
    }
    getWritingFields() {
        return (
            <div>
                <h3 style={{ borderBottomStyle: 'solid', borderBottomWidth: 2, borderColor: 'black' }}>Calculations</h3>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Word Count" PlaceholderText="Word Count" Type="number"
                            Value={this.state.WordCount} onChange={(val) => this.setState({ WordCount: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidWordCount: val })}
                        />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Rate" PlaceholderText="Rate" Type="number"
                            Value={this.state.Rate} onChange={(val) => this.setState({ Rate: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidRate: val })}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Flat Rate" PlaceholderText="Flat Rate" Type="number"
                            Value={this.state.FlatRate} onChange={(val) => this.setState({ FlatRate: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidFlatRate: val })}
                        />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Paragraph" PlaceholderText="Paragraph" Type="number"
                            Value={this.state.Paragraph} onChange={(val) => this.setState({ Paragraph: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidParagraph: val })}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Postage" PlaceholderText="Postage" Type="number"
                            Value={this.state.Postage} onChange={(val) => this.setState({ Postage: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidPostage: val })}
                        />
                    </div>
                </div>
            </div>
        )
    }

    viewPayable(payable) {
        if (payable) {

            this.setState({
                selectedPayableId: payable.id,

                Id: payable.id,
                AppointmentId_Fk: payable.appointmentId_Fk,
                AppointmentId: payable.appointmentId,
                AppointmentType: payable.appointmentType,
                AppointmentDate: payable.appointmentDate,
                AppointmentInstitute: payable.appointmentInstitute,
                AppointmentTranslator: payable.appointmentTranslator,

                Status: payable.status,
                Type: payable.type,
                StartOfTheTrip: payable.startOfTheTrip,
                AppointmentStart: payable.appointmentStart,
                EndOfTheAppointment: payable.endOfTheAppointment,
                EndOfTheTrip: payable.endOfTheTrip,
                TotalHours: payable.totalHours,
                WordCount: payable.wordCount,
                Postage: payable.postage,
                Paragraph: payable.paragraph,
                FlatRate: payable.flatRate,
                Rate: payable.rate,
                Hours: payable.hours,
                Discount: payable.discount,
                RideDistance: payable.rideCost,
                DailyAllowance: payable.dailyAllowance,
                Tax: payable.tax,
                TicketCost: payable.ticketCost,
                NetPayment: payable.netPayment,

                displayPayableDialog: true
            })
        }
    }
    viewReceivable(receivable) {
        if (receivable) {
            this.setState({
                selectedReceivableId: receivable.id,

                Id: receivable.id,
                AppointmentId_Fk: receivable.appointmentId_Fk,
                AppointmentId: receivable.appointmentId,
                AppointmentType: receivable.appointmentType,
                AppointmentDate: receivable.appointmentDate,
                AppointmentInstitute: receivable.appointmentInstitute,
                AppointmentTranslator: receivable.appointmentTranslator,

                Status: receivable.status,
                Type: receivable.type,
                SubTotal: receivable.rate,
                Tax: receivable.tax,
                NetPayment: receivable.netPayment,
                displayReceivableDialog: true
            })

        }
    }

    actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-file" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-secondary p-mr-2"
                    onClick={() => this.viewReceivable(rowData.receivable)} title="Receivable Information" />
                <Button icon="pi pi-file" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-secondary p-mr-2"
                    onClick={() => this.viewPayable(rowData.payable)} title="Payable Information" />
            </React.Fragment>
        );
    }

    downloadFile(name) {
        this.service.downloadFile(name);
    }

    getPayableDialog() {
        var { AppointmentType } = this.state
        var FormFields;
        if (AppointmentType === "SPRACHEN") {
            FormFields = this.getSpeakingFields()
        }
        if (AppointmentType === "SCHREIBEN") {
            FormFields = this.getWritingFields()
        }

        return (
            <Dialog visible={this.state.displayPayableDialog} style={{ width: '60vw' }} header="Payment Information"
                modal={true} onHide={() => this.setState({ displayPayableDialog: false })}
                contentStyle={{ maxHeight: "550px", overflow: "auto" }}>
                {
                    <div className="p-grid p-fluid">
                        <div className="card card-w-title">
                            <h1>Payable Information</h1>
                            <div className="p-grid" >
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Appointment ID" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentId} PlaceholderText="Unique Appointment ID"
                                            ChangeIsValid={(val) => this.setState({ ValidAppointmentId: val })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Appointment Date" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentDate}
                                            ChangeIsValid={(val) => this.setState({ ValidAppointmentDate: val })}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Translator" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentTranslator}
                                            ChangeIsValid={(val) => this.setState({ ValidTranslator: val })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Appointment Institute" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentInstitute}
                                            ChangeIsValid={(val) => this.setState({ ValidInstitute: val })}
                                        />
                                    </div>
                                </div>

                                {
                                    FormFields
                                }

                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Sub Total" PlaceholderText="Sub Total" Type="number"
                                            Value={this.state.SubTotal} ReadOnly={true}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Tax %" PlaceholderText="Tax" Type="number"
                                            Value={this.state.Tax} onChange={(val) => this.setState({ Tax: val }, () => this.calculateTotal())}
                                            ChangeIsValid={(val) => this.setState({ ValidTax: val })}
                                        />
                                    </div>
                                </div>
                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                        <AMSInputField Label="Net Payment" PlaceholderText="Net Payment" Type="number"
                                            Value={this.state.NetPayment} ReadOnly={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Dialog>
        )
    }

    getReceivableDialog() {

        return (
            <Dialog visible={this.state.displayReceivableDialog} style={{ width: '60vw' }} header="Payment Information"
                modal={true} onHide={() => this.setState({ displayReceivableDialog: false })}
                contentStyle={{ maxHeight: "550px", overflow: "auto" }}>
                {
                    <div className="p-grid p-fluid">
                        <div className="card card-w-title">
                            <h1>Receivable Information</h1>
                            <div className="p-grid" >
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Appointment ID" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentId} PlaceholderText="Unique Appointment ID"
                                            ChangeIsValid={(val) => this.setState({ ValidAppointmentId: val })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Appointment Date" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentDate}
                                            ChangeIsValid={(val) => this.setState({ ValidAppointmentDate: val })}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Translator" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentTranslator}
                                            ChangeIsValid={(val) => this.setState({ ValidTranslator: val })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Appointment Institute" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentInstitute}
                                            ChangeIsValid={(val) => this.setState({ ValidInstitute: val })}
                                        />
                                    </div>
                                </div>

                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Sub Total" PlaceholderText="Sub Total" Type="number"
                                            Value={this.state.SubTotal} onChange={(val) => this.setState({ SubTotal: val }, () => this.calculateTotal())}
                                            ChangeIsValid={(val) => this.setState({ SubTotal: val })}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Tax %" PlaceholderText="Tax" Type="number"
                                            Value={this.state.Tax} onChange={(val) => this.setState({ Tax: val }, () => this.calculateTotal())}
                                            ChangeIsValid={(val) => this.setState({ ValidTax: val })}
                                        />
                                    </div>
                                </div>
                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                        <AMSInputField Label="Net Payment" PlaceholderText="Net Payment" Type="number"
                                            Value={this.state.NetPayment} ReadOnly={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Dialog>
        )
    }

    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                debugger
                doc.autoTable(this.exportColumns, this.state.AllAppointments);
                doc.save('data.pdf');
            })
        })
    }

    exportCSV(selectionOnly) {
        this.dt.exportCSV({ selectionOnly });
    }

    render() {
        const { users, loading, AllAppointments } = this.state;
        const header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="20" />
                <Button type="button" icon="pi pi-file-o" onClick={() => this.exportCSV(false)} className="p-mr-2" data-pr-tooltip="CSV" />
                <Button type="button" icon="pi pi-file-pdf" onClick={this.exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="PDF" />
            </div>
        </div>
        var payableTotal = 0;
        var receivableTotal = 0;
        AllAppointments.forEach(x => {
            payableTotal += x.payable.netPayment
            receivableTotal += x.receivable.netPayment
        })
        let footerGroup = <ColumnGroup>
            <Row>
                <Column footer="Totals:" colSpan={6} footerStyle={{ textAlign: 'right' }} />
                <Column footer={payableTotal} />
                <Column footer={receivableTotal} />
            </Row>
        </ColumnGroup>;

        var EditAppointmentDialog = this.getEditAppointmentDialog();
        var PayableDialog = this.getPayableDialog();
        var ReceivableDialog = this.getReceivableDialog();

        return (
            <div>
                <Growl ref={(el) => this.growl = el}></Growl>
                <ContextMenu model={this.menuModel} ref={el => this.cm = el} onHide={() => this.setState({ selectedUser: null })} />
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Translaotrs List</h1>
                        <div className="content-section implementation">
                            <DataTable ref={(el) => this.dt = el} onValueChange={filteredData => console.log(filteredData)}
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
                                footerColumnGroup={footerGroup}
                            >
                                <Column field="appointment.appointmentId" header="Appointment ID" sortable={true} />
                                <Column field="appointment.appointmentDate" header="Appointment Date" sortable={true} style={{ textAlign: 'center' }} />
                                <Column field="appointment.translatorName" header="Translator" sortable={true} />
                                <Column field="appointment.institutionName" header="Institution" sortable={true} />
                                <Column field="appointment.type" header="Type" sortable={true} />
                                <Column field="appointment.status" header="Status" sortable={true} />
                                <Column field="payable.netPayment" header="Payable Amount" sortable={true} />
                                <Column field="receivable.netPayment" header="Receivable Amount" sortable={true} />
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

                            {EditAppointmentDialog}
                            {PayableDialog}
                            {ReceivableDialog}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RptAppointment;