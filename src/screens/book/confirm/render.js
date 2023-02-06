/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import Icon from "react-native-fontawesome-pro";
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CViewRow from '~/components/CViewRow';
import CImage from '~/components/CImage';
/* COMMON */
import { Devices, Configs } from '~/config';
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { layoutWidth } from '~/utils/layout_width';
import Helpers from '~/utils/helpers';
import Currency from '~/utils/currency';
/* STYLES */
import styles from './style';

const RenderProductItem = (data) => {
    let price = (data.price * data.numberOfProduct).toFixed(2);
    price = Helpers.formatNumber(price);
    let currencyPosition = Configs.currencyPosition;
    let symbol = Helpers.symbolCurrency();
    let label = "";
    if (data.variation && data.variation.attributes) {
        for (let std of data.variation.attributes) {
            label += `${std.option}, `;
        }
        label = label.substr(0, label.length - 2)
    }

    return (
        <CViewRow style={styles.con_services_content} between
            leftComp={
                <CViewRow style={[styles.con_services_item_left,
                Configs.supportRTL ? cStyles.row_justify_end : cStyles.row_justify_start]}
                    leftComp={
                        <CImage
                            style={styles.img_service}
                            source={data.images.length > 0 ?
                                { uri: data.images[0].sizes.woocommerce_thumbnail } :
                                data.images}
                        />
                    }
                    rightComp={
                        <View style={styles.con_services_item_name}>
                            <CText style={styles.txt_services_title} numberOfLines={2}>{data.name}</CText>

                            {data.variation &&
                                <View style={[cStyles.row_align_center, cStyles.mt_5, Configs.supportRTL && cStyles.row_justify_end]}>
                                    <CText style={styles.txt_services_option} i18nKey={'option'} />
                                    <CText style={styles.txt_services_option}>{": " + data.variation.attributes[0].option}</CText>
                                    <CText style={styles.txt_services_option}>
                                        {data.variation.attributes.length > 0 && data.variation.attributes[0].name}
                                    </CText>
                                </View>
                            }
                            {data.numberOfProduct > 1 &&
                                <View style={[cStyles.row_align_center, cStyles.mt_5, Configs.supportRTL && cStyles.row_justify_end]}>
                                    <CText style={styles.txt_services_option} i18nKey={'number_of_product'} />
                                    <CText style={styles.txt_services_option}>{": " + data.numberOfProduct}</CText>
                                </View>
                            }
                        </View>
                    }
                />
            }
            rightComp={
                <View style={styles.con_price_service}>
                    {currencyPosition === Currency.left && <CText style={styles.txt_services_unit_left}>{symbol}</CText>}
                    <CText style={styles.txt_services_price}>{price}</CText>
                    {currencyPosition === Currency.right && <CText style={styles.txt_services_unit_right}>{symbol}</CText>}
                </View>
            }
        />
    )
}

const renderHeader = (title) => {
    return (
        <View style={[cStyles.pv_20,
        Configs.supportRTL && cStyles.row_justify_end,
        { marginHorizontal: Devices.pH(layoutWidth.width) }
        ]}>
            <CText style={styles.txt_title} i18nKey={title} />
        </View>
    )
}

