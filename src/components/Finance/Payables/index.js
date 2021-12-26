import React, { Component } from 'react';

import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
//import {DataTableCrudDoc} from 'primereact/datatablecruddoc';
// import { Growl } from 'primereact/growl';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
// import TimePicker from '../../timepicker';
// import DatePicker from "react-datepicker";
import MaskedInput from 'react-text-mask'

import "react-datepicker/dist/react-datepicker.css";
import PayableService from '../../../api/finance/payableService';
import * as ROUTES from '../../../constants/routes';
import AMSInputField from '../../Common/AMSInputField';
import { CommonValues, ListAppointmentType } from '../../../constants/staticValues';

const INITIAL_STATE = {
    isUploading: '',
    Id: 0,
    AppointmentId: '',
    Tax: 19,

    displayApproveDialog: false,
    displayMultiApproveDialog: false,
    disableFields: false,
    disableApproveButton: true,
    TotalHours: 0,
    FlatRate: 0,
    Rate: 0,
    WordCount: 0,
    Postage: 0,
    Paragraph: 0,
    AllPayables: [],
    filteredData: [],
    SelectionTotal: 0
}

class ListPayables extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.service = new PayableService();
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);

        this.exportPdf = this.exportPdf.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
        this.cols = [
            { field: 'appointmentId', header: 'Aktenzeichen' },
            { field: 'appointmentType', header: 'Typ' },
            { field: 'appointmentInstitute', header: 'Auftraggeber' },
            { field: 'appointmentTranslator', header: 'Dolmetscher/ Übersetzer' },
            { field: 'netPayment', header: 'Insgesamt' },
            { field: 'status', header: 'Status' },
        ];
        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    }

    getLists() {
        this.getPayableList();
    }

    componentDidMount() {
        this.getLists();
    }

    getPayableList() {
        this.service.GetAll().then(data => {
            if (data && data !== "" && data.length > 0) {
                this.setState({ AllPayables: data, filteredData: data })
            }
        })
            .catch(err => {
                this.growl.show({ severity: 'error', summary: 'Fehler', detail: err });
            })
    }

    validateForm = () => {
        let error = "";

        if (error !== "") {
            this.setState({ error: true });
            return false;
        }
        else {
            this.setState({ error: false });
            return true;
        }
    }

    resetForm = () => {
        this.setState({
            isUploading: '',
            Id: 0,
            AppointmentId: '',
            Tax: 19,
            disableFields: false,
            displayApproveDialog: false,
            displayMultiApproveDialog: false,
            disableApproveButton: true,

        }, () => {
            // this.getLists();
        })
    }

    dblClickPayable = (e) => {
        this.editMode(e.data)
    }

    onEditPayable() {
        this.setState({ isLoading: true });
        let result = this.validateForm();
        if (result !== false) {
            this.EditPayable();
        }
    }

    EditPayable() {
        const { selectedPayableId, AppointmentId_Fk, WordCount, Rate, Hours, Postage, Paragraph, FlatRate, Discount,
            NetPayment, RideDistance, DailyAllowance, TicketCost, Type, Tax, StartOfTheTrip,
            AppointmentStart, EndOfTheAppointment, EndOfTheTrip, TotalHours } = this.state

        let app = {
            Id: selectedPayableId,
            AppointmentId_Fk,
            Status: 'Ausstehend',
            Type,
            WordCount, Rate,
            FlatRate, Postage, Paragraph,
            Hours,
            Discount,
            RideCost: RideDistance,
            DailyAllowance,
            Tax,
            TicketCost,
            NetPayment,
            StartOfTheTrip, AppointmentStart, EndOfTheAppointment, EndOfTheTrip, TotalHours,
            CreatedBy: this.props.authUser.id,
        }

        this.service.Edit(app)
            .then((data) => {
                if (data.success == true) {
                    this.growl.show({ severity: 'success', summary: 'Erfolg', detail: 'Verbindlichkeiten erfolgreich aktualisiert' });
                    var editedPayable = data.finance;
                    var AllPayables = this.state.AllPayables;
                    var ind = AllPayables.findIndex(x => x.id == editedPayable.id);

                    AllPayables[ind].wordCount = app.WordCount;
                    AllPayables[ind].flatRate = app.FlatRate;
                    AllPayables[ind].paragraph = app.Paragraph;
                    AllPayables[ind].postage = app.Postage;
                    AllPayables[ind].rate = app.Rate;
                    AllPayables[ind].hours = app.Hours;
                    AllPayables[ind].discount = app.Discount;
                    AllPayables[ind].rideDistance = app.RideCost;
                    AllPayables[ind].rideCost = app.RideCost;
                    AllPayables[ind].dailyAllowance = app.DailyAllowance;
                    AllPayables[ind].tax = app.Tax;
                    AllPayables[ind].ticketCost = app.TicketCost;
                    AllPayables[ind].netPayment = app.NetPayment;
                    AllPayables[ind].startOfTheTrip = app.StartOfTheTrip;
                    AllPayables[ind].appointmentStart = app.AppointmentStart;
                    AllPayables[ind].endOfTheAppointment = app.EndOfTheAppointment;
                    AllPayables[ind].endOfTheTrip = app.EndOfTheTrip;
                    AllPayables[ind].totalHours = app.TotalHours;

                    this.setState({
                        AllPayables: AllPayables,
                        isLoading: false,
                        displayEditDialog: false
                    });
                    this.resetForm();
                }
            })
            .catch((error) => {
                this.growl.show({ severity: 'error', summary: 'Fehler', detail: 'Fehler: beim aktualisieren von Verbindlichkeiten' });
                this.setState({ isLoading: false });
            })
    }

    // rowClass(data) {
    //     return {
    //         "approvedRow": data.isApproved && data.isApproved === "Yes",
    //         "needApprovalRow": !data.isApproved || data.isApproved === "No",
    //     }
    // }

    onInstitutionSelected(obj) {
        this.setState({ SelectedInstituteName: obj })
    }

    onTranslatorSelected(obj) {
        this.setState({ SelectedTranslatorName: obj })
    }

    editMode(payable) {
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
                Rate: payable.rate != 0 ? payable.rate : CommonValues.RateCost,
                Hours: payable.hours,
                Discount: payable.discount,
                RideDistance: payable.rideCost,
                DailyAllowance: payable.dailyAllowance,
                Tax: payable.tax,
                TicketCost: payable.ticketCost,
                NetPayment: payable.netPayment,
                InvoiceId: payable.invoiceID,
                displayEditDialog: true,
            }, () => {
                this.calculateTotal();
            });
        }
    }

    confirmPayable(payable) {
        if (payable != undefined && payable != null) {
            this.setState({
                displayApproveDialog: true,
                selectedPayableId: payable.id
            })
        }
    }

    onApprovePayable() {
        var id = this.state.selectedPayableId;
        this.setState({ loadingModel: true });
        if (id != undefined && id != null && id != 0) {
            this.service.Approve(id).then(() => {
                var AllPayables = this.state.AllPayables;
                var ind = AllPayables.findIndex(x => x.id == id);
                AllPayables[ind].status = "bestätigt";

                this.growl.show({ severity: 'success', summary: 'Erfolg', detail: 'Verbindlichkeiten getilgt' });
                this.setState({
                    AllPayables,
                    displayApproveDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayApproveDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Fehler', detail: 'Fehler beim Zahlen' });
                });
        }
    }

    onMultiApprovePayable() {
        var objs = this.state.selectedPayable
        var lists = [];
        var AllPayables = this.state.AllPayables;

        if (objs && objs.length > 0) {
            objs.forEach(payable => {
                var id = payable.id;
                this.setState({ loadingModel: true });
                if (id != undefined && id != null && id != 0) {
                    lists.push({ id })
                }
            });

            this.service.ApproveMultiplePayables(lists).then(() => {
                lists.forEach(model => {
                    var ind = AllPayables.findIndex(x => x.id == model.id);
                    AllPayables[ind].status = "bestätigt";
                });

                this.growl.show({ severity: 'success', summary: 'Erfolg', detail: 'Alle Verbindlichkeiten wurden bezahlt' });
                this.setState({
                    AllPayables,
                    displayMultiApproveDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayMultiApproveDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Fehler', detail: 'Error Paying Payables' });
                });
        }
    }

    viewInvoice(payable) {
        if (payable) {
            this.props.history.push({
                pathname: ROUTES.REPORT_INVOICE,
                Invoice: payable
            })
        }
    }

    actionBodyTemplate(rowData) {
        var EditButton;
        var PaidButton;

        if (rowData.status != "bestätigt") {
            EditButton = <Button icon="pi pi-pencil" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-success p-mr-2"
                onClick={() => this.editMode(rowData)} title="Bearbeiten" />

            PaidButton = <Button icon="pi pi-check" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-info p-mr-2"
                onClick={() => this.confirmPayable(rowData)} title="bezahlen" />
        }

        return (
            <React.Fragment>
                <Button icon="pi pi-file" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-secondary p-mr-2"
                    onClick={() => this.viewInvoice(rowData)} title="Rechnung ansehen" />
                {PaidButton}
                {EditButton}

            </React.Fragment>
        );
    }

    ChangeStartOfTheTrip(val) {
        this.setState({ StartOfTheTrip: val }, () => { this.calculateHours() })
    }
    ChangeAppointmentStart(val) {
        this.setState({ AppointmentStart: val })
    }
    ChangeEndOfTheAppointment(val) {
        this.setState({ EndOfTheAppointment: val })
    }
    ChangeEndOfTheTrip(val) {
        this.setState({ EndOfTheTrip: val }, () => { this.calculateHours() })
    }

    calculateHours() {
        const { StartOfTheTrip, EndOfTheTrip } = this.state;
        if (StartOfTheTrip && StartOfTheTrip.length == 5 && EndOfTheTrip && EndOfTheTrip.length == 5) {
            //create date format
            if (!isNaN(Date.parse(new Date("01/01/2021 " + StartOfTheTrip)))
                && !isNaN(Date.parse(new Date("01/01/2021 " + EndOfTheTrip)))) {

                var timeStart = new Date("01/01/2021 " + StartOfTheTrip);
                var timeEnd = new Date("01/01/2021 " + EndOfTheTrip);

                var diff_in_minutes = this.Diff_minutes(timeEnd, timeStart);
                var ceil_diff_in_half_hours = Math.ceil(diff_in_minutes / 30) * 30;
                // var hourDiff = timeEnd.getMinutes() - timeStart.getMinutes();

                this.setState({ TotalHours: ceil_diff_in_half_hours / 60 }, this.calculateTotal())
            }
            else {
                this.setState({ TotalHours: 0 }, this.calculateTotal())
            }
        }
    }

    Diff_minutes(dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    }

    calculateTotal() {
        var { AppointmentType } = this.state

        if (AppointmentType === "SPRACHEN") {
            const { TotalHours, Tax, RideDistance, TicketCost, DailyAllowance } = this.state;
            var totalHoursCost = parseFloat(TotalHours) * CommonValues.HoursCost;
            var totalRideCost = parseFloat(RideDistance) * CommonValues.RideCost;
            var TotalDailyAllowance = parseFloat(DailyAllowance) * CommonValues.DailyAllowance;

            var SubTotal = totalHoursCost + totalRideCost + TotalDailyAllowance;
            var TotalTax = SubTotal * (Tax / 100);
            var NetPayment = SubTotal + TotalTax + parseFloat(TicketCost)

            this.setState({
                RideCost: totalRideCost.toFixed(2),
                TotalDailyAllowance: TotalDailyAllowance.toFixed(2),
                SubTotal: SubTotal.toFixed(2),
                NetPayment: NetPayment.toFixed(2),
                TotalTax: TotalTax.toFixed(2)
            })
        }
        if (AppointmentType === "SCHREIBEN") {
            const { WordCount, Tax, Rate, FlatRate, Postage, Paragraph } = this.state;
            var Lines = parseFloat(WordCount) / CommonValues.WordsPerLine * parseFloat(Rate);
            var TotalFlatRate = parseFloat(FlatRate) * CommonValues.FlatRateCost;
            var TotalPostage = parseFloat(Postage) * CommonValues.PostageCost;
            var TotalParagraph = parseFloat(Paragraph) * CommonValues.ParagraphCost;

            var SubTotal = Lines + TotalFlatRate + TotalPostage + TotalParagraph;
            var TotalTax = SubTotal * (Tax / 100);
            var NetPayment = SubTotal + TotalTax

            this.setState({
                Lines: Lines.toFixed(2),
                TotalFlatRate: TotalFlatRate.toFixed(2),
                TotalPostage: TotalPostage.toFixed(2),
                TotalParagraph: TotalParagraph.toFixed(2),
                SubTotal: SubTotal.toFixed(2),
                NetPayment: NetPayment.toFixed(2),
                TotalTax: TotalTax.toFixed(2)
            })
        }

    }

    calculateRideCost() {
        var { RideDistance, RideCost } = this.state;
        RideCost = RideDistance * CommonValues.RideCost;
        this.setState({ RideCost: RideCost.toFixed(2) }, () => this.calculateTotal())
    }

    getSpeakingFields() {
        return (
            <div>
                <h3 style={{ borderBottomStyle: 'solid', borderBottomWidth: 2, borderColor: 'black' }}>Reise Details</h3>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>

                        {/* <span className="ui-float-label">
                            <label htmlFor="float-input">Termin <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" maxLength={5} placeholder="00:00"
                                selected={this.state.StartOfTheTrip}
                                onChange={e => this.ChangeStartOfTheTrip(e.target.value)}
                            // className={this.state.isAppointmentDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                            />
                        </span> */}
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Reisebeginn</label>
                            <MaskedInput mask={[/[012]/, /2[0-3]|[0-1]?[\d]/, ':', /[0-5]/, /[0-9]/]} className="form-control" placeholder="00:00" guide={false}
                                value={this.state.StartOfTheTrip} onChange={(e) => { this.ChangeStartOfTheTrip(e.target.value) }} />
                            {/* <TimePicker className="form-control" time={this.state.StartOfTheTrip} theme="Ash" placeholder="Reisebeginn"
                                onSet={(val) => this.ChangeStartOfTheTrip(val.format24)} /> */}
                        </span>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Terminbeginn</label>
                            <MaskedInput mask={[/[012]/, /2[0-3]|[0-1]?[\d]/, ':', /[0-5]/, /[0-9]/]} className="form-control" placeholder="00:00" guide={false}
                                value={this.state.AppointmentStart} onChange={(e) => { this.ChangeAppointmentStart(e.target.value) }} />
                            {/* <TimePicker className="form-control" time={this.state.AppointmentStart} theme="Ash" placeholder="Terminbeginn time"
                                onSet={(val) => this.ChangeAppointmentStart(val.format24)} /> */}
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Terminende</label>
                            <MaskedInput mask={[/[012]/, /2[0-3]|[0-1]?[\d]/, ':', /[0-5]/, /[0-9]/]} className="form-control" placeholder="00:00" guide={false}
                                value={this.state.EndOfTheAppointment} onChange={(e) => { this.ChangeEndOfTheAppointment(e.target.value) }} />
                            {/* <TimePicker className="form-control" time={this.state.EndOfTheAppointment} theme="Ash" placeholder="Terminende time"
                                onSet={(val) => this.ChangeEndOfTheAppointment(val.format24)} /> */}
                        </span>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <span className="ui-float-label">
                            <label htmlFor="float-input">Ende der Reise</label>
                            <MaskedInput mask={[/[012]/, /2[0-3]|[0-1]?[\d]/, ':', /[0-5]/, /[0-9]/]} className="form-control" placeholder="00:00" guide={false}
                                value={this.state.EndOfTheTrip} onChange={(e) => { this.ChangeEndOfTheTrip(e.target.value) }} />
                            {/* <TimePicker className="form-control" time={this.state.EndOfTheTrip} theme="Ash" placeholder="Ende der Reise time"
                                onSet={(val) => this.ChangeEndOfTheTrip(val.format24)} /> */}
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Stunden insgesamt" PlaceholderText="Stunden insgesamt" Type="text"
                            Value={this.state.TotalHours}
                            //  onChange={(val) => this.setState({ TotalHours: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidTotalHours: val })}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Reisedistanz (KM)" PlaceholderText="Reisedistanz (KM)" Type="number"
                            Value={this.state.RideDistance} onChange={(val) => this.setState({ RideDistance: val }, () => this.calculateRideCost())}
                            ChangeIsValid={(val) => this.setState({ ValidRideDistance: val })}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Reisekosten" PlaceholderText="Reisekosten" Type="number" /* ReadOnly={true} */
                            Value={this.state.RideCost} onChange={(val) => this.setState({ RideCost: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidRideCost: val })}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                        <AMSInputField Label="Pauschale" PlaceholderText="Pauschale" Type="number"
                            Value={this.state.DailyAllowance} onChange={(val) => this.setState({ DailyAllowance: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidDailyAllowance: val })}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Ticketgebühren" PlaceholderText="Ticketgebühren" Type="number"
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
                <h3 style={{ borderBottomStyle: 'solid', borderBottomWidth: 2, borderColor: 'black' }}>Berechnung</h3>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Zeilen" PlaceholderText="Zeilen" Type="number"
                            Value={this.state.WordCount} onChange={(val) => this.setState({ WordCount: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidWordCount: val })}
                        />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Zeilenpreis" PlaceholderText="Zeilenpreis" Type="number"
                            Value={this.state.Rate} onChange={(val) => this.setState({ Rate: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidRate: val })}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Pauschale" PlaceholderText="Pauschale" Type="number"
                            Value={this.state.FlatRate} onChange={(val) => this.setState({ FlatRate: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidFlatRate: val })}
                        />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="§7Abs 2 " PlaceholderText="§7Abs 2 " Type="number"
                            Value={this.state.Paragraph} onChange={(val) => this.setState({ Paragraph: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidParagraph: val })}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Porto" PlaceholderText="Porto" Type="number"
                            Value={this.state.Postage} onChange={(val) => this.setState({ Postage: val }, () => this.calculateTotal())}
                            ChangeIsValid={(val) => this.setState({ ValidPostage: val })}
                        />
                    </div>
                </div>
            </div>
        )
    }
    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.state.filteredData);
                doc.save('payables.pdf');
            })
        })
    }

    exportCSV(selectionOnly) {
        this.dt.exportCSV({ selectionOnly });
    }

    onRowSelection(row) {
        var net = parseFloat(row.netPayment);
        var prev = parseFloat(this.state.SelectionTotal)
        this.setState({ SelectionTotal: parseFloat(prev + net).toFixed(2) })
    }
    onRowDeselection(row) {
        var net = parseFloat(row.netPayment);
        var prev = parseFloat(this.state.SelectionTotal)
        this.setState({ SelectionTotal: parseFloat(prev - net).toFixed(2) })
    }

    render() {
        var { disableFields, disableApproveButton, AppointmentType, Status, SelectionTotal } = this.state
        var header, FormFields, PayAllButton, UpdatePayableButton;
        if (this.state.selectedPayable && this.state.selectedPayable.length > 1) {
            PayAllButton = <div className="col-sm-4 col-md-4 col-lg-4" style={{ position: 'absolute', right: 0, display: 'inline' }}>
                <label className="col-sm-6 col-md-6 col-lg-6" style={{ fontSize: 16 }}>Total: {SelectionTotal}</label>
                <Button className="p-button-info col-sm-6 col-md-6 col-lg-6" icon="pi pi-tick" iconPos="left" label="Pay All"
                    onClick={(e) => this.setState({ displayMultiApproveDialog: true })} />
            </div>
        }
        header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Suche" size="20" />
            </div>
            <div className="col-sm-4 col-md-2 col-lg-2" style={{ float: 'right' }}>
                <Button style={{ borderRadius: 20 }} className="p-button-success" icon="pi pi-file-excel" onClick={() => this.exportCSV(false)} data-pr-tooltip="Excel" />
                <Button style={{ borderRadius: 20, marginLeft: 10 }} className="p-button-danger" icon="pi pi-file-pdf" onClick={() => this.exportPdf()} data-pr-tooltip="PDF" />
            </div>
            {PayAllButton}
        </div>

        if (Status == "Ausstehend") {
            UpdatePayableButton = <span className="ui-float-label" style={{ float: 'right' }}>
                <Button label="Verbindlichkeiten aktualisieren" className="ui-btns" disabled={this.state.isLoading} onClick={() => this.onEditPayable()} />
            </span>
        }

        if (AppointmentType === "SPRACHEN") {
            FormFields = this.getSpeakingFields()
        }
        if (AppointmentType === "SCHREIBEN") {
            FormFields = this.getWritingFields()
        }

        return (
            <div>
                {/* <Growl ref={(el) => this.growl = el}></Growl> */}
                <Toast ref={(el) => this.growl = el} />
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Verbindlichkeitenliste</h1>
                        <div className="p-grid" style={{ marginTop: '8px' }} ></div>
                        <div className="content-section implementation">
                            <DataTable ref={(el) => this.dt = el}
                                header={header} value={this.state.AllPayables}
                                // paginator={this.state.isLoading === false} rows={15}
                                onRowDoubleClick={this.dblClickPayable} responsive={true}
                                selection={this.state.selectedPayable} onValueChange={filteredData => this.setState({ filteredData })}
                                selectionMode="multiple" metaKeySelection={false}
                                onRowSelect={(e) => this.onRowSelection(e.data)}
                                onRowUnselect={(e) => this.onRowDeselection(e.data)}
                                onSelectionChange={e => this.setState({ selectedPayable: e.value })}
                                resizableColumns={true} columnResizeMode="fit" /*rowClassName={this.rowClass}*/
                                globalFilter={this.state.globalFilter}
                                paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                dataKey="id"
                                style={{ fontSize: 12 }}
                            >
                                <Column field="appointmentId" header="Aktenzeichen" sortable={true} />
                                <Column field="appointmentType" header="Typ" sortable={true} />
                                <Column field="appointmentInstitute" header="Auftraggeber" sortable={true} />
                                <Column field="appointmentTranslator" header="Dolmetscher/ Übersetzer" sortable={true} />
                                <Column field="netPayment" header="Insgesamt" sortable={true} />
                                <Column field="status" header="Status" sortable={true} />
                                <Column header="Aktion" body={this.actionBodyTemplate}></Column>
                            </DataTable>

                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ paddingTop: '20px' }}>
                                {this.state.isLoading === true ?
                                    <div>
                                        <p style={{ textAlign: 'center', fontSize: '20px' }}>Daten laden </p>
                                        <ProgressBar style={{ marginTop: '40px', height: '2px' }} mode="indeterminate" />
                                    </div>
                                    : null
                                }
                            </div>

                            <Dialog visible={this.state.displayMultiApproveDialog} width="300px" header="Sind Sie sicher, alle diese Rechnungen bezahlt zu markieren?"
                                modal={true} onHide={() => this.setState({ displayMultiApproveDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix" style={{ textAlign: 'center' }}>
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-success" onClick={() => this.onMultiApprovePayable()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayMultiApproveDialog: false })} />
                                    </div>
                                }
                            </Dialog>

                            <Dialog visible={this.state.displayApproveDialog} width="300px" header="Möchten Sie diese Rechnung wirklich als bezahlt markieren?"
                                modal={true} onHide={() => this.setState({ displayApproveDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix" style={{ textAlign: 'center' }}>
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-success" onClick={() => this.onApprovePayable()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayApproveDialog: false })} />
                                    </div>
                                }
                            </Dialog>

                            <Dialog visible={this.state.displayEditDialog} style={{ width: '60vw' }} header="Zahlungsinformationen"
                                modal={true} onHide={() => this.setState({ displayEditDialog: false })}
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
                                                            ChangeIsValid={(val) => this.setState({ ValidAppointmentId: val })}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Termin" Type="text" ReadOnly={true}
                                                            Value={this.state.AppointmentDate}
                                                            ChangeIsValid={(val) => this.setState({ ValidAppointmentDate: val })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Dolmetscher/ Übersetzer" Type="text" ReadOnly={true}
                                                            Value={this.state.AppointmentTranslator}
                                                            ChangeIsValid={(val) => this.setState({ ValidTranslator: val })}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Auftraggeber" Type="text" ReadOnly={true}
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
                                                        <AMSInputField Label="Insgesamt" PlaceholderText="Insgesamt" Type="number"
                                                            Value={this.state.SubTotal} ReadOnly={true}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="MwSt %" PlaceholderText="MwSt" Type="number"
                                                            Value={this.state.Tax} onChange={(val) => this.setState({ Tax: val }, () => this.calculateTotal())}
                                                            ChangeIsValid={(val) => this.setState({ ValidTax: val })}
                                                        />
                                                    </div>
                                                </div>
                                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                                <div className="row">
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <AMSInputField Label="Netto Betrag" PlaceholderText="Netto Betrag" Type="number"
                                                            Value={this.state.NetPayment} ReadOnly={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                    {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                                                </div>
                                                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ color: 'red' }}>
                                                    {this.state.error === true ? "Please fill all the required(red marked) fields" : null}
                                                </div>
                                                <div className="sm-4 md-2 lg-2">
                                                    {UpdatePayableButton}
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
export default ListPayables;