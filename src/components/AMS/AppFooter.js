import React, { Component } from 'react';

export class AppFooter extends Component {

    render() {
        return  (
            <div className="layout-footer" style ={{  bottom: 0}}>
                <span className="footer-text" style={{'marginRight': '5px'}}>Copywrite by</span>
                <img src="assets/layout/images/logo.png" alt="" width="80"/>
                <span className="footer-text" style={{'marginLeft': '5px'}}>(Providing software solutions)</span>
            </div>
        );
    }
}