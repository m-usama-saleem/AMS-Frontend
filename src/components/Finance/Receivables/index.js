import React, { Component } from 'react';

import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
//import {DataTableCrudDoc} from 'primereact/datatablecruddoc';
import { Toast } from 'primereact/toast';
// import { Growl } from 'primereact/growl';
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
import { ListAppointmentType } from '../../../constants/staticValues';

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
    filteredData: [],
    SelectionTotal: 0
}

class ListReceivables extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.service = new ReceivableService();
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
        this.exportPdf = this.exportPdf.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
        this.cols = [
            { field: 'appointmentId', header: 'Aktenzeichen' },
            { field: 'appointmentType', header: 'Typ' },
            { field: 'appointmentInstitute', header: 'Auftraggeber' },
            { field: 'appointmentTranslator', header: 'Dolmetscher/ Übersetzer' },
            { field: 'netPayment', header: 'Forderungen Netto' },
            { field: 'status', header: 'Status' },
        ];
        this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
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
                this.setState({ AllReceivables: data, filteredData: data })
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
        const { selectedReceivableId, AppointmentId_Fk, SubTotal, NetPayment, Type, Tax, } = this.state

        let app = {
            Id: selectedReceivableId,
            AppointmentId_Fk,
            Status: 'Ausstehend',
            Type,
            Rate: SubTotal,
            Tax,
            NetPayment,
            CreatedBy: this.props.authUser.id,
        }

        this.service.Edit(app)
            .then((data) => {
                if (data.success == true) {
                    this.growl.show({ severity: 'success', summary: 'Success', detail: 'Forderungen erfolgreich aktualisiert' });
                    var AllReceivables = this.state.AllReceivables;
                    var editedReceivable = data.finance;
                    var ind = AllReceivables.findIndex(x => x.id == editedReceivable.id);

                    AllReceivables[ind].tax = app.Tax;
                    AllReceivables[ind].subTotal = app.Rate;
                    AllReceivables[ind].rate = app.Rate;
                    AllReceivables[ind].netPayment = app.NetPayment;

                    this.setState({
                        AllReceivables: AllReceivables,
                        isLoading: false,
                        displayEditDialog: false
                    }, () => {
                        this.resetForm();
                    });
                }
            })
            .catch((error) => {
                this.growl.show({ severity: 'error', summary: 'Error', detail: 'Fehler: beim aktualisieren von Forderungen' });
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
                SubTotal: receivable.rate,
                Tax: receivable.tax,
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
                AllReceivables[ind].status = "bestätigt";

                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Forderungen erhalten' });
                this.setState({
                    AllReceivables,
                    displayApproveDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayApproveDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Fehler beim Erhalten' });
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
                    AllReceivables[ind].status = "bestätigt";
                });

                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Alle Forderungen erhalten' });
                this.setState({
                    AllReceivables,
                    displayMultiApproveDialog: false,
                    loadingModel: false,
                    error: ''
                })
            })
                .catch(error => {
                    this.setState({ loading: false, error: error, displayMultiApproveDialog: false, })
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Fehler beim Erhalten' });
                });
        }
    }

    actionBodyTemplate(rowData) {
        var EditButton;
        var PaidButton;

        if (rowData.status != "bestätigt") {
            EditButton = <Button icon="pi pi-pencil" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-success p-mr-2"
                onClick={() => this.editMode(rowData)} title="Bearbeiten" />

            PaidButton = <Button icon="pi pi-check" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-info p-mr-2"
                onClick={() => this.confirmReceivable(rowData)} title="erhalten" />
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
            NetPayment: NetPayment.toFixed(2),
            TotalTax: TotalTax.toFixed(2)
        })
    }

    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(this.exportColumns, this.state.filteredData);
                doc.save('receivables.pdf');
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
        var header, FormFields, UpdateReceivableButton, ReceiveAllButton;

        if (this.state.selectedReceivable && this.state.selectedReceivable.length > 1) {
            ReceiveAllButton = <div className="col-sm-6 col-md-4 col-lg-4" style={{ position: 'absolute', right: 0, display: 'inline' }}>
                <label className="col-sm-6 col-md-6 col-lg-6" style={{ fontSize: 16 }}>Total: {SelectionTotal}</label>
                <Button className="p-button-info col-sm-6 col-md-6 col-lg-6" icon="pi pi-tick" iconPos="left" label="Receive All"
                    onClick={(e) => this.setState({ displayMultiApproveDialog: true })} />
            </div>
        }

        if (Status == "Ausstehend") {
            UpdateReceivableButton = <span className="ui-float-label" style={{ float: 'right' }}>
                <Button label="Forderungen aktualisieren" className="ui-btns" disabled={this.state.isLoading} onClick={() => this.onEditReceivable()} />
            </span>
        }

        header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Suche" size="20" />
            </div>
            <div className="col-sm-4 col-md-2 col-lg-2" style={{ float: 'right' }}>
                <Button style={{ borderRadius: 20 }} className="p-button-success" icon="pi pi-file-excel" onClick={() => this.exportCSV(false)} data-pr-tooltip="Excel" />
                <Button style={{ borderRadius: 20, marginLeft: 10 }} className="p-button-danger" icon="pi pi-file-pdf" onClick={() => this.exportPdf()} data-pr-tooltip="PDF" />
            </div>
            {ReceiveAllButton}
        </div>

        return (
            <div>
                {/* <Growl ref={(el) => this.growl = el}></Growl> */}
                <Toast ref={(el) => this.growl = el} />
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Liste der Forderungen</h1>
                        <div className="p-grid" style={{ marginTop: '8px' }} ></div>
                        <div className="content-section implementation">
                            <DataTable ref={(el) => this.dt = el}
                                header={header} value={this.state.AllReceivables}
                                // paginator={this.state.isLoading === false} rows={15}
                                onRowDoubleClick={this.dblClickReceivable} responsive={true}
                                selection={this.state.selectedReceivable} onValueChange={filteredData => this.setState({ filteredData })}
                                selectionMode="multiple" metaKeySelection={false}
                                onRowSelect={(e) => this.onRowSelection(e.data)}
                                onRowUnselect={(e) => this.onRowDeselection(e.data)}
                                onSelectionChange={e => this.setState({ selectedReceivable: e.value })}
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
                                <Column field="netPayment" header="Forderungen Netto" sortable={true} />
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

                            <Dialog visible={this.state.displayApproveDialog} width="300px" header="Möchten Sie diese Rechnung wirklich als erhalten markieren?"
                                modal={true} onHide={() => this.setState({ displayApproveDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix" style={{ textAlign: 'center' }}>
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-success" onClick={() => this.onApproveReceivable()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayApproveDialog: false })} />
                                    </div>
                                }
                            </Dialog>

                            <Dialog visible={this.state.displayMultiApproveDialog} width="300px" header="Sind Sie sicher, dass Sie alle diese Rechnungen als erhalten markieren?"
                                modal={true} onHide={() => this.setState({ displayMultiApproveDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix" style={{ textAlign: 'center' }}>
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-success" onClick={() => this.onMultiApproveReceivable()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayMultiApproveDialog: false })} />
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

                                                <hr style={{ lineHeight: 5, borderColor: 'black' }}></hr>
                                                <div className="row">
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <AMSInputField Label="Insgesamt" PlaceholderText="Insgesamt" Type="number"
                                                            Value={this.state.SubTotal} onChange={(val) => this.setState({ SubTotal: val }, () => this.calculateTotal())}
                                                            ChangeIsValid={(val) => this.setState({ SubTotal: val })}
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