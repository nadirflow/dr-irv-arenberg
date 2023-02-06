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
import { Animated, StatusBar } from 'react-native';
/* COMPONENTS */
import { ViewProductDetail } from './render';
/* COMMON */
import { Configs, Languages, Assets, Keys } from '~/config';
import Helpers from '~/utils/helpers';
import Services from '~/services';
/** REDUX */
import * as userActions from '~/redux/actions/user';
import * as cartActions from '~/redux/actions/cart';

class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setBackgroundColor('#18504D', true);
        StatusBar.setBarStyle('dark-content', true);
        this.state = {
            _loading: !Configs.showVariationsProducts,
            _loadRelatedProduct: true,
            _isShowDescription: true,
            _isAdd: false,
            _isPrevRouteCart: props.route.params.isPrevRouteCart || false,
            _currSlick: 0,
            _scrollY: new Animated.Value(0),
            _relatedProduct: [],
            _categories: '',
            _options: [],
            _optionSelected: null,
            _price: props.route.params.product
                ? Number(props.route.params.product.price)
                : 0,
            _product: props.route.params.product || null,

            _selectedValue: '',
            _arrSelected: [],
            _loadingBtnWebview: false
        };
        this._limit = 100
    }

    /* FUNCTIONS */
    _prepareData = () => {
        let { _product, _categories } = this.state;
        if (_product && _product.categories && _product.categories.length > 0) {
            for (let i = 0; i < _product.categories.length; i++) {
                _categories += _product.categories[i].name;
                if (i !== _product.categories.length - 1) _categories += ' | ';
            }
        }

        this.setState({ _categories });
    };

    _onFetchRelatedProduct = async () => {
        let { _relatedProduct, _product } = this.state;
        if (_product) {
            let params = { page: 1, per_page: Configs.numberRelatedProductPerPage };
            let res;

            if (_product.related_ids.length > 0) {
                _product.related_ids.unshift(-1);
                params.include = JSON.stringify(_product.related_ids);
                res = await Services.Service.listProducts(params);
                if (res && res.length > 0) {
                    _relatedProduct = res;
                }
            } else {
                for (let i = 0; i < _product.categories.length; i++) {
                    params.category = _product.categories[i].id;
                    res = await Services.Service.listProducts(params);
                    if (res && res.length > 0) {
                        _relatedProduct = [..._relatedProduct, ...res];
                    }
                }
            }
        }

        this.setState({ _relatedProduct, _loadRelatedProduct: false });
    };

    _onFetchVariations = async () => {
        let resVariations = await Services.Service.productsVariation({
            id: this.props.route.params.product.id,
            page: 1,
            per_page: this._limit,
        });
        if (resVariations && !resVariations.code && resVariations.length > 0) {
            resVariations = resVariations.sort((a, b) => {
                return Number(a.price) - Number(b.price);
            });
            console.log('resVariations', resVariations)
            this.setState({
                _options: resVariations,
                _optionSelected: resVariations[0],
                _loading: false,
            });
        } else {
            this.setState({
                _loading: false,
            });
        }
    };

    _onPressOption = data => {
        if (data.id !== this.state._optionSelected.id) {
            this.setState({
                _optionSelected: data,
                _price: data.price,
            });
        }
    };

    _onAddOrUpdate = async () => {
        let { _product, _price, _optionSelected, _isAdd } = this.state;
        if (Configs.isPaymentWebview) {
            this.setState({_loadingBtnWebview: true})
            let item = Helpers.prepareItemCart(_product.id, _optionSelected ? _optionSelected.id : 0, _optionSelected);
            let params = {
                cartKey: this.props.cartKey,
                data: item
            }
            let res = await Services.Cart.addToCart(params);
            if (res && res.cart_key) {
                if (!this.props.cartKey) {
                    this.props.cartActions.updateCartKey(res.cart_key)
                }
                // let resCart = await Services.Cart.getCart({cartKey: res.cart_key});
                // if (resCart && resCart.items) {
                //     resCart.items = Object.keys(resCart.items).map((key) => resCart.items[key]);
                //     this.props.cartActions.addItemCartWebview(resCart);

                // }
            }
        }
        let originPrice = 0,
        salePrice = 0;
        if (_product.on_sale && _product.sale_price !== '') {
            originPrice = Number(_product.regular_price);
        } else if (_product.on_sale && _optionSelected) {
            originPrice = Number(_optionSelected.regular_price);
        } else {
            originPrice = Number(_product.price);
        }

        if (_product.on_sale && _product.sale_price !== '') {
            salePrice = Number(_product.sale_price);
        } else if (_product.on_sale && _optionSelected && _optionSelected.on_sale) {
            salePrice = Number(_optionSelected.sale_price);
        }

        let selected = {
            id: _product.id,
            name: _product.name,
            short_description: _product.short_description,
            description: _product.description,
            images: _product.images ? _product.images : Assets.image_failed,
            categories: _product.categories,
            average_rating: _product.average_rating,
            rating_count: _product.rating_count,
            related_ids: _product.related_ids,
            sku: _product.sku,
            price: Number(_price),
            originPrice,
            salePrice,
            variation: _optionSelected ? _optionSelected : null,
            numberOfProduct: 1,
            sold_individually: _product.sold_individually || false,
            shipping_class: _product.shipping_class,
            shipping_class_id: _product.shipping_class_id,
        };

        this.props.cartActions.addItemCart(selected);
        _isAdd = true;

        this.setState(
            {
                _variationSelected: null,
                _serviceSelected: null,
                _variations: null,
                _isAdd,
                _loadingBtnWebview: false
            },
            () => {
                /** Update data cart to async storage */
                Helpers.setDataStorage(
                    Keys.AS_DATA_CART,
                    JSON.stringify(this.props.cart),
                );
                Helpers.showToastDuration(
                    {},
                    `"${_product.name}" ` +
                    Languages[this.props.language].add_to_cart_success,
                    'success',
                    'top',
                );
            },
        );
    };

    _onPressBack = () => {
        this.props.navigation.goBack();
    };

    _onPressCart = () => {
        if (this.state._isPrevRouteCart) {
            this.props.navigation.goBack();
        } else {
            this.props.navigation.navigate('Cart');
        }
    };

    _onPressRelatedProducts = product => {
        this._getProductsVariation(product);
    };

    _getProductsVariation = async product => {
        this.props.navigation.push('ProductDetail', {
            product,
        });
    };

    _onPressReviews = () => {
        this.props.navigation.navigate('Reviews', {
            product: this.state._product,
        });
    };

    _onPressDescription = () => {
        this.setState({ _isShowDescription: !this.state._isShowDescription });
    };

    _onPressStore = (vendorData) => {
        this.props.navigation.navigate("VendorDetail", {
            vendorData
        });
    }

    /* LIFE CYCLE */
    componentDidMount() {
        this._prepareData();
        this._onFetchRelatedProduct();
        this._onFetchVariations();
        this.props.navigation.addListener('focus', () => {
            this.setState({
                _isAdd: false,
            });
        });
    }

    componentWillUnmount() {
        this.props.navigation.removeListener();
    }

    /* RENDER */
    render() {
        return (
            <ViewProductDetail
                state={this.state}
                props={this.props}
                settings={{
                    ads: this.props.setting.app.ads,
                }}
                onFunctions={{
                    onPressBack: this._onPressBack,
                    onAddOrUpdate: this._onAddOrUpdate,
                    onPressOption: this._onPressOption,
                    onPressCart: this._onPressCart,
                    onPressRelatedProducts: this._onPressRelatedProducts,
                    onPressReviews: this._onPressReviews,
                    onPressDescription: this._onPressDescription,
                    onPressStore: this._onPressStore
                }}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.language.language,
        cart: state.cart.carts,
        setting: state.setting,
        cartKey: state.cart.cartKey
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        cartActions: bindActionCreators(cartActions, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProductDetail);
