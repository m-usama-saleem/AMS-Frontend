import React, { Component } from 'react';
import * as ROLES from '../../constants/roles'
import { DataTable } from 'primereact/datatable';
// import { Growl } from 'primereact/growl';
import { Column } from 'primereact/column';
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
import { ContextMenu } from 'primereact/contextmenu';
import 'primereact/resources/themes/nova/theme.css';
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
import moment from 'moment'
import 'moment/locale/de';

const errorBoxForCheckBox = {
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
            error: '',
            CheckFields: false,
            AllAppointments: [],
            ListAllAppointments: [],
            filteredData: [],
        };
        this.service = new AppointmentService();
        this.appointments = []

        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
        // this.exportPdf = this.exportPdf.bind(this);
        this.exportCSV = this.exportCSV.bind(this);

        this.cols = [
            { field: 'appointment.appointmentId', header: 'Aktenzeichen' },
            { field: 'appointment.appointmentDate', header: 'Termin' },
            { field: 'appointment.translatorName', header: 'Dolmetscher/ Übersetzer' },
            { field: 'appointment.institutionName', header: 'Institution' },
            { field: 'appointment.type', header: 'Typ' },
            { field: 'appointment.status', header: 'Status' },
            { field: 'payable.netPayment', header: 'Netto Betrag' },
            { field: 'receivable.netPayment', header: 'Forderungsbetrag' }
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
                data.forEach(x => {
                    x.appointment.appointmentDate = moment(x.appointment.appointmentDate).format('L')
                    x.appointment.entryDate = moment(x.appointment.entryDate).format('L')

                    x.payable.appointmentDate = moment(x.payable.appointmentDate).format('L')
                    x.receivable.appointmentDate = moment(x.receivable.appointmentDate).format('L')

                    if (new Date(x.appointment.deletedDate).toLocaleDateString() == "1/1/1")
                        x.appointment.deletedDate = ""
                    else
                        x.appointment.deletedDate = moment(x.appointment.deletedDate).format('L')

                    if (new Date(x.appointment.approvalDate).toLocaleDateString() == "1/1/1")
                        x.appointment.approvalDate = ""
                    else
                        x.appointment.approvalDate = moment(x.appointment.approvalDate).format('L')

                    if (new Date(x.appointment.completionDate).toLocaleDateString() == "1/1/1")
                        x.appointment.completionDate = ""
                    else
                        x.appointment.completionDate = moment(x.appointment.completionDate).format('L')

                })
                this.appointments = data;
                this.setState({
                    ListAllAppointments: data,
                    AllAppointments: data,
                    filteredData: data,
                })
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
        var entry_date = moment(appointment.entryDate, "DD-MM-YYYY").format('L');
        var app_date = moment(appointment.appointmentDate, "DD-MM-YYYY").format('L');

        if (appointment) {
            this.setState({
                selectedAppointmentId: appointment.id,

                Id: appointment.id,
                AppointmentId: appointment.appointmentId,
                SelectedTranslatorName: AllTranslators[transInd],
                SelectedInstituteName: AllInstitutions[instInd],
                SelectedLanguageName: Languages[langId],
                Type: appointment.type,
                EntryDate: entry_date,
                SelectedAppointmentDate: app_date,
                displayEditDialog: true,
                langList: LanguageSelection,
                DeletedReason: appointment.deletedReason,
                DeletedDate: appointment.deletedDate,
                AttachmentFiles: appointment.attachments
            })
        }
    }

    getEditAppointmentDialog() {

        const { langList } = this.state;

        var AppointmentType = ListAppointmentType.map(obj =>
            <div key={obj.value} style={{ display: 'inline-block' }}>
                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">{obj.value}</span>
                <RadioButton value={obj.value} name="Typ" disabled={true}
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
            <Dialog visible={this.state.displayEditDialog} style={{ width: '60vw' }} header="Termindetails"
                modal={true} onHide={() => this.setState({ displayEditDialog: false }, () => this.onReset())}
                contentStyle={{ maxHeight: "550px", overflow: "auto" }}>
                {
                    <div className="p-grid p-fluid">
                        <div className="card card-w-title">
                            <div className="p-grid" >
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Aktenzeichen" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentId} PlaceholderText="Aktenzeichen"
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
                                        <AMSInputField Label="Auftraggeber" Type="text" ReadOnly={true}
                                            Value={this.state.SelectedInstituteName ? this.state.SelectedInstituteName.label : ""}
                                            ChangeIsValid={(val) => { }}
                                        />
                                    </div>
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Termin <span style={{ color: 'red' }}>*</span></label>
                                            <input value={this.state.SelectedAppointmentDate} disabled={true}
                                                className="p-inputtext normalbox" readOnly={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Dolmetscher/ Übersetzer" Type="text" ReadOnly={true}
                                            Value={this.state.SelectedTranslatorName ? this.state.SelectedTranslatorName.label : ""}
                                            ChangeIsValid={(val) => { }}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Sprache" Type="text" ReadOnly={true}
                                            Value={this.state.SelectedLanguageName ? this.state.SelectedLanguageName.label : ""}
                                            ChangeIsValid={(val) => { }}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <span className="ui-float-label">
                                            <label htmlFor="float-input">Typ: <span style={{ color: 'red' }}>*</span></label>
                                            <div>
                                                {AppointmentType}
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <span className="ui-float-label">
                                            <AMSInputField Label="Gelöschtes Datum" Type="text" ReadOnly={true}
                                                Value={this.state.DeletedDate}
                                                ChangeIsValid={(val) => { }}
                                            />
                                        </span>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <label htmlFor="float-input">Grund:</label>
                                        <textarea className="form-control" readOnly={true}
                                            value={this.state.DeletedReason ? this.state.DeletedReason : ""}
                                        />
                                    </div>
                                </div>
                                <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6" style={{ marginBottom: 20 }}>
                                    <span className="ui-float-label">
                                        <label htmlFor="float-input">Anhänge</label>
                                        <div>{DownloadPhotos}</div>
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
                <h3 style={{ borderBottomStyle: 'solid', borderBottomWidth: 2, borderColor: 'black' }}>Reise Details</h3>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Reisebeginn</label>
                            <TimePicker disabled={true} className="form-control" time={this.state.StartOfTheTrip} theme="Ash" placeholder="Reisebeginn"
                            />
                        </span>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Terminbeginn</label>
                            <TimePicker className="form-control" time={this.state.AppointmentStart} theme="Ash" placeholder="Terminbeginn time"
                                disabled={true} />
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Terminende</label>
                            <TimePicker className="form-control" time={this.state.EndOfTheAppointment} theme="Ash" placeholder="Terminende time"
                                disabled={true} />
                        </span>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Ende der Reise</label>
                            <TimePicker className="form-control" time={this.state.EndOfTheTrip} theme="Ash" placeholder="Ende der Reise time"
                                disabled={true} />
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Stunden insgesamt" PlaceholderText="Stunden insgesamt" Type="text"
                            Value={this.state.TotalHours} onChange={(val) => this.setState({ TotalHours: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => { }} ReadOnly={true}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Reisedistanz (KM)" PlaceholderText="Reisedistanz (KM)" Type="number"
                            Value={this.state.RideDistance} onChange={(val) => this.setState({ RideDistance: val }, () => this.calculateRideCost())}
                            ChangeIsValid={(val) => { }} ReadOnly={true}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Reisekosten" PlaceholderText="Reisekosten" Type="number" /* ReadOnly={true} */
                            Value={this.state.RideCost} onChange={(val) => this.setState({ RideCost: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => { }} ReadOnly={true}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                        <AMSInputField Label="Pauschale" PlaceholderText="Pauschale" Type="number"
                            Value={this.state.DailyAllowance} onChange={(val) => this.setState({ DailyAllowance: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => { }} ReadOnly={true}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Ticketgebühren" PlaceholderText="Ticketgebühren" Type="number"
                            Value={this.state.TicketCost} onChange={(val) => this.setState({ TicketCost: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => { }} ReadOnly={true}
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
                            ChangeIsValid={(val) => { }} ReadOnly={true}
                        />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Rate" PlaceholderText="Rate" Type="number"
                            Value={this.state.Rate} onChange={(val) => this.setState({ Rate: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => { }} ReadOnly={true}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Flat Rate" PlaceholderText="Flat Rate" Type="number"
                            Value={this.state.FlatRate} onChange={(val) => this.setState({ FlatRate: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => { }} ReadOnly={true}
                        />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Pauschale" PlaceholderText="Pauschale" Type="number"
                            Value={this.state.Paragraph} onChange={(val) => this.setState({ Paragraph: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => { }} ReadOnly={true}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Porto" PlaceholderText="Porto" Type="number"
                            Value={this.state.Postage} onChange={(val) => this.setState({ Postage: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => { }} ReadOnly={true}
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
                <Button icon="fa fa-file-archive-o" className="p-button-rounded p-button-secondary "
                    onClick={() => this.viewReceivable(rowData.receivable)} title="Informationen zu Forderungen" />
                <Button icon="fa fa-tags" style={{ marginLeft: 5 }} className="p-button-rounded p-button-secondary"
                    onClick={() => this.viewPayable(rowData.payable)} title="Zahlungsinformationen" />
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
            <Dialog visible={this.state.displayPayableDialog} style={{ width: '60vw' }} header="Zahlungsinformationen"
                modal={true} onHide={() => this.setState({ displayPayableDialog: false })}
                contentStyle={{ maxHeight: "550px", overflow: "auto" }}>
                {
                    <div className="p-grid p-fluid">
                        <div className="card card-w-title">
                            <h1>Zahlungsinformationen</h1>
                            <div className="p-grid" >
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Aktenzeichen" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentId} PlaceholderText="Aktenzeichen"
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Termin" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentDate}
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Dolmetscher/ Übersetzer" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentTranslator}
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Auftraggeber" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentInstitute}
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                </div>

                                {
                                    FormFields
                                }

                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Insgesamt" PlaceholderText="Insgesamt" Type="number"
                                            Value={this.state.SubTotal} ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="MwSt %" PlaceholderText="MwSt" Type="number"
                                            Value={this.state.Tax} onChange={(val) => this.setState({ Tax: val }, () => this.calculateTotal())}
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                </div>
                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                        <AMSInputField Label="Netto Betrag" PlaceholderText="Netto Betrag" Type="number"
                                            Value={this.state.NetPayment} ChangeIsValid={(val) => { }} ReadOnly={true}
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
            <Dialog visible={this.state.displayReceivableDialog} style={{ width: '60vw' }} header="Zahlungsinformationen"
                modal={true} onHide={() => this.setState({ displayReceivableDialog: false })}
                contentStyle={{ maxHeight: "550px", overflow: "auto" }}>
                {
                    <div className="p-grid p-fluid">
                        <div className="card card-w-title">
                            <h1>Informationen zu Forderungen</h1>
                            <div className="p-grid" >
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Aktenzeichen" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentId} PlaceholderText="Aktenzeichen"
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Termin" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentDate}
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Dolmetscher/ Übersetzer" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentTranslator}
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Auftraggeber" Type="text" ReadOnly={true}
                                            Value={this.state.AppointmentInstitute}
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                </div>

                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="Insgesamt" PlaceholderText="Insgesamt" Type="number"
                                            Value={this.state.SubTotal} onChange={(val) => this.setState({ SubTotal: val }, () => this.calculateTotal())}
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                        <AMSInputField Label="MwSt %" PlaceholderText="MwSt" Type="number"
                                            Value={this.state.Tax} onChange={(val) => this.setState({ Tax: val }, () => this.calculateTotal())}
                                            ChangeIsValid={(val) => { }} ReadOnly={true}
                                        />
                                    </div>
                                </div>
                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                <div className="row">
                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                        <AMSInputField Label="Netto Betrag" PlaceholderText="Netto Betrag" Type="number"
                                            Value={this.state.NetPayment} ChangeIsValid={(val) => { }} ReadOnly={true}
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

    // exportPdf() {
    //     import('jspdf').then(jsPDF => {
    //         import('jspdf-autotable').then(() => {
    //             const doc = new jsPDF.default(0, 0);
    //             debugger
    //             doc.autoTable(this.exportColumns, this.state.AllAppointments);
    //             doc.save('data.pdf');
    //         })
    //     })
    // }

    exportCSV(selectionOnly) {
        this.dt.exportCSV({ selectionOnly });
    }

    onChangeFilter(DateFrom, DateTo) {
        const { ListAllAppointments } = this.state;
        if (DateFrom && DateTo) {
            var Date_From = moment(DateFrom).format();
            var Date_To = moment(DateTo).format();

            var filteredData = ListAllAppointments.filter(x => {
                let ap_date = moment(x.appointment.appointmentDate, 'DD.MM.YYYY').format();
                return ap_date >= Date_From && ap_date <= Date_To
            })

            this.appointments = filteredData
            this.setState({
                AllAppointments: filteredData,
                filteredData
            })
        }
        this.setState({
            DateFrom, DateTo,
        })
    }

    // rowClass(data) {
    //     return {
    //         "approvedRow": data.isApproved && data.isApproved === "Yes",
    //         "needApprovalRow": !data.isApproved || data.isApproved === "No",
    //     }
    // }

    sortAppointmentDates(e) {
        this.appointments.sort((a, b) => {
            let x = moment(a.appointment.appointmentDate, 'DD-MM-YYYY');
            let y = moment(b.appointment.appointmentDate, 'DD-MM-YYYY');
            return (x.valueOf() - y.valueOf()) * e.order;
        })
        return this.appointments;
    }
    sortApprovalDates(e) {
        this.appointments.sort((a, b) => {
            let x = moment(a.appointment.approvalDate, 'DD-MM-YYYY');
            let y = moment(b.appointment.approvalDate, 'DD-MM-YYYY');
            return (x.valueOf() - y.valueOf()) * e.order;
        })
        return this.appointments;
    }


    render() {
        const { users, loading, filteredData, AllAppointments } = this.state;
        var { } = this.state
        const header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Suche" size="20" />
            </div>
            <div className="col-sm-6 col-md-5 col-lg-5" style={{ display: 'inline-flex' }}>
                <div className="col-md-5">
                    <DatePicker className="form-control " dateFormat="dd/MM/yyyy" placeholderText="Select Date"
                        selected={this.state.DateFrom} onChange={date => this.onChangeFilter(date, this.state.DateTo)} />
                </div>
                <span className="col-md-2" style={{ marginTop: 5 }}> - To - </span>
                <div className="col-md-5">
                    <DatePicker className="form-control" dateFormat="dd/MM/yyyy" placeholderText="Select Date"
                        selected={this.state.DateTo} onChange={date => this.onChangeFilter(this.state.DateFrom, date)} />
                </div>
            </div>
            <div className="col-sm-4 col-md-2 col-lg-2" style={{ position: 'absolute', right: 0 }}>
                <Button className="p-button-success" icon="pi pi-file-excel" onClick={() => this.exportCSV(false)} data-pr-tooltip="Excel" label="Export To EXCEL" />
            </div>
        </div>
        var payableTotal = 0;
        var receivableTotal = 0;

        filteredData.forEach(x => {
            payableTotal += x.payable.netPayment
            receivableTotal += x.receivable.netPayment
        })
        let footerGroup = <ColumnGroup>
            <Row>
                <Column footer="Netto:" colSpan={8} footerStyle={{ textAlign: 'right' }} />
                <Column footer={payableTotal.toFixed(2)} />
                <Column footer={receivableTotal.toFixed(2)} />
            </Row>
        </ColumnGroup>;

        var EditAppointmentDialog = this.getEditAppointmentDialog();
        var PayableDialog = this.getPayableDialog();
        var ReceivableDialog = this.getReceivableDialog();


        return (
            <div>
                {/* <Growl ref={(el) => this.growl = el}></Growl> */}
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Terminliste</h1>
                        <div className="content-section implementation">
                            <DataTable ref={(el) => this.dt = el} onValueChange={filteredData => this.setState({ filteredData })}
                                header={header} value={this.appointments}
                                // paginator={this.state.isLoading === false} rows={15}
                                onRowDoubleClick={this.dblClickAppointment} responsive={true}
                                selection={this.state.selectedAppointment}
                                onSelectionChange={e => this.setState({ selectedAppointment: e.value })}
                                resizableColumns={true} columnResizeMode="fit" /*rowClassName={this.rowClass}*/
                                globalFilter={this.state.globalFilter}
                                paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                dataKey="id"
                                footerColumnGroup={footerGroup}
                                style={{ fontSize: 12 }}
                            >
                                <Column field="appointment.appointmentId" header="Aktenzeichen" sortable={true} />
                                <Column field="appointment.appointmentDate" sortFunction={(e) => this.sortAppointmentDates(e)} header="Termin" sortable={true} style={{ textAlign: 'center' }} />
                                <Column field="appointment.approvalDate" sortFunction={(e) => this.sortApprovalDates(e)} header="bestätigtes Datum" sortable={true} style={{ textAlign: 'center' }} />
                                <Column field="appointment.completionDate" header="vollendeter Tag" sortable={true} style={{ textAlign: 'center' }} />
                                <Column field="appointment.translatorName" header="Dolmetscher/ Übersetzer" sortable={true} />
                                <Column field="appointment.institutionName" header="Auftraggeber" sortable={true} />
                                <Column field="appointment.type" header="Typ" sortable={true} />
                                <Column field="appointment.status" header="Status" sortable={true} />
                                <Column field="payable.netPayment" header="Netto Betrag" sortable={true} />
                                <Column field="receivable.netPayment" header="Forderungsbetrag" sortable={true} />
                                <Column header="Aktion" body={this.actionBodyTemplate} ></Column>
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