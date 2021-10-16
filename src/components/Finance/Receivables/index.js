import React, { Component } from 'react';

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
import TimePicker from '../../timepicker';
import { RadioButton } from 'primereact/radiobutton';
import Select from 'react-select'

import "react-datepicker/dist/react-datepicker.css";
import ReceivableService from '../../../api/finance/receivableService';
import * as ROLES from '../../../constants/roles';
import * as ROUTES from '../../../constants/routes';
import AMSInputField from '../../Common/AMSInputField';
import { ListAppointmentType } from '../../../constants/languages';

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
    isUploading: '',
    Id: 0,
    AppointmentId: '',
    Tax: 19,

    displayApproveDialog: false,
    disableFields: false,
    disableApproveButton: true,
    displayCreateDialog: false,

    AllReceivables: [],
}

class ListReceivables extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.service = new ReceivableService();
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
    }

    getLists() {
        this.getReceivableList();
    }

    componentDidMount() {
        this.getLists();
    }

    getReceivableList() {
        this.service.GetAll().then(data => {
            if (data && data !== "" && data.length > 0) {
                this.setState({ AllReceivables: data })
            }
        })
            .catch(err => {
                this.growl.show({ severity: 'error', summary: 'Error', detail: err });
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
            disableApproveButton: true,
            displayCreateDialog: false
        }, () => {
            // this.getLists();
        })
    }

    dblClickReceivable = (e) => {
        this.editMode(e.data)
    }

    onEditReceivable() {
        this.setState({ isLoading: true });
        let result = this.validateForm();
        if (result !== false) {
            this.EditReceivable();
        }
    }

    EditReceivable() {
        const { selectedReceivableId, AppointmentId_Fk, WordCount, Rate, Hours, Discount,
            NetPayment, RideCost, DailyAllowance, TicketCost, Type, Tax, StartOfTheTrip,
            AppointmentStart, EndOfTheAppointment, EndOfTheTrip, TotalHours } = this.state

        let app = {
            Id: selectedReceivableId,
            AppointmentId_Fk,
            Status: 'Pending',
            Type,
            WordCount,
            Rate,
            Hours,
            Discount,
            RideCost,
            DailyAllowance,
            Tax,
            TicketCost,
            NetPayment,
            StartOfTheTrip,
            AppointmentStart,
            EndOfTheAppointment,
            EndOfTheTrip,
            TotalHours,
            CreatedBy: this.props.authUser.id,
        }

        this.service.Edit(app)
            .then((data) => {
                if (data.success == true) {
                    this.growl.show({ severity: 'success', summary: 'Success', detail: 'Receivable Updated' });
                    var editedReceivable = data.appointment;
                    editedReceivable.translatorName = app.TranslatorName;
                    editedReceivable.institutionName = app.InstitutionName;

                    var AllReceivables = this.state.AllReceivables;
                    var ind = AllReceivables.findIndex(x => x.id == editedReceivable.id);
                    AllReceivables[ind] = editedReceivable;

                    this.setState({
                        AllReceivables: AllReceivables,
                        isLoading: false,
                        displayEditDialog: false
                    });
                    this.resetForm();
                }
            })
            .catch((error) => {
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while updating Receivable' });
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

    editMode(receivable) {
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
                StartOfTheTrip: receivable.startOfTheTrip,
                AppointmentStart: receivable.appointmentStart,
                EndOfTheAppointment: receivable.endOfTheAppointment,
                EndOfTheTrip: receivable.endOfTheTrip,
                TotalHours: receivable.totalHours,
                WordCount: receivable.WordCount,
                Rate: receivable.rate,
                Hours: receivable.hours,
                Discount: receivable.discount,
                RideCost: receivable.rideCost,
                DailyAllowance: receivable.dailyAllowance,
                Tax: receivable.tax,
                TicketCost: receivable.ticketCost,
                NetPayment: receivable.netPayment,

                displayEditDialog: true,
            }, () => {
                this.calculateTotal();
            });
        }
    }

    confirmReceivable(receivable) {
        if (receivable != undefined && receivable != null) {
            this.setState({
                displayApproveDialog: true,
                selectedReceivableId: receivable.id
            })
        }
    }

    onApproveReceivable() {
        var id = this.state.selectedReceivableId;
        this.setState({ loadingModel: true });
        if (id != undefined && id != null && id != 0) {
            this.service.Approve(id).then(() => {
                var AllReceivables = this.state.AllReceivables;
                var ind = AllReceivables.findIndex(x => x.id == id);
                AllReceivables[ind].status = "Approved";

                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Paybale Paid Successfully' });
                this.setState({
                    AllReceivables,
                    displayApproveDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayApproveDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error Paying Receivable' });
                });
        }
    }

    viewInvoice(receivable) {
        if (receivable) {
            if (receivable.appointmentType === "SPRACHEN") {
                this.props.history.push({
                    pathname: ROUTES.TRANSLATOR_INVOICE_SPEAKING,
                    Invoice: receivable
                })
            }
            else if (receivable.appointmentType === "SCHREIBEN") {
                this.props.history.push({
                    pathname: ROUTES.TRANSLATOR_INVOICE,
                    Invoice: receivable
                })
            }
        }
    }

    actionBodyTemplate(rowData) {
        var EditButton;
        var PaidButton;

        if (rowData.status != "Approved") {
            EditButton = <Button icon="pi pi-pencil" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-success p-mr-2"
                onClick={() => this.editMode(rowData)} title="Edit" />

            PaidButton = <Button icon="pi pi-check" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-info p-mr-2"
                onClick={() => this.confirmReceivable(rowData)} title="Paid" />
        }

        return (
            <React.Fragment>
                <Button icon="pi pi-file" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-secondary p-mr-2"
                    onClick={() => this.viewInvoice(rowData)} title="View Invoice" />
                {PaidButton}
                {EditButton}

            </React.Fragment>
        );
    }

    ChangeAppointmentStart(val) {
        this.setState({ AppointmentStart: val }, () => { this.calculateHours() })
    }
    ChangeStartOfTheTrip(val) {
        this.setState({ StartOfTheTrip: val })
    }
    ChangeEndOfTheAppointment(val) {
        this.setState({ EndOfTheAppointment: val })
    }
    ChangeEndOfTheTrip(val) {
        this.setState({ EndOfTheTrip: val }, () => { this.calculateHours() })
    }
    calculateHours() {
        const { StartOfTheTrip, EndOfTheTrip } = this.state;
        if (StartOfTheTrip && EndOfTheTrip) {
            //create date format          
            var timeStart = new Date("01/01/2021 " + StartOfTheTrip);
            var timeEnd = new Date("01/01/2021 " + EndOfTheTrip);

            var hourDiff = timeEnd.getHours() - timeStart.getHours();
            // var hourDiff = timeEnd.getMinutes() - timeStart.getMinutes();

            this.setState({ TotalHours: hourDiff }, this.calculateTotal())
        }
    }
    calculateTotal() {
        var { AppointmentType } = this.state

        if (AppointmentType === "SPRACHEN") {
            const { TotalHours, Tax, RideCost, TicketCost, DailyAllowance } = this.state;
            var totalHoursCost = parseFloat(TotalHours) * 85.00;
            var totalRideCost = parseFloat(RideCost) * 0.42;
            var TotalDailyAllowance = parseFloat(DailyAllowance) * 14;

            var SubTotal = totalHoursCost + totalRideCost + TotalDailyAllowance;
            var TotalTax = SubTotal * (Tax / 100);
            var NetPayment = SubTotal + TotalTax + parseFloat(TicketCost)

            this.setState({
                SubTotal: SubTotal.toFixed(2),
                NetPayment: NetPayment.toFixed(2),
                TotalDailyAllowance: TotalDailyAllowance.toFixed(2),
                TotalTax: TotalTax.toFixed(2)
            })
        }
        if (AppointmentType === "SCHREIBEN") {
            // const { WordCount, Tax, Rate } = this.state;
            // var Lines = WordCount / 55 * Rate;

            // var SubTotal = totalHoursCost + totalRideCost + TotalDailyAllowance;
            // var TotalTax = SubTotal * (Tax / 100);
            // var NetPayment = SubTotal + TotalTax + parseFloat(TicketCost)

            // this.setState({
            //     SubTotal: SubTotal.toFixed(2),
            //     NetPayment: NetPayment.toFixed(2),
            //     TotalDailyAllowance: TotalDailyAllowance.toFixed(2),
            //     TotalTax: TotalTax.toFixed(2)
            // })
        }

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
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Ride Cost" PlaceholderText="Ride Cost" Type="number"
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
                            Value={this.state.WordCount} onChange={(val) => this.setState({ WordCount: val })}
                            ChangeIsValid={(val) => this.setState({ ValidWordCount: val })}
                        />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Rate" PlaceholderText="Rate" Type="number"
                            Value={this.state.Rate} onChange={(val) => this.setState({ Rate: val })}
                            ChangeIsValid={(val) => this.setState({ ValidRate: val })}
                        />
                    </div>
                </div>
            </div>
        )
    }
    render() {
        var { disableFields, disableApproveButton, AppointmentType } = this.state
        var header, FormFields;

        header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="20" />
            </div>
            {/* <div className="col-sm-4 col-md-2 col-lg-2" style={{ position: 'absolute', right: 0 }}>
                <Button className="p-button-info" icon="pi pi-plus" iconPos="left" label="Add"
                    onClick={(e) => this.setState({ displayCreateDialog: true })} />
            </div> */}
        </div>

        if (AppointmentType === "SPRACHEN") {
            FormFields = this.getSpeakingFields()
        }
        if (AppointmentType === "SCHREIBEN") {
            FormFields = this.getWritingFields()
        }

        return (
            <div>
                <Growl ref={(el) => this.growl = el}></Growl>
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Receivables List</h1>
                        <div className="p-grid" style={{ marginTop: '8px' }} ></div>
                        <div className="content-section implementation">
                            <DataTable ref={(el) => this.dt = el}
                                header={header} value={this.state.AllReceivables}
                                // paginator={this.state.isLoading === false} rows={15}
                                onRowDoubleClick={this.dblClickReceivable} responsive={true}
                                selection={this.state.selectedReceivable}
                                onSelectionChange={e => this.setState({ selectedReceivable: e.value })}
                                resizableColumns={true} columnResizeMode="fit" /*rowClassName={this.rowClass}*/
                                globalFilter={this.state.globalFilter}
                                sortField="appointmentDate" sortOrder={1}
                                paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                dataKey="id"
                            >
                                <Column field="appointmentId" header="Appointment ID" sortable={true} />
                                <Column field="appointmentType" header="Type" sortable={true} />
                                <Column field="appointmentInstitute" header="Institute" sortable={true} />
                                <Column field="appointmentTranslator" header="Translator" sortable={true} />
                                <Column field="netPayment" header="Net Receivable" sortable={true} />
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

                            <Dialog visible={this.state.displayApproveDialog} width="300px" header="You sure to mark this Invoice Paid?"
                                modal={true} onHide={() => this.setState({ displayApproveDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix">
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-success" onClick={() => this.onApproveReceivable()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayApproveDialog: false })} />
                                    </div>
                                }
                            </Dialog>

                            <Dialog visible={this.state.displayEditDialog} style={{ width: '60vw' }} header="Payment Information"
                                modal={true} onHide={() => this.setState({ displayEditDialog: false })}
                                contentStyle={{ maxHeight: "550px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid">
                                        <div className="card card-w-title">
                                            <h1>Edit Payment Information</h1>
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
                                                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                    {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                                                </div>
                                                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ color: 'red' }}>
                                                    {this.state.error === true ? "Please fill all the required(red marked) fields" : null}
                                                </div>
                                                <div className="sm-4 md-2 lg-2">
                                                    <span className="ui-float-label" style={{ float: 'right' }}>
                                                        <Button label="Update Receivable" className="ui-btns" disabled={this.state.isLoading} onClick={() => this.onEditReceivable()} />
                                                    </span>
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
export default ListReceivables;