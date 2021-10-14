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
import PayableService from '../../../api/finance/payableService';
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

    AllPayables: [],
}

class ListPayables extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.service = new PayableService();
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
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
                this.setState({ AllPayables: data })
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
        const { selectedPayableId, AppointmentId_Fk, WordCount, Rate, Hours, Discount,
            NetPayment, RideCost, DailyAllowance, TicketCost, Type, Tax } = this.state

        let app = {
            Id: selectedPayableId,
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
            CreatedBy: this.props.authUser.id,
        }

        this.service.Edit(app)
            .then((data) => {
                if (data.success == true) {
                    this.growl.show({ severity: 'success', summary: 'Success', detail: 'Payable Updated' });
                    var editedPayable = data.appointment;
                    editedPayable.translatorName = app.TranslatorName;
                    editedPayable.institutionName = app.InstitutionName;

                    var AllPayables = this.state.AllPayables;
                    var ind = AllPayables.findIndex(x => x.id == editedPayable.id);
                    AllPayables[ind] = editedPayable;

                    this.setState({
                        AllPayables: AllPayables,
                        isLoading: false,
                        displayEditDialog: false
                    });
                    this.resetForm();
                }
            })
            .catch((error) => {
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while updating payable' });
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
                AppointmentDate: payable.appointmentDate,
                AppointmentInstitute: payable.appointmentInstitute,
                AppointmentTranslator: payable.appointmentTranslator,
                AppointmentType: payable.appointmentType,

                WordCount: payable.WordCount,
                Rate: payable.rate,
                Hours: payable.hours,
                Discount: payable.discount,
                NetPayment: payable.netPayment,
                Status: payable.status,
                RideCost: payable.rideCost,
                DailyAllowance: payable.dailyAllowance,
                TicketCost: payable.ticketCost,
                Type: payable.type,

                displayEditDialog: true,
            })
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
                AllPayables[ind].status = "Approved";

                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Paybale Paid Successfully' });
                this.setState({
                    AllPayables,
                    displayApproveDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayApproveDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error Paying Payable' });
                });
        }
    }

    viewInvoice(payable) {
        if (payable) {
            this.props.history.push({
                pathname: ROUTES.TRANSLATOR_INVOICE,
                Invoice: payable
            })
        }
    }

    actionBodyTemplate(rowData) {
        var EditButton;
        var PaidButton;

        if (rowData.status != "Approved") {
            EditButton = <Button icon="pi pi-pencil" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-success p-mr-2"
                onClick={() => this.editMode(rowData)} title="Edit" />

            PaidButton = <Button icon="pi pi-check" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-info p-mr-2"
                onClick={() => this.confirmPayable(rowData)} title="Paid" />
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
        this.setState({ StartOfTheTrip: val }, () => { this.calculateHours() })
    }
    ChangeEndOfTheAppointment(val) {
        this.setState({ EndOfTheAppointment: val }, () => { this.calculateHours() })
    }
    ChangeEndOfTheTrip(val) {
        this.setState({ EndOfTheTrip: val }, () => { this.calculateHours() })
    }
    calculateHours() {
        const { AppointmentStart, StartOfTheTrip, EndOfTheAppointment, EndOfTheTrip } = this.state;
        if (AppointmentStart && StartOfTheTrip && EndOfTheAppointment && EndOfTheTrip) {
            debugger

            //create date format          
            var timeStart = new Date("01/01/2021 " + AppointmentStart);
            var timeEnd = new Date("01/01/2021 " + StartOfTheTrip);

            var hourDiff = timeEnd.getHours() - timeStart.getHours();
            // var hourDiff = timeEnd.getMinutes() - timeStart.getMinutes();

            this.setState({ TotalHours: hourDiff })
        }
    }

    render() {
        var { disableFields, disableApproveButton, AppointmentType } = this.state
        var header, WrittenFields;

        header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="20" />
            </div>
            {/* <div className="col-sm-4 col-md-2 col-lg-2" style={{ position: 'absolute', right: 0 }}>
                <Button className="p-button-info" icon="pi pi-plus" iconPos="left" label="Add"
                    onClick={(e) => this.setState({ displayCreateDialog: true })} />
            </div> */}
        </div>

        if (AppointmentType === "SCHREIBEN") {
            WrittenFields = <div>
                <div className="row">
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                        <AMSInputField Label="Daily Allowance" PlaceholderText="Daily Allowance" Type="number"
                            Value={this.state.DailyAllowance} onChange={(val) => this.setState({ DailyAllowance: val })} />
                    </div>
                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                        <AMSInputField Label="Ticket Cost" PlaceholderText="Ticket Cost" Type="number"
                            Value={this.state.TicketCost} onChange={(val) => this.setState({ TicketCost: val })} />
                    </div>
                </div>
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
                            Value={this.state.TotalHours} onChange={(val) => this.setState({ TotalHours: val })} />
                    </div>
                </div>
            </div>
        }
        return (
            <div>
                <Growl ref={(el) => this.growl = el}></Growl>
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Payables List</h1>
                        <div className="p-grid" style={{ marginTop: '8px' }} ></div>
                        <div className="content-section implementation">
                            <DataTable ref={(el) => this.dt = el}
                                header={header} value={this.state.AllPayables}
                                // paginator={this.state.isLoading === false} rows={15}
                                onRowDoubleClick={this.dblClickPayable} responsive={true}
                                selection={this.state.selectedPayable}
                                onSelectionChange={e => this.setState({ selectedPayable: e.value })}
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
                                <Column field="netPayment" header="Net Payable" sortable={true} />
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
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-success" onClick={() => this.onApprovePayable()} />
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
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Appointment Date" Type="text" ReadOnly={true}
                                                            Value={this.state.AppointmentDate} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Translator" Type="text" ReadOnly={true}
                                                            Value={this.state.AppointmentTranslator}
                                                        />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Appointment Institute" Type="text" ReadOnly={true}
                                                            Value={this.state.AppointmentInstitute} />
                                                    </div>
                                                </div>
                                                <h3 style={{ borderBottomStyle: 'solid', borderBottomWidth: 2, borderColor: 'black' }}>Calculations</h3>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Word Count" PlaceholderText="Word Count" Type="number"
                                                            Value={this.state.WordCount} onChange={(val) => this.setState({ WordCount: val })} />
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Rate" PlaceholderText="Rate" Type="number"
                                                            Value={this.state.Rate} onChange={(val) => this.setState({ Rate: val })} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <AMSInputField Label="Hours" PlaceholderText="Hours" Type="number"
                                                            Value={this.state.Hours} onChange={(val) => this.setState({ Hours: val })} />
                                                    </div>
                                                </div>
                                                {
                                                    WrittenFields
                                                }

                                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Tax %" PlaceholderText="Tax" Type="number"
                                                            Value={this.state.Tax} onChange={(val) => this.setState({ Tax: val })} />
                                                    </div>
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Discount" PlaceholderText="Discount" Type="number"
                                                            Value={this.state.Discount} onChange={(val) => this.setState({ Discount: val })} />
                                                    </div>
                                                </div>
                                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                                <div className="row">
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <AMSInputField Label="Net Payment" PlaceholderText="Net Payment" Type="number"
                                                            Value={this.state.NetPayment} onChange={(val) => this.setState({ NetPayment: val })} />
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
                                                        <Button label="Update Payable" className="ui-btns" disabled={this.state.isLoading} onClick={() => this.onEditPayable()} />
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
export default ListPayables;