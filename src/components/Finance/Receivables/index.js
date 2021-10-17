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
    displayMultiApproveDialog: false,
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
            displayMultiApproveDialog: false,
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
                    var editedReceivable = data.finance;
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

                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Received Successfully' });
                this.setState({
                    AllReceivables,
                    displayApproveDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayApproveDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error Receiving' });
                });
        }
    }


    onMultiApproveReceivable() {
        var objs = this.state.selectedReceivable
        var lists = [];
        var AllReceivables = this.state.AllReceivables;

        if (objs && objs.length > 0) {
            objs.forEach(rec => {
                var id = rec.id;
                this.setState({ loadingModel: true });
                if (id != undefined && id != null && id != 0) {
                    lists.push({ id })
                }
            });

            this.service.ApproveMultipleReceivables(lists).then(() => {
                lists.forEach(model => {
                    var ind = AllReceivables.findIndex(x => x.id == model.id);
                    AllReceivables[ind].status = "Approved";
                });

                this.growl.show({ severity: 'success', summary: 'Success', detail: 'All Received Successfully' });
                this.setState({
                    AllReceivables,
                    displayMultiApproveDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayMultiApproveDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error Receiving' });
                });
        }
    }

    actionBodyTemplate(rowData) {
        var EditButton;
        var PaidButton;

        if (rowData.status != "Approved") {
            EditButton = <Button icon="pi pi-pencil" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-success p-mr-2"
                onClick={() => this.editMode(rowData)} title="Edit" />

            PaidButton = <Button icon="pi pi-check" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-info p-mr-2"
                onClick={() => this.confirmReceivable(rowData)} title="Receive" />
        }

        return (
            <React.Fragment>
                {PaidButton}
                {EditButton}
            </React.Fragment>
        );
    }

    calculateTotal() {
        var { SubTotal, Tax } = this.state;
        if (!SubTotal || SubTotal == undefined) {
            SubTotal = 0.0;
        }
        if (!Tax || Tax == undefined) {
            Tax = 0.0;
        }
        SubTotal = parseFloat(SubTotal);
        Tax = parseFloat(Tax);

        var TotalTax = SubTotal * (Tax / 100);
        var NetPayment = SubTotal + TotalTax;

        this.setState({
            SubTotal: SubTotal.toFixed(2),
            NetPayment: NetPayment.toFixed(2),
            TotalTax: TotalTax.toFixed(2)
        })
    }


    render() {
        var { disableFields, disableApproveButton, AppointmentType, Status } = this.state
        var header, FormFields, UpdateReceivableButton, ReceiveAllButton;

        if (this.state.selectedReceivable && this.state.selectedReceivable.length > 1) {
            ReceiveAllButton = <div className="col-sm-4 col-md-2 col-lg-2" style={{ position: 'absolute', right: 0 }}>
                <Button className="p-button-info" icon="pi pi-tick" iconPos="left" label="Receive All"
                    onClick={(e) => this.setState({ displayMultiApproveDialog: true })} />
            </div>
        }

        if (Status == "Pending") {
            UpdateReceivableButton = <span className="ui-float-label" style={{ float: 'right' }}>
                <Button label="Update Receivable" className="ui-btns" disabled={this.state.isLoading} onClick={() => this.onEditReceivable()} />
            </span>
        }

        header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="20" />
            </div>
            {ReceiveAllButton}
        </div>

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
                                selectionMode="multiple" metaKeySelection={false}
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

                            <Dialog visible={this.state.displayApproveDialog} width="300px" header="You sure to mark this Invoice Received?"
                                modal={true} onHide={() => this.setState({ displayApproveDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix">
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-success" onClick={() => this.onApproveReceivable()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayApproveDialog: false })} />
                                    </div>
                                }
                            </Dialog>

                            <Dialog visible={this.state.displayMultiApproveDialog} width="300px" header="You sure to mark all these Invoices Received?"
                                modal={true} onHide={() => this.setState({ displayMultiApproveDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix">
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-success" onClick={() => this.onMultiApproveReceivable()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayMultiApproveDialog: false })} />
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
                                                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                    {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                                                </div>
                                                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ color: 'red' }}>
                                                    {this.state.error === true ? "Please fill all the required(red marked) fields" : null}
                                                </div>
                                                <div className="sm-4 md-2 lg-2">
                                                    {UpdateReceivableButton}
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