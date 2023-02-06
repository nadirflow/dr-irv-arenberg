/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView,Keyboard } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Form, Label, Input } from 'native-base';
import Icon from 'react-native-fontawesome-pro';
/* COMPONENTS */
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import CFloatingInput from "~/components/CFloatingInput";
import CViewRow from '~/components/CViewRow';
/* COMMON */
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from "~/utils/layout_width";
import { Configs, Devices, Languages, Keys } from '~/config';
/* STYLES */
import styles from './style';

const RenderContentModal = (state, props, inputs, onFunction) => {
    return (
        <KeyboardAvoidingView style={styles.con_modal_content} behavior={'padding'}>
            <View style={[styles.con_modal_content, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
                <ScrollView keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={cStyles.pb_10}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.con_modal_input}>
                        <Form style={styles.con_form}>
                            <CText style={[cStyles.txt_title_group, cStyles.pt_10]} i18nKey={"billing_information"} />

                            <View style={styles.con_name}>
                                {/** FIRST NAME INPUT */}
                                <CFloatingInput containerStyle={styles.txt_name_left}
                                    inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                    customRef={ref => inputs.firstNameRef = ref}
                                    required
                                    loading={state._loadingAdd}
                                    error={state._errorFirstName}
                                    title={"first_name"}
                                    placeholder={Languages[props.language].first_name}
                                    value={state._valueFirstName}
                                    nextFocusField
                                    onChange={onFunction.onChangeFirstName}
                                    onSubmit={() => inputs.lastNameRef._root.focus()}
                                />

                                {/** LAST NAME INPUT */}
                                <CFloatingInput containerStyle={styles.txt_name_right}
                                    inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                    customRef={ref => inputs.lastNameRef = ref}
                                    required
                                    loading={state._loadingAdd}
                                    error={state._errorLastName}
                                    title={"last_name"}
                                    placeholder={Languages[props.language].last_name}
                                    value={state._valueLastName}
                                    nextFocusField
                                    onChange={onFunction.onChangeLastName}
                                    onSubmit={() => inputs.phoneRef._root.focus()}
                                />
                            </View>

                            <View style={styles.con_name}>
                                {/** PHONE INPUT */}
                                <CFloatingInput containerStyle={styles.txt_phone_left}
                                    inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                    customRef={ref => inputs.phoneRef = ref}
                                    required
                                    loading={state._loadingAdd}
                                    error={state._errorPhone}
                                    title={"phone"}
                                    placeholder={Languages[props.language].phone}
                                    value={state._valuePhone}
                                    keyboardType={"number-pad"}
                                    nextFocusField
                                    onChange={onFunction.onChangePhone}
                                    onSubmit={() => inputs.companyRef._root.focus()}
                                />

                                {/** COMPANY INPUT */}
                                <CFloatingInput containerStyle={styles.txt_phone_right}
                                    inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                    customRef={ref => inputs.companyRef = ref}
                                    optional
                                    loading={state._loadingAdd}
                                    title={"company"}
                                    placeholder={Languages[props.language].phone}
                                    value={state._valueCompany}
                                    nextFocusField
                                    onChange={onFunction.onChangeCompany}
                                    onSubmit={() => inputs.emailRef._root.focus()}
                                />
                            </View>

                            {/** EMAIL INPUT */}
                            <CFloatingInput customRef={ref => inputs.emailRef = ref}
                                inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                required
                                loading={state._loadingAdd}
                                error={state._errorEmail}
                                title={"email"}
                                placeholder={Languages[props.language].email}
                                value={state._valueEmail}
                                nextFocusField
                                onChange={onFunction.onChangeEmail}
                                onSubmit={() => inputs.address1Ref._root.focus()}
                            />

                            {/** ADDRESS 1 INPUT */}
                            <CFloatingInput customRef={ref => inputs.address1Ref = ref}
                                inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                required
                                loading={state._loadingAdd}
                                error={state._errorAddress1}
                                title={"address_1"}
                                placeholder={Languages[props.language].address_1}
                                value={state._valueAddress1}
                                nextFocusField
                                onChange={onFunction.onChangeAddress1}
                                onSubmit={() => inputs.address2Ref._root.focus()}
                            />

                            {/** ADDRESS 2 INPUT */}
                            <CFloatingInput customRef={ref => inputs.address2Ref = ref}
                                inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                optional
                                loading={state._loadingAdd}
                                error={state._errorAddress2}
                                title={"address_2"}
                                placeholder={Languages[props.language].address_2}
                                value={state._valueAddress2}
                                nextFocusField
                                onChange={onFunction.onChangeAddress2}
                                onSubmit={() => inputs.cityRef._root.focus()}
                            />

                            <View style={styles.con_name}>
                                {/** CITY INPUT */}
                                <CFloatingInput containerStyle={styles.txt_city_left}
                                    inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                    customRef={ref => inputs.cityRef = ref}
                                    required
                                    loading={state._loadingAdd}
                                    error={state._errorCity}
                                    title={"city"}
                                    placeholder={Languages[props.language].city}
                                    value={state._valueCity}
                                    nextFocusField
                                    onChange={onFunction.onChangeCity}
                                    onSubmit={() => inputs.zipcodeRef._root.focus()}
                                />

                                {/** ZIP CODE INPUT */}
                                <CFloatingInput containerStyle={styles.txt_city_right}
                                    inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                    customRef={ref => inputs.zipcodeRef = ref}
                                    required
                                    loading={state._loadingAdd}
                                    error={state._errorZipCode}
                                    title={"post_zip_code"}
                                    placeholder={Languages[props.language].post_zip_code}
                                    value={state._valueZipCode}
                                    nextFocusField={state._isSameBilling ? false : true}
                                    onChange={onFunction.onChangeZipCode}
                                    onSubmit={() => state._isSameBilling ? Keyboard.dismiss() : inputs.firstNameShippingRef._root.focus()}
                                />
                            </View>

                            {/** COUNTRY INPUT */}
                            <CViewRow style={styles.con_input_modal} between
                                leftComp={
                                    <Label style={{ flex: .4 }}>
                                        <CText style={styles.txt_label} i18nKey={"country"} />
                                        <CText style={styles.txt_label}>{"*"}</CText>
                                    </Label>
                                }
                                rightComp={
                                    <View style={[cStyles.column_align_start, { flex: .6 },
                                    state._errorCountry && { borderBottomColor: Colors.RED_COLOR, borderBottomWidth: .5 }]}>
                                        <Picker
                                            mode={'dropdown'}
                                            iosIcon={
                                                <Icon name={"angle-down"}
                                                    size={cStyles.ic_right_detail.size}
                                                    color={cStyles.ic_right_detail.color}
                                                    type={cStyles.ic_right_detail.type} />
                                            }
                                            placeholder={Languages[props.language].choose_your_country}
                                            placeholderStyle={{ color: Colors.PLACEHOLDER_COLOR, width: '90%' }}
                                            selectedValue={Configs.html5Entities.decode(state._valueCountry)}
                                            onValueChange={onFunction.onChangeCountry}
                                            textStyle={[styles.txt_input, Configs.supportRTL && cStyles.txt_RTL]}
                                            itemTextStyle={[cStyles.txt_base_item, Configs.supportRTL && cStyles.txt_RTL]}
                                            headerTitleStyle={[cStyles.txt_title_header, Configs.supportRTL && cStyles.txt_RTL]}
                                            headerStyle={{ backgroundColor: Colors.PRIMARY_COLOR }}
                                            headerBackButtonTextStyle={[cStyles.txt_base_item, { color: cStyles.txt_title_header.color }]}
                                            removeClippedSubviews={Devices.OS === Keys.KEY_PLATFORM_ANDROID}
                                            style={[{ width: '100%' }, Configs.supportRTL && cStyles.txt_RTL]}
                                        >
                                            {state._dataCountry && state._dataCountry.map((item, index) => {
                                                return <Picker.Item label={Configs.html5Entities.decode(item.name)} value={item.code} key={index} />
                                            })}
                                        </Picker>
                                    </View>
                                }
                            />

                            {/** STATE INPUT */}
                            <CViewRow style={styles.con_input_modal} between
                                leftComp={
                                    <Label style={{ flex: .4 }}>
                                        <CText style={styles.txt_label} i18nKey={'state'} />
                                        <CText style={styles.txt_label}>{"*"}</CText>
                                    </Label>
                                }
                                rightComp={
                                    <View style={[cStyles.column_align_end, { flex: .6 },
                                    state._errorState && { borderBottomColor: Colors.RED_COLOR, borderBottomWidth: 1 }]}>
                                        {state._dataState.length > 0 ?
                                            <Picker
                                                mode={'dropdown'}
                                                iosIcon={
                                                    <Icon name={"angle-down"}
                                                        size={cStyles.ic_right_detail.size}
                                                        color={cStyles.ic_right_detail.color}
                                                        type={cStyles.ic_right_detail.type} />
                                                }
                                                placeholder={Languages[props.language].choose_your_country}
                                                placeholderStyle={{ color: Colors.PLACEHOLDER_COLOR, width: '90%' }}
                                                selectedValue={Configs.html5Entities.decode(state._valueState)}
                                                onValueChange={onFunction.onChangeState}
                                                textStyle={[styles.txt_input, Configs.supportRTL && cStyles.txt_RTL]}
                                                itemTextStyle={[cStyles.txt_base_item, Configs.supportRTL && cStyles.txt_RTL]}
                                                headerTitleStyle={[cStyles.txt_title_header, Configs.supportRTL && cStyles.txt_RTL]}
                                                headerStyle={{ backgroundColor: Colors.PRIMARY_COLOR }}
                                                headerBackButtonTextStyle={[cStyles.txt_base_item, { color: cStyles.txt_title_header.color }]}
                                                removeClippedSubviews={Devices.OS === Keys.KEY_PLATFORM_ANDROID}
                                                style={[{ width: '100%' }, Configs.supportRTL && cStyles.txt_RTL]}
                                            >
                                                {state._dataState && state._dataState.map((item, index) => {
                                                    return <Picker.Item label={Configs.html5Entities.decode(item.name)} value={item.code} key={index} />
                                                })}
                                            </Picker>
                                            :
                                            <Input style={[styles.txt_input, Configs.supportRTL && cStyles.txt_RTL, { marginLeft: -5 }]}
                                                removeClippedSubviews={Devices.OS === 'android'}
                                                disabled={state._loadingAdd}
                                                placeholderTextColor={Colors.BORDER_COLOR}
                                                placeholder={Languages[props.language].choose_your_state}
                                                value={state._valueState}
                                                blurOnSubmit={false}
                                                returnKeyType={'next'}
                                                selectionColor={Colors.BLACK_COLOR}
                                                onChangeText={onFunction.onChangeTextState}
                                            />
                                        }
                                    </View>
                                }
                            />
                        </Form>

                        <TouchableOpacity onPress={onFunction.onPressIsSameBilling}>
                            <CViewRow style={[styles.con_is_same, cStyles.pt_20]} between
                                leftComp={
                                    <Icon name={state._isSameBilling ? "check-circle" : "circle"} color={Colors.PRIMARY_COLOR}
                                        size={Devices.fS(20)} type={state._isSameBilling ? "solid" : "light"} />
                                }
                                rightComp={
                                    <CText style={styles.txt_is_same} i18nKey={'is_same_billing'} numberOfLines={2} />
                                }
                            />
                        </TouchableOpacity>

                        {!state._isSameBilling &&
                            <Form style={styles.con_form}>
                                <CText style={[cStyles.txt_title_group, cStyles.pt_10]} i18nKey={"shipping_information"} />

                                <View style={styles.con_name}>
                                    {/** FIRST NAME INPUT */}
                                    <CFloatingInput containerStyle={styles.txt_name_left}
                                        inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                        customRef={ref => inputs.firstNameShippingRef = ref}
                                        required
                                        loading={state._loadingAdd}
                                        error={state._errorFirstNameShipping}
                                        title={"first_name"}
                                        placeholder={Languages[props.language].first_name}
                                        value={state._valueFirstNameShipping}
                                        nextFocusField
                                        onChange={onFunction.onChangeFirstNameShipping}
                                        onSubmit={() => inputs.lastNameShippingRef._root.focus()}
                                    />

                                    {/** LAST NAME INPUT */}
                                    <CFloatingInput containerStyle={styles.txt_name_right}
                                        inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                        customRef={ref => inputs.lastNameShippingRef = ref}
                                        required
                                        loading={state._loadingAdd}
                                        error={state._errorLastNameShipping}
                                        title={"last_name"}
                                        placeholder={Languages[props.language].last_name}
                                        value={state._valueLastNameShipping}
                                        nextFocusField
                                        onChange={onFunction.onChangeLastNameShipping}
                                        onSubmit={() => inputs.companyShippingRef._root.focus()}
                                    />
                                </View>

                                {/** COMPANY INPUT */}
                                <CFloatingInput customRef={ref => inputs.companyShippingRef = ref}
                                    inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                    optional
                                    loading={state._loadingAdd}
                                    title={"company"}
                                    placeholder={Languages[props.language].company}
                                    value={state._valueCompany}
                                    nextFocusField
                                    onChange={onFunction.onChangeCompany}
                                    onSubmit={() => inputs.companyShippingRef._root.focus()}
                                />

                                {/** ADDRESS 1 INPUT */}
                                <CFloatingInput customRef={ref => inputs.address1ShippingRef = ref}
                                    inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                    required
                                    loading={state._loadingAdd}
                                    error={state._errorAddress1Shipping}
                                    title={"address_1"}
                                    placeholder={Languages[props.language].address_1}
                                    value={state._valueAddress1Shipping}
                                    nextFocusField
                                    onChange={onFunction.onChangeAddress1Shipping}
                                    onSubmit={() => inputs.address2ShippingRef._root.focus()}
                                />

                                {/** ADDRESS 2 INPUT */}
                                <CFloatingInput customRef={ref => inputs.address2ShippingRef = ref}
                                    inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                    required
                                    loading={state._loadingAdd}
                                    error={state._errorAddress2Shipping}
                                    title={"address_2"}
                                    placeholder={Languages[props.language].address_2}
                                    value={state._valueAddress2Shipping}
                                    nextFocusField
                                    onChange={onFunction.onChangeAddress2Shipping}
                                    onSubmit={() => inputs.cityShippingRef._root.focus()}
                                />

                                <View style={styles.con_name}>
                                    {/** CITY INPUT */}
                                    <CFloatingInput containerStyle={styles.txt_city_left}
                                        inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                        customRef={ref => inputs.cityShippingRef = ref}
                                        required
                                        loading={state._loadingAdd}
                                        error={state._errorCityShipping}
                                        title={"city"}
                                        placeholder={Languages[props.language].city}
                                        value={state._valueCityShipping}
                                        nextFocusField
                                        onChange={onFunction.onChangeCityShipping}
                                        onSubmit={() => inputs.zipcodeShippingRef._root.focus()}
                                    />

                                    {/** ZIP CODE INPUT */}
                                    <CFloatingInput containerStyle={styles.txt_city_right}
                                        inputStyle={[Configs.supportRTL && cStyles.txt_RTL]}
                                        customRef={ref => inputs.zipcodeShippingRef = ref}
                                        required
                                        loading={state._loadingAdd}
                                        error={state._errorZipCodeShipping}
                                        title={"post_zip_code"}
                                        placeholder={Languages[props.language].post_zip_code}
                                        value={state._valueZipCodeShipping}
                                        onChange={onFunction.onChangeZipCodeShipping}
                                        onSubmit={() => Keyboard.dismiss()}
                                    />
                                </View>

                                {/** COUNTRY INPUT */}
                                <CViewRow style={styles.con_input_modal} between
                                    leftComp={
                                        <Label style={{ flex: .4 }}>
                                            <CText style={styles.txt_label} i18nKey={"country"} />
                                            <CText style={styles.txt_label}>{"*"}</CText>
                                        </Label>
                                    }
                                    rightComp={
                                        <View style={[cStyles.column_align_start, { flex: .6 },
                                        state._errorCountryShipping && { borderBottomColor: Colors.RED_COLOR, borderBottomWidth: .5 }]}>
                                            <Picker
                                                //mode={'dialog'}
                                                mode="dropdown"
                                                iosIcon={
                                                    <Icon name={"angle-down"}
                                                        size={cStyles.ic_right_detail.size}
                                                        color={cStyles.ic_right_detail.color}
                                                        type={cStyles.ic_right_detail.type} />
                                                }
                                                placeholder={Languages[props.language].choose_your_country}
                                                placeholderStyle={{ color: Colors.PLACEHOLDER_COLOR, width: '90%' }}
                                                selectedValue={Configs.html5Entities.decode(state._valueCountryShipping)}
                                                onValueChange={onFunction.onChangeCountryShipping}
                                                textStyle={[styles.txt_input, Configs.supportRTL && cStyles.txt_RTL]}
                                                itemTextStyle={[cStyles.txt_base_item, Configs.supportRTL && cStyles.txt_RTL]}
                                                headerTitleStyle={[cStyles.txt_title_header, Configs.supportRTL && cStyles.txt_RTL]}
                                                headerStyle={{ backgroundColor: Colors.PRIMARY_COLOR }}
                                                headerBackButtonTextStyle={[cStyles.txt_base_item, { color: cStyles.txt_title_header.color }]}
                                                removeClippedSubviews={Devices.OS === Keys.KEY_PLATFORM_ANDROID}
                                                style={[{ width: '100%' }, Configs.supportRTL && cStyles.txt_RTL]}
                                            >
                                                {state._dataCountry.map((item, index) => {
                                                    return <Picker.Item label={Configs.html5Entities.decode(item.name)} value={item.code} key={index.toString()} />
                                                })}
                                            </Picker>
                                        </View>
                                    }
                                />

                                {/** STATE INPUT */}
                                <CViewRow style={styles.con_input_modal} between
                                    leftComp={
                                        <Label style={{ flex: .4 }}>
                                            <CText style={styles.txt_label} i18nKey={'state'} />
                                            <CText style={styles.txt_label}>{"*"}</CText>
                                        </Label>
                                    }
                                    rightComp={
                                        <View style={[cStyles.column_align_end, { flex: .6 },
                                        state._errorStateShipping && { borderBottomColor: Colors.RED_COLOR, borderBottomWidth: 1 }]}>
                                            {state._dataStateShipping.length > 0 ?
                                                <Picker
                                                    mode={"dialog"}
                                                    iosIcon={
                                                        <Icon name={"angle-down"}
                                                            size={cStyles.ic_right_detail.size}
                                                            color={cStyles.ic_right_detail.color}
                                                            type={cStyles.ic_right_detail.type} />}
                                                    placeholder={Languages[props.language].choose_your_state}
                                                    placeholderStyle={{ color: Colors.PLACEHOLDER_COLOR, width: '90%' }}
                                                    selectedValue={Configs.html5Entities.decode(state._valueStateShipping)}
                                                    onValueChange={onFunction.onChangeStateShipping}
                                                    textStyle={styles.txt_input}
                                                    itemTextStyle={[cStyles.txt_base_item, { paddingLeft: 0 }]}
                                                    headerTitleStyle={cStyles.txt_title_header}
                                                    headerStyle={{ backgroundColor: Colors.PRIMARY_COLOR }}
                                                    headerBackButtonTextStyle={[cStyles.txt_base_item, { color: cStyles.txt_title_header.color }]}
                                                >
                                                    {state._dataStateShipping.map((item, index) => {
                                                        return <Picker.Item label={Configs.html5Entities.decode(item.name)} value={item.code} key={index.toString()} />
                                                    })}
                                                </Picker>
                                                :
                                                <Input style={[styles.txt_input, Configs.supportRTL && cStyles.txt_RTL, { marginLeft: -5 }]}
                                                    removeClippedSubviews={Devices.OS === 'android'}
                                                    disabled={state._loadingAdd}
                                                    placeholderTextColor={Colors.BORDER_COLOR}
                                                    placeholder={Languages[props.language].choose_your_state}
                                                    value={state._valueStateShipping}
                                                    blurOnSubmit={false}
                                                    returnKeyType={'next'}
                                                    selectionColor={Colors.BLACK_COLOR}
                                                    onChangeText={onFunction.onChangeTextStateShipping}
                                                />
                                            }
                                        </View>
                                    }
                                />
                            </Form>
                        }
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    )
}

export const ViewBookAddress = ({
    props = null,
    state = null,
    inputs = null,
    onFunction = {
        onChangeAddress1: () => { },
        onChangeAddress2: () => { },
        onChangeFirstName: () => { },
        onChangeLastName: () => { },
        onChangeCompany: () => { },
        onChangePhone: () => { },
        onChangeEmail: () => { },
        onChangeCity: () => { },
        onChangeZipCode: () => { },
        onChangeCountry: () => { },
        onChangeState: () => { },
        onChangeTextState: () => { },

        onChangeAddress1Shipping: () => { },
        onChangeAddress2Shipping: () => { },
        onChangeFirstNameShipping: () => { },
        onChangeLastNameShipping: () => { },
        onChangeCompanyShipping: () => { },
        onChangeCityShipping: () => { },
        onChangeZipCodeShipping: () => { },
        onChangeCountryShipping: () => { },
        onChangeStateShipping: () => { },
        onChangeTextStateShipping: () => { },

        onPressAddAddress: () => { },
        onToggleAddAddress: () => { },
        onFocusNextField: () => { },
        onPressIsSameBilling: () => { }
    }
}) => {
    return (
        <View style={[cStyles.container, { width: Devices.width }]}>
            {!state._loading && RenderContentModal(state, props, inputs, onFunction)}

            <CLoading visible={state._loading} />
        </View>
    )
}