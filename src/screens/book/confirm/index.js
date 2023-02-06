/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
/* COMPONENTS */
import { ViewBookConfirm } from './render';
/** COMMON */
import MetaFields from '~/utils/meta_fields';
import { Configs } from '~/config';
/** REDUX */
import * as userActions from '~/redux/actions/user';

const meta_data = [
    {
        key: MetaFields.booking_day,
        value: moment().format('DD/MM/YYYY')
    },
    {
        key: MetaFields.booking_hour,
        value: moment().format('HH:mm')
    },
    {
        key: MetaFields.total_delivery_charges,
        value: ""
    },
    {
        key: MetaFields.delivery_date,
        value: moment().format('DD MMM, YYYY HH:mm')
    },
    {
        key: MetaFields.orddd_timestamp,
        value: moment().format("X")
    },
]

class BookConfirm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            _loading: true,
            _shippingMethods: [],
            _choosedShippingMethod: null,
            _metaData: meta_data,
            _dataUser: props.user
        }
    }

    /** FUNCTIONS */
    _prepareData = () => {
        let { _dataUser } = this.state;
        let { paymentAddress } = this.props;
        /**********
        ** Find shipping method with choose country
        ** If find -> set zone ID
        ** Else find -> set default zone ID = 1 (US)
        **********/
        let find = false;
        if (_dataUser && _dataUser.shipping.country !== "") {
            Configs.shipping.zoneId = 0;
            for (let e of this.props.setting.shippingZones) {
                if (!find) {
                    if (e.countries && e.countries.length > 0) {
                        let findShiMet = e.countries.find(f => f.code === _dataUser.shipping.country);
                        if (findShiMet) {
                            Configs.shipping.zoneId = e.id;
                            find = true;
                        }
                    }
                }
            }
        } else if (paymentAddress && paymentAddress._valueStateShipping !== '') {
            Configs.shipping.zoneId = 1; // dont have any state variable to check --> this is a temporary way 
        } else if (paymentAddress) {
            Configs.shipping.zoneId = 0;
            for (let e of this.props.setting.shippingZones) {
                if (!find) {
                    if (e.countries && e.countries.length > 0) {
                        let findShiMet = e.countries.find(f => f.code === paymentAddress._valueCountryShipping);
                        if (findShiMet) {
                            Configs.shipping.zoneId = e.id;
                            find = true;
                        }
                    }
                }
            }
        }
        /********/
        this._checkShippingMethod({});
    }

    _checkShippingMethod = (tmp) => {
        if (Configs.shipping.zoneId < 1) {
            tmp._shippingMethods = [{
                id: 1,
                instance_id: 1,
                method_description: "<p>Lets you charge a fixed rate for shipping.</p>",
                method_id: "flat_rate",
                method_title: "Flat rate",
                settings: {
                    cost: {
                        value: Configs.shipping.price_default.toString()
                    },
                    value_parse: Configs.shipping.price_default
                },
                title: "Flat rate"
            }];
            tmp._choosedShippingMethod = tmp._shippingMethods[0];
        } else {

            /** SHIPPING METHODS */
            let find = this.props.setting.shippingZones.find(f => f.id === Configs.shipping.zoneId);
            if (find && find.methods.length > 0) {

                /** Filter methods is enabled */
                let methods = find.methods;
                methods = methods.filter(fil => fil.enabled === true);

                let findIdx = methods.findIndex(fi => fi.method_id === Configs.shipping.methods.flat_rate);
                if (findIdx !== -1) {
                    methods[findIdx].settings.value_parse = parseInt(methods[findIdx].settings.cost.value);
                } else {
                    methods[0].settings.value_parse = parseInt(methods[0].settings.cost.value);
                }

                tmp._shippingMethods = methods;
                tmp._choosedShippingMethod = tmp._shippingMethods[0];
            } else {
                tmp._shippingMethods = [];
                tmp._choosedShippingMethod = null;
            }
        }
        tmp._loading = false;
        this.setState(tmp);
        this.props.getShipping(tmp._choosedShippingMethod);
    }

    _onPressShippingMethod = (data) => {
        if (data.method_id !== this.state._choosedShippingMethod.method_id) {
            this.setState({ _choosedShippingMethod: data });
            this.props.getShipping(data);
        }
    }

    /** LIFE CYCLE */
    componentDidMount() {
        this._prepareData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.paymentAddress && prevProps.paymentAddress._valueCountryShipping !== "") {
            if (this.props.paymentAddress && this.props.paymentAddress._valueCountryShipping !== "") {
                if (prevProps.paymentAddress._valueCountryShipping !== this.props.paymentAddress._valueCountryShipping) {
                    this._prepareData();
                }
            }
        }
        if (prevProps.paymentAddress && prevProps.paymentAddress._valueStateShipping !== "") {
            if (this.props.paymentAddress && this.props.paymentAddress._valueStateShipping !== "") {
                if (prevProps.paymentAddress._valueStateShipping !== this.props.paymentAddress._valueStateShipping) {
                    this._prepareData();
                }
            }
        }
        if (!prevProps.paymentAddress) {
            if (this.props.paymentAddress && this.props.paymentAddress._valueCountryShipping !== "") {
                this._prepareData();
            } else if (this.props.paymentAddress && this.props.paymentAddress._valueStateShipping) {
                this._prepareData();
            }
        }
    }

    /* RENDER */
    render() {
        console.log('object_state.user.data', this.props.user)
        return (
            <ViewBookConfirm
                state={this.state}
                props={this.props}
                onFunction={{
                    onPressShippingMethod: this._onPressShippingMethod
                }}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        setting: state.setting,
        cart: state.cart.carts,
        user: state.user.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookConfirm);