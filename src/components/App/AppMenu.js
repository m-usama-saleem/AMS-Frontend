import React, { Component } from 'react';
import {NavLink} from 'react-router-dom'
import PropTypes from 'prop-types';
import classNames from 'classnames';

class AppSubmenu extends Component {

    static defaultProps = {
        className: null,
        items: null,
        onMenuItemClick: null,
        root: false
    }

    static propTypes = {
        className: PropTypes.string,
        items: PropTypes.array,
        onMenuItemClick: PropTypes.func,
        root: PropTypes.bool
    }
    
    constructor(props) {
        super(props);
        this.state = {activeIndex: null};
        this.authUser = this.props.authUser;
    }
    
    onMenuItemClick(event, item, index) {
        //avoid processing disabled items
        if(item.disabled) {
            event.preventDefault();
            return true;
        }
                        
        //execute command
        if(item.command) {
            item.command({originalEvent: event, item: item});
        }

        if(index === this.state.activeIndex)
            this.setState({activeIndex: null});    
        else
            this.setState({activeIndex: index});

        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick({
                originalEvent: event,
                item: item
            });
        }
    }

	renderLinkContent(item) {
		let submenuIcon = item.items && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>;
		let badge = item.badge && <span className="menuitem-badge">{item.badge}</span>;

        return (
            <React.Fragment>
                <div className="row col-md-12 col-sd-12" style={{ paddingRight: 0}}>
                    <div className="col-md-2 col-sd-2" style={{ paddingRight: 0, paddingLeft: 0 }}>
                        <i className={item.icon}></i>
                    </div>
                    <span className="col-md-8 col-sd-8" style={{ paddingRight: 0, paddingLeft: 0 }}>{item.label}</span>
                    {submenuIcon}
                    {badge}
                </div>
            </React.Fragment>
        );
    }

    renderLink(item, i) {
        let roles = item.roles;
        if (roles != null && roles.length >0){
            if(this.authUser !== null && this.authUser.roles !== null){
                var result = roles.some((val) => this.authUser.roles.indexOf(val) !== -1);  
                if(!result){
                    return true;
                }
            }            
        }
		let content = this.renderLinkContent(item);

		if (item.to) {
			return (
				<NavLink activeClassName="active-route" to={item.to} onClick={(e) => this.onMenuItemClick(e, item, i)} exact target={item.target}>
                    {content}
                </NavLink>
			)
		}
		else {
			return (
				<a href={item.url} onClick={(e) => this.onMenuItemClick(e, item, i)} target={item.target}>
					{content}
				</a>
			);

		}
	}
    
    render() {
        let items = this.props.items && this.props.items.map((item, i) => {
            let active = this.state.activeIndex === i;
            let styleClass = classNames(item.badgeStyleClass, {'active-menuitem': active && !item.to});

            return (
                <li className={styleClass} key={i}>
                    {item.items && this.props.root===true && <div className='arrow'></div>}
					{this.renderLink(item, i)}
                    <AppSubmenu items={item.items} onMenuItemClick={this.props.onMenuItemClick}/>
                </li>
            );
        });
        
        return items ? <ul className={this.props.className}>{items}</ul> : null;
    }
}

export class AppMenu extends Component {

    static defaultProps = {
        model: null,
        onMenuItemClick: null
    }

    static propTypes = {
        model: PropTypes.array,
        onMenuItemClick: PropTypes.func
    }

    render() {
        var user = this.props.authUser;
        
        return (
            <div className="layout-menu-container">
                <AppSubmenu authUser={this.props.authUser} items={this.props.model} className="layout-menu" onMenuItemClick={this.props.onMenuItemClick} root={true}/>
            </div>
        );
    }
}