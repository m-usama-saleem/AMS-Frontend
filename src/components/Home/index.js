import React, { Component } from 'react';
import FormItem from '../Forms/FormItem';
import * as ROUTES from '../../constants/routes';

class HomePage extends Component {
  render() {
    return (
      <div className="row col-md-12" style={{ justifyContent: 'center' }} >
        <FormItem {...this.props} title="Appointments" image="assets/demo/images/car/Audi.png" routeName={ROUTES.APPOINTMENT_LIST} />
        <FormItem {...this.props} title="Dashboard" image="assets/demo/images/car/BMW.png" routeName={ROUTES.DASHBOARD} />
        <FormItem {...this.props} title="Receiveables" image="assets/demo/images/car/Ford.png" routeName={ROUTES.FINANCE__RECEIVE} />
        <FormItem {...this.props} title="Payables" image="assets/demo/images/car/Honda.png" routeName={ROUTES.FINANCE__PAY} />
        <FormItem {...this.props} title="Translators" image="assets/demo/images/car/Volvo.png" routeName={ROUTES.TRANSLATOR_LIST} />
      </div>
    )
  }
}
export default HomePage;