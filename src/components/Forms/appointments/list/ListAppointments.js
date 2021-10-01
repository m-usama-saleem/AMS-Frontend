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
    Attachments: '',
    files: [],

    displayDeleteDialog: false,
    disableFields: false,
    disableDeleteButton: true,
    disableApproveButton: true,
    displayCreateDialog: false,

    isAppointmentIdValid: true,
    isAppointmentDateValid: true,
    isTypeValid: true,

    AllAppointments: [],
    AllInstitutions: [],
    AllTranslators: []
}

class ListAppointments extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.service = new AppointmentService();
    }

    getLists() {
        // var role = this.props.authUser.roles;
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

    // getClientName() {
    //     this.service.GetClients().then(data => {
    //         this.setState({
    //             ClientNames: data
    //         })
    //     });
    // }

    getAppointmentList(id) {
        this.service.GetAll(id).then(data => {
            if (data && data !== "" && data.length > 0) {
                // data.forEach(element => {
                //     element.date = new Date(element.date).toDateString()
                // });
                this.setState({ AllAppointments: data })
            }
        })
            .catch(err => {
                this.growl.show({ severity: 'error', summary: 'Error', detail: err });
            })

    }

    validateForm = () => {
        let error = "";
        if (!this.state.StartDate || (this.state.StartDate && this.state.StartDate.toString().trim() === '')) {
            this.setState({ isAppointmentDateValid: false });
            error += "Date cannot be empty \n";
        } else { this.setState({ isAppointmentDateValid: true }); }

        if (!this.state.SelectedClientName.userId || (this.state.SelectedClientName && this.state.SelectedClientName.userId &&
            this.state.SelectedClientName.userId.trim() === '')) {
            this.setState({ isSelectedClientNameValid: false });
            error += "Client Name cannot be empty \n";
        } else { this.setState({ isSelectedClientNameValid: true }); }

        if (this.state.SiteAddress.trim() === '') {
            this.setState({ isSiteAddressValid: false });
            error += "Site Address cannot be empty \n";
        } else { this.setState({ isSiteAddressValid: true }); }

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
            isUploading: '',
            StartDate: '',
            StartTime: '',
            EndTime: '',
            ClientNames: [],
            SelectedClientName: '',
            SiteAddress: '',
            TimeDetails: '',

            isAppointmentDateValid: true,
            isAppointmentIdValid: true,
            isTypeValid: true,

            disableFields: false,
            displayDeleteDialog: false,
            disableDeleteButton: true,
            disableApproveButton: true,
            AllAppointments: [],
            displayCreateDialog: false
        }, () => {
            this.getLists();
        })
    }

    // Delete = () => {
    //     var Obj = {
    //         SysSerial: this.state.SecurityLogId,
    //         ClientId: this.state.SelectedClientName.userId,                    //"1",
    //         Date: this.state.StartDate,                                 //"2020/03/03",
    //         EndTime: this.state.EndTime,                                //"2020/03/03",
    //         SiteAddress: this.state.SiteAddress,                        //"abc",
    //         StartTime: this.state.StartTime,                            //"2020/03/03",
    //         TimeDetails: this.state.TimeDetails,                        //"abc"
    //     }

    //     try {
    //         this.service.Delete(Obj).then(() => {
    //             this.resetForm();
    //             this.setState({
    //                 displayDialog: false,
    //                 displayDeleteDialog: false,
    //                 disableDeleteButton: true,
    //                 disableApproveButton: true
    //             })
    //         })
    //     } catch (e) {
    //         debugger;
    //         this.growl.show({ severity: 'error', summary: 'Error', detail: 'Cannot Delete' });
    //         this.setState({ isLoading: false });
    //         console.log(e);
    //     }
    // }

    dblClickAppointment = (e) => {
        console.log("e.data")
        console.log(e.data)
        this.setState({
            displayDialog: true,
            // StartDate: new Date(e.data.date),
            // SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },

            AppointmentId: e.data.appointmentId,
            AppointmentDate: e.data.appointmentDate,
            TranslatorName: e.data.translatorName,
            InstitutionName: e.data.institutionName,
            Type: e.data.type,

            disableDeleteButton: false,
            // SecurityLog: Object.assign({}, e.data)
        });

    }

    onClientSelected(name) {
        this.setState({ SelectedClientName: name.value })
    }

    // SaveEdit = (approve) => {
    //     var validForm = this.validateForm();
    //     if (validForm) {

    //         var Obj = {
    //             SysSerial: this.state.SecurityLogId,
    //             ClientId: this.state.SelectedClientName.userId,                    //"1",
    //             Date: this.state.StartDate.toLocaleString(),                                 //"2020/03/03",
    //             EndTime: this.state.EndTime,                                //"2020/03/03",
    //             SiteAddress: this.state.SiteAddress,                        //"abc",
    //             StartTime: this.state.StartTime,                            //"2020/03/03",
    //             TimeDetails: this.state.TimeDetails,                        //"abc"
    //         }

    //         this.service
    //             .Edit(Obj)
    //             .then(() => {
    //                 if (approve && approve === true) {
    //                     this.growl.show({ severity: 'success', summary: 'Success', detail: 'Approved' });
    //                 }
    //                 else {
    //                     this.growl.show({ severity: 'success', summary: 'Success', detail: 'Successfully Updated' });
    //                 }
    //                 this.setState({
    //                     displayDialog: false,
    //                     disableDeleteButton: true,
    //                     disableApproveButton: true
    //                 })
    //                 this.resetForm();
    //             })
    //             .catch((error) => {
    //                 this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while updating' });
    //                 this.setState({ isLoading: false });
    //             })
    //     }
    //     else {

    //     }
    // }
    onAppointmentRowSelect(e) {
        this.setState({
            // StartDate: new Date(e.data.date),
            // SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            AppointmentId: e.data.appointmentId,
            AppointmentDate: e.data.appointmentDate,
            TranslatorName: e.data.translatorName,
            InstitutionName: e.data.institutionName,
            Type: e.data.type,
            disableDeleteButton: false,
        })

    }

    // ApproveSecurityReport() {
    //     this.SaveEdit(true);
    // }

    // rowClass(data) {
    //     return {
    //         "approvedRow": data.isApproved && data.isApproved === "Yes",
    //         "needApprovalRow": !data.isApproved || data.isApproved === "No",
    //     }
    // }

    showDeleteModal() {
        if (this.state.selectedAppointment && this.state.selectedAppointment !== null && this.state.selectedAppointment !== "") {
            this.setState({
                displayDeleteDialog: true
            })
        }
    }

    onInstitutionSelected(obj) {
        this.setState({ SelectedClientName: obj })
    }
    onTranslatorSelected(obj) {
        this.setState({ SelectedTranslatorName: obj })
    }
    setStartDate(date) {
        this.setState({ StartDate: date })
    }

    editProduct(product) {
        // this.setState({
        //     product: { ...product },
        //     productDialog: true
        // });
    }

    confirmDeleteProduct(product) {
        // this.setState({
        //     product,
        //     deleteProductDialog: true
        // });
    }

    deleteProduct() {
        // let products = this.state.products.filter(val => val.id !== this.state.product.id);
        // this.setState({
        //     products,
        //     deleteProductDialog: false,
        //     product: this.emptyProduct
        // });
        // this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-success p-mr-2" onClick={() => this.editProduct(rowData)} />
                <Button icon="pi pi-trash" style={{ float: 'right' }} className="p-button-rounded p-button-danger" onClick={() => this.confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    render() {
        var { disableFields, disableDeleteButton, disableApproveButton } = this.state
        var header;
        let dialogFooter;

        header = <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="20" />
            </div>
            <div className="col-sm-4 col-md-2 col-lg-2" style={{ position: 'absolute', right: 0 }}>
                <Button className="p-button-info" icon="pi pi-plus" iconPos="left" label="Add"
                    onClick={(e) => this.setState({ displayCreateDialog: true })} />
            </div>

        </div>

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
                                onRowDoubleClick={this.dblClickAppointment} responsive={true} selectionMode="single"
                                selection={this.state.selectedAppointment}
                                onSelectionChange={e => this.setState({ selectedAppointment: e.value })}
                                resizableColumns={true} columnResizeMode="fit" /*rowClassName={this.rowClass}*/ globalFilter={this.state.globalFilter}
                                onRowClick={e => this.onAppointmentRowSelect(e)} sortField="appointmentDate" sortOrder={1}
                                paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                dataKey="id"
                            >
                                <Column field="appointmentId" header="Appointment ID" sortable={true} />
                                <Column field="appointmentDate" header="Appointment Date" sortable={true} />
                                <Column field="translatorName" header="Translator" sortable={true} />
                                <Column field="institutionName" header="Institution" sortable={true} />
                                <Column field="type" header="Type" sortable={true} />
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
                                    <div className="ui-dialog-buttonpane p-clearfix">
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-danger" onClick={() => this.Delete()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayDeleteDialog: false })} />
                                    </div>
                                }
                            </Dialog>

                            <Dialog visible={this.state.displayDialog} style={{ width: '60vw' }} header="Appointment Information"
                                modal={true} footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}
                                contentStyle={{ maxHeight: "550px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid">
                                        <div className="card card-w-title">
                                            <h1>Edit Appointment Information</h1>
                                            <div className="p-grid" >
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Appointment ID <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholderText="Unique Appointment ID" value={this.state.AppointmentId} type="text" size="30"
                                                                onChange={(e) => this.setState({ AppointmentId: e.target.value })}
                                                                style={this.state.isAppointmentIdValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date</label>
                                                            <InputText placeholderText="Select Date" value={new Date().toDateString()} type="text" size="30" disabled={true} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Translator Name<span style={{ color: 'red' }}>*</span></label>
                                                            <Select
                                                                value={this.state.SelectedTranslatorName}
                                                                onChange={(e) => this.onTranslatorSelected(e)}
                                                                options={this.state.AllTranslators}
                                                            />
                                                        </span>

                                                    </div>
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <label htmlFor="float-input">Institution Name<span style={{ color: 'red' }}>*</span></label>
                                                        <Select
                                                            value={this.state.SelectedInstitutionName}
                                                            onChange={(e) => this.onInstitutionSelected(e)}
                                                            options={this.state.AllInstitutions}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Appointment Date <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker placeholderText="Select Date" selected={this.state.StartDate} onChange={date => this.setStartDate(date)}
                                                                className={this.state.isAppointmentDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"} />
                                                        </span>
                                                    </div>
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Type: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isTypeValid === true ? {} : errorBoxForCheckBox}>
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">SCHREIBEN</span>
                                                                <RadioButton value="SCHREIBEN" name="Type"
                                                                    onChange={(e) => this.setState({ Type: e.value })}
                                                                    checked={this.state.Type === 'SCHREIBEN'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">SPRACHEN</span>
                                                                <RadioButton value="SPRACHEN" name="Type"
                                                                    onChange={(e) => this.setState({ Type: e.value })}
                                                                    checked={this.state.Type === 'SPRACHEN'} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>

                                                <h1>Payment Information</h1>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Tax</label>
                                                            <InputText placeholderText="Tax" value={this.state.Tax} type="number" size="30"
                                                                onChange={(e) => this.setState({ Tax: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Rate</label>
                                                            <InputText placeholderText="Rate" value={this.state.Rate} type="number" size="30"
                                                                onChange={(e) => this.setState({ Rate: e.target.value })} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Hours</label>
                                                            <InputText placeholderText="Hours" value={this.state.Hours} type="number" size="30"
                                                                onChange={(e) => this.setState({ Hours: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Discount</label>
                                                            <InputText placeholderText="Discount" value={this.state.Discount} type="number" size="30"
                                                                onChange={(e) => this.setState({ Discount: e.target.value })} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Net Payable</label>
                                                            <InputText placeholderText="Net Payable" value={this.state.NetPayable} type="number" size="30"
                                                                onChange={(e) => this.setState({ NetPayable: e.target.value })} />
                                                        </span>
                                                    </div>
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
                                                <div className="sm-4 md-2 lg-2">
                                                    <span className="ui-float-label" style={{ float: 'right' }}>
                                                        <Button label="Create Appointment" className="ui-btns" disabled={this.state.isLoading} onClick={(e) => this.onSaveAppointments(e)} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Dialog>

                            <Dialog visible={this.state.displayCreateDialog} style={{ width: '60vw' }} header="Create New Appointment"
                                modal={true} footer={dialogFooter} onHide={() => this.setState({ displayCreateDialog: false })}
                                contentStyle={{ maxHeight: "550px", overflow: "auto", }}>
                                {
                                    <div className="p-grid p-fluid">
                                        <div className="card card-w-title">
                                            <h1>Appointment Information</h1>
                                            <div className="p-grid" >
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Appointment ID <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholderText="Unique Appointment ID" value={this.state.AppointmentId} type="text" size="30"
                                                                onChange={(e) => this.setState({ AppointmentId: e.target.value })}
                                                                style={this.state.isAppointmentIdValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date</label>
                                                            <InputText placeholderText="Select Date" value={new Date().toDateString()} type="text" size="30" disabled={true} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Translator Name<span style={{ color: 'red' }}>*</span></label>
                                                            <Select
                                                                value={this.state.SelectedTranslatorName}
                                                                onChange={(e) => this.onTranslatorSelected(e)}
                                                                options={this.state.AllTranslators}
                                                            />
                                                        </span>

                                                    </div>
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <label htmlFor="float-input">Institution Name<span style={{ color: 'red' }}>*</span></label>
                                                        <Select
                                                            value={this.state.SelectedInstitutionName}
                                                            onChange={(e) => this.onInstitutionSelected(e)}
                                                            options={this.state.AllInstitutions}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Appointment Date <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker placeholderText="Select Date" selected={this.state.StartDate} onChange={date => this.setStartDate(date)}
                                                                className={this.state.isAppointmentDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"} />
                                                        </span>
                                                    </div>
                                                    <div className=" col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Type: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isTypeValid === true ? {} : errorBoxForCheckBox}>
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">SCHREIBEN</span>
                                                                <RadioButton value="SCHREIBEN" name="Type"
                                                                    onChange={(e) => this.setState({ Type: e.value })}
                                                                    checked={this.state.Type === 'SCHREIBEN'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">SPRACHEN</span>
                                                                <RadioButton value="SPRACHEN" name="Type"
                                                                    onChange={(e) => this.setState({ Type: e.value })}
                                                                    checked={this.state.Type === 'SPRACHEN'} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>

                                                <h1>Payment Information</h1>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Tax</label>
                                                            <InputText placeholderText="Tax" value={this.state.Tax} type="number" size="30"
                                                                onChange={(e) => this.setState({ Tax: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Rate</label>
                                                            <InputText placeholderText="Rate" value={this.state.Rate} type="number" size="30"
                                                                onChange={(e) => this.setState({ Rate: e.target.value })} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Hours</label>
                                                            <InputText placeholderText="Hours" value={this.state.Hours} type="number" size="30"
                                                                onChange={(e) => this.setState({ Hours: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }} >
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Discount</label>
                                                            <InputText placeholderText="Discount" value={this.state.Discount} type="number" size="30"
                                                                onChange={(e) => this.setState({ Discount: e.target.value })} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-6" style={{ marginBottom: 20 }}>
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Net Payable</label>
                                                            <InputText placeholderText="Net Payable" value={this.state.NetPayable} type="number" size="30"
                                                                onChange={(e) => this.setState({ NetPayable: e.target.value })} />
                                                        </span>
                                                    </div>
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
                                                <div className="sm-4 md-2 lg-2">
                                                    <span className="ui-float-label" style={{ float: 'right' }}>
                                                        <Button label="Create Appointment" className="ui-btns" disabled={this.state.isLoading} onClick={(e) => this.onSaveAppointments(e)} />
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
export default ListAppointments;