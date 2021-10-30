import React, { Component } from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, } from 'recharts';
import ReportService from '../../api/stats/reportsService';
import { AMS_BarChart } from './BarChart';
import { AMS_PieChart } from './PieChart';

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Appointments: [],
      CompletePayables: [],
      IncompletePayables: [],
      CompleteReceivables: [],
      IncompleteReceivables: [],
    }
    this.service = new ReportService();
  }

  componentDidMount() {
    this.service.GetAppointmentStats().then(data => {
      this.setState({ Appointments: data })
    })
    this.service.GetCompletedPayableStats().then(data => {
      this.setState({ CompletePayables: data })
    })
    this.service.GetInCompletedPayableStats().then(data => {
      this.setState({ IncompletePayables: data })
    })
    this.service.GetCompletedReceivableStats().then(data => {
      this.setState({ CompleteReceivables: data })
    })
    this.service.GetInCompletedReceivableStats().then(data => {
      this.setState({ IncompleteReceivables: data })
    })
  }

  render() {
    const { Appointments, IncompletePayables, CompletePayables, CompleteReceivables, IncompleteReceivables } = this.state;

    return (
      <div style={{ width: '100%', height: '100%' }} >
        <div className="row" style={{ marginBottom: 20 }}>
          <div className="card col col-md-9" style={{ height: 300, margin: 'auto' }}>
            <h3>Apointments</h3>
            <AMS_PieChart Appointments={Appointments} />
          </div>
        </div>
        <div className="row">
          <div className="card col col-md-6" style={{ height: 300, marginLeft: 10 }}>
            <h3>Completed Payables</h3>
            <AMS_BarChart Data={CompletePayables} Label1="SCHREIBEN" Label2="SPRACHEN" Type="type" />
          </div>
          <div className="card col col-md-6" style={{ height: 300, marginLeft: 10, marginRight: 10 }}>
            <h3>Completed Receivables</h3>
            <AMS_BarChart Data={CompleteReceivables} Label1="SCHREIBEN" Label2="SPRACHEN" Type="type" />
          </div>
        </div>
        <div className="row">
          <div className="card col col-md-6" style={{ height: 300, marginLeft: 10 }}>
            <h3>Pending Payables</h3>
            <AMS_BarChart Data={IncompletePayables} Label1="SCHREIBEN" Label2="SPRACHEN" Type="type" />
          </div>
          <div className="card col col-md-6" style={{ height: 300, marginLeft: 10, marginRight: 10 }}>
            <h3>Pending Receivables</h3>
            <AMS_BarChart Data={IncompleteReceivables} Label1="SCHREIBEN" Label2="SPRACHEN" Type="type" />
          </div>
        </div>
      </div>
    )
  }
}
export default HomePage;