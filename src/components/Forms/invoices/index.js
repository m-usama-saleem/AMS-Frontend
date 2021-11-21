import React, { Component } from 'react';
import { Button } from 'primereact/button';
import AppointmentService from '../../../api/appointments/appointmentservice';
import TranslatorInvoice, { TranslatorInvoiceDownload } from './TranslatorInvoice'
import TranslatorInvoiceSpeaking, { TranslatorInvoiceSpeakingDownload } from './TranslatorInvoiceSpeaking';
import TranslatorContract, { TranslatorContractDownload } from './Contract';

export default class ShowReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Invoice: {},
            SentFile: false
        }
        this.service = new AppointmentService();
    }
    componentDidMount() {
        if (this.props && this.props.location && this.props.location.Invoice) {
            this.setState({ Invoice: this.props.location.Invoice })
        }
    }
    DownloadWord = (e) => {
        e.preventDefault();
        this.setState({
            SentFile: true
        }, () => {
            this.setState({
                SentFile: false
            })
        })
    }

    getReport() {
        if (this.state.Invoice) {
            debugger
            if (this.state.Invoice.appointmentType === "SPRACHEN") {
                return (
                    <div style={{ width: '100%', height: '85vh' }}>
                        <TranslatorInvoiceSpeakingDownload Invoice={this.state.Invoice} SentFile={this.state.SentFile} />
                        <TranslatorInvoiceSpeaking Invoice={this.state.Invoice} />
                    </div>
                )
            }
            else if (this.state.Invoice.appointmentType === "SCHREIBEN") {
                return (
                    <div style={{ width: '100%', height: '85vh' }}>
                        <TranslatorInvoiceDownload Invoice={this.state.Invoice} SentFile={this.state.SentFile} />
                        <TranslatorInvoice Invoice={this.state.Invoice} />
                    </div>
                )
            }
            else if (this.state.Invoice.appointmentType === "CONTRACT") {
                return (
                    <div style={{ width: '100%', height: '85vh' }}>
                        <TranslatorContractDownload Invoice={this.state.Invoice} SentFile={this.state.SentFile} />
                        <TranslatorContract Invoice={this.state.Invoice} />
                    </div>
                )
            }
            else {
                <div>Loading Report...</div>
            }
        }
        else {
            <div>Loading Report...</div>
        }
    }
    render() {
        return (
            <div>
                <div>
                    <Button icon="pi pi-download" style={{ float: 'right', marginLeft: 10 }} className="p-button-rounded p-button-success p-mr-2"
                        onClick={(e) => this.DownloadWord(e)} title="Download" />
                </div>
                {this.getReport()}
            </div>
        )
    }
}