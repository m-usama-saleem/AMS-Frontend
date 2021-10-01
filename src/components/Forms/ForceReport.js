import React, { Component } from 'react';
import { withAuthorization } from '../Session';

import "react-datepicker/dist/react-datepicker.css";
import * as ROLES from '../../constants/roles';

class ForceReport extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        window.open('https://admin.olympiansecurity.ca/08-006-012.pdf', "_blank")
    }


    render() {
        return (
            <div>
            </div>
        );
    }
}

const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN || authUser.roles === ROLES.EMPLOYEE)
export default withAuthorization(condition)(ForceReport);