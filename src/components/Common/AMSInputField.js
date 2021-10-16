import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';
import { Component } from 'react';
import Select from 'react-select'

const errorBox = {
    borderRadius: '3px', borderColor: 'rgba(242, 38, 19, 1)'
};
const normalBox = {
    border: '1px solid #a6a6a6'
};
const normalBoxForDDL = {
    border: '1px solid white', borderRadius: '3px'
};
const errorBoxForDDL = {
    border: '1px solid red', borderRadius: '3px'
};

export default class AMSInputField extends Component {

    constructor(props) {
        super(props);
        this.state = {
            val: '',
            isValid: true,
            CheckField: false
        }
    }

    componentDidUpdate() {
        if (this.props.CheckField && this.props.CheckField != undefined && this.state.CheckField != this.props.CheckField) {
            this.checkForValidation();
            this.setState({
                CheckField: this.props.CheckField
            })
        }
        if (this.props.Value && this.props.Value != undefined && this.state.val != this.props.Value) {
            this.setState({
                val: this.props.Value
            })
        }
    }

    getRequiredSpan() {
        return <span style={{ color: 'red' }}>*</span>
    }

    ValidateType() {
        const type = this.props.Type;
        if (type === "email") {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(this.state.val)) {
                this.setState({ isValid: false })
                return false;
            }
            else {
                this.setState({ isValid: true })
                return true;
            }
        }

        return true;
    }

    checkForValidation() {
        const isRequired = this.props.IsRequired;
        const type = this.props.Type;
        const checkType = this.ValidateType();
        var valid_result = this.state.isValid;

        if (checkType) {
            if (isRequired == true) {
                if (type == "ddl_select") {
                    if (!this.state.val || this.state.val == undefined) {
                        valid_result = false;
                    } else {
                        valid_result = true;
                    }
                }
                else {
                    if (this.state.val.trim() == "" || this.state.val == undefined || this.state.val == null) {
                        valid_result = false;
                    } else {
                        valid_result = true;
                    }
                }

                this.setState({ isValid: valid_result })
                this.props.ChangeIsValid(valid_result)
            }
            else {
                this.setState({ isValid: true })
            }
        }
    }
    onChange(e) {
        this.setState({ val: e.target.value })
        this.props.onChange(e.target.value);
    }

    onChangeSelection(obj) {
        this.setState({ val: obj })
        this.props.onChange(obj);
    }

    getInputField() {
        const { Label, Type, IsRequired, Value, Disabled, ReadOnly, PlaceholderText, ItemsList } = this.props;
        const required = IsRequired == true ? this.getRequiredSpan() : <span></span>
        var id = "txt" + Label.replaceAll(" ", '')

        switch (Type) {
            case "text":
            case "email":
            case "password":
            case "number":
                return (
                    <span className="ui-float-label">
                        <label htmlFor="float-input">{Label} {required} </label>
                        <InputText id={id} value={Value != null ? Value : this.state.val} type={Type}
                            style={this.state.isValid === false ? errorBox : normalBox}
                            onBlur={() => this.checkForValidation()} disabled={Disabled} readOnly={ReadOnly}
                            placeholder={PlaceholderText}
                            size="30" onChange={(e) => { this.onChange(e) }} />
                    </span>
                );
            case "ddl_select":
                return (
                    <div style={this.state.isValid === false ? errorBoxForDDL : normalBoxForDDL}>
                        <label htmlFor="float-input">{Label} {required}</label>
                        <Select
                            value={Value != null ? Value : this.state.val}
                            onChange={(e) => this.onChangeSelection(e)}
                            options={ItemsList}
                            maxMenuHeight={150}
                            onBlur={() => this.checkForValidation()}
                        />
                    </div>
                );
            default:
                return <div></div>
        }
    }

    render() {
        const { Label, Type, IsRequired, Value, Disabled, ReadOnly, PlaceholderText } = this.props;
        const required = IsRequired == true ? this.getRequiredSpan() : <span></span>
        var id = "txt" + Label.replaceAll(" ", '')

        var inputField = <div></div>;
        if (Type && Type != undefined) {
            inputField = this.getInputField();
        }
        return (
            <div>
                {
                    inputField
                }
            </div>
        )
    }
}