import React, { Component } from 'react';
import * as ROUTES from '../../constants/routes';


class FormItem extends Component {
    
    onButtonClick() {
        this.props.history.push(this.props.routeName);
    }
    render() {
        return (
            <div onClick={() => { this.onButtonClick() }} className="col-md-3" style={{ alignContent: 'center', borderWidth: 2, borderColor: 'black', borderStyle: 'solid', borderRadius: 15, margin: 5 }}>
                <div className="row" style={{ margin: 'auto' }}>
                    <img width="50%" src={this.props.image} alt="" style={{ margin: 'auto' }} />
                </div>
                <div className="row" style={{ margin: 'auto' }}>
                    <h4 style={{ margin: 'auto', textAlign: 'center' }}>{this.props.title}</h4>
                </div>
            </div>
        )
    }
}
export default FormItem;