export const ViewBookConfirm = ({
    state = null,
    props = null,
    onFunction = {
        onTogglePicker: () => { },
        onConfirm: () => { },
        onCancel: () => { },
        onPressShippingMethod: () => { }
    }
}) => {
    let currencyPosition = Configs.currencyPosition;
    let symbol = Helpers.symbolCurrency();
    let provisional = props.data.provisionalPrice;
    let isHasPriceShipping = false;
    if (state._choosedShippingMethod &&
        state._choosedShippingMethod.settings.value_parse &&
        state._choosedShippingMethod.settings.value_parse > 0) {
        isHasPriceShipping = true;
        provisional += state._choosedShippingMethod.settings.value_parse;
    }

    return (
        <ScrollView nestedScrollEnabled>
            <FlatList style={{ width: Devices.width }}
                contentContainerStyle={[styles.con_list_item, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}
                data={props.data.service}
                renderItem={({ item, index }) => RenderProductItem(item)}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                removeClippedSubviews={Devices.OS === "android"}
                ItemSeparatorComponent={() => <View style={styles.con_separator_option} />}
            />

            <View style={styles.con_separator} />

            <View>
                {renderHeader('informations')}

                {Configs.allowBooking && <CViewRow style={[styles.con_row_item_no_border, { paddingHorizontal: Devices.pH(layoutWidth.width) }]} between
                    leftComp={<CText style={styles.txt_title_left} i18nKey={Configs.allowBooking ? "pick_day" : "date"} />}
                    rightComp={
                        <View style={styles.con_group_title}>
                            <CText style={styles.txt_title_right}>
                                {`${moment(props.day).format('DD/MM/YYYY')} - ${moment(props.time).format('HH:mm')}`}
                            </CText>
                        </View>
                    }
                />}

                {state._shippingMethods.length > 0 &&
                    <CViewRow style={[cStyles.pv_10, { paddingHorizontal: Devices.pH(layoutWidth.width) }]} between
                        leftComp={
                            <CText style={styles.txt_title_left} i18nKey={'shipping'} />
                        }
                        rightComp={
                            <View style={[Configs.supportRTL ? cStyles.column_align_start : cStyles.column_align_end]}>
                                {state._shippingMethods.map((item, index) =>
                                    <TouchableOpacity key={index.toString()} onPress={() => onFunction.onPressShippingMethod(item)}>
                                        <CViewRow style={[styles.con_shipping_methods, index !== 0 && cStyles.mt_15]}
                                            leftComp={
                                                <View style={[cStyles.row_align_center, Configs.supportRTL ? cStyles.pl_10 : cStyles.pr_10]}>
                                                    <CText style={[
                                                        styles.txt_shipping_methods,
                                                        !item.settings.value_parse && { paddingRight: 10 },
                                                    ]}>{item.title}</CText>

                                                    {(item.settings.value_parse !== undefined && item.value_parse !== 0) &&
                                                        <View style={cStyles.row_align_center}>
                                                            <CText style={styles.txt_shipping_methods}>{"  "}</CText>
                                                            <View style={cStyles.row_align_center}>
                                                                {currencyPosition === Currency.left &&
                                                                    <CText style={styles.txt_shipping_methods_choose_unit_left}>{symbol}</CText>}
                                                                <CText style={[
                                                                    styles.txt_shipping_methods,
                                                                    { color: Colors.PLACEHOLDER_COLOR, paddingRight: 10 }
                                                                ]}>{Helpers.formatNumber(item.settings.value_parse)}</CText>
                                                                {currencyPosition === Currency.right &&
                                                                    <CText style={styles.txt_shipping_methods_choose_unit_right}>{symbol}</CText>}
                                                            </View>
                                                        </View>
                                                    }
                                                </View>
                                            }
                                            rightComp={
                                                <Icon name={state._choosedShippingMethod.method_id === item.method_id ? "check-circle" : "circle"}
                                                    color={Colors.PRIMARY_COLOR}
                                                    size={Devices.fS(20)}
                                                    type={state._choosedShippingMethod.method_id === item.method_id ? "solid" : "light"}
                                                />
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        }
                    />
                }
            </View>

            <View style={styles.con_separator} />

            <View style={styles.con_confirm}>
                {renderHeader('summary')}

                <CViewRow style={[styles.con_row_item, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}
                    between
                    leftComp={<CText style={styles.txt_title_left} i18nKey={"total"} />}
                    rightComp={
                        <View style={styles.con_price_item}>
                            {currencyPosition === Currency.left && <CText style={styles.txt_unit_left}>{symbol}</CText>}
                            <CText style={styles.txt_title_right}>{Helpers.formatNumber(props.data.totalPrice)}</CText>
                            {currencyPosition === Currency.right && <CText style={styles.txt_unit_right}>{symbol}</CText>}
                        </View>
                    }
                />

                <CViewRow style={[styles.con_row_item, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}
                    between
                    leftComp={<CText style={styles.txt_title_left} i18nKey={"discount"} />}
                    rightComp={
                        <View style={styles.con_price_item}>
                            {props.data.discountPrice > 0 && currencyPosition === Currency.left &&
                                <CText style={styles.txt_unit_left}>{symbol}</CText>}
                            <CText style={styles.txt_title_right}>
                                {props.data.discountPrice > 0 ? Helpers.formatNumber(props.data.discountPrice) : "-"}
                            </CText>
                            {props.data.discountPrice > 0 && currencyPosition === Currency.right &&
                                <CText style={styles.txt_unit_right}>{symbol}</CText>}
                        </View>
                    }
                />

                <CViewRow style={[styles.con_row_item, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}
                    between
                    leftComp={
                        <CText style={styles.txt_title_left} i18nKey={"delivery_charges"} />
                    }
                    rightComp={
                        <View style={styles.con_price_item}>
                            {isHasPriceShipping && currencyPosition === Currency.left &&
                                <CText style={styles.txt_unit_left}>{symbol}</CText>}
                            <CText style={styles.txt_title_right}>
                                {`${isHasPriceShipping ? Helpers.formatNumber(state._choosedShippingMethod.settings.value_parse) : '-'}`}
                            </CText>
                            {isHasPriceShipping && currencyPosition === Currency.right &&
                                <CText style={styles.txt_unit_right}>{symbol}</CText>}
                        </View>
                    }
                />

                <CViewRow style={[styles.con_provisional, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}
                    between
                    leftComp={<CText style={styles.txt_title_left} i18nKey={"provisional"} />}
                    rightComp={
                        <View style={styles.con_price_item}>
                            {currencyPosition === Currency.left &&
                                <CText style={[styles.txt_provisional_unit_left, { color: Colors.PRIMARY_COLOR }]}>{symbol}</CText>}
                            <CText style={[styles.txt_provisional, { color: Colors.PRIMARY_COLOR }]}>{Helpers.formatNumber(provisional)}</CText>
                            {currencyPosition === Currency.right &&
                                <CText style={[styles.txt_provisional_unit_right, { color: Colors.PRIMARY_COLOR }]}>{symbol}</CText>}
                        </View>
                    }
                />
            </View>
        </ScrollView>
    )
}