/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, TouchableOpacity, FlatList, Linking } from 'react-native';
import {
  Container, Content, Text, Button, Form, Textarea
} from "native-base";
import Icon from 'react-native-fontawesome-pro';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import { useColorScheme } from 'react-native-appearance';
import moment from 'moment';
/* COMPONENTS */
import { BookHeader } from '../partical';
import BookConfirm from '../confirm';
import BookPayment from '../payment';
import BookAddress from '../address';
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import CImage from '~/components/CImage';
import CHeader from "~/components/CHeader";
import CViewRow from '~/components/CViewRow';
/* COMMON */
import { Languages, Devices, Assets, Configs } from '~/config';
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

let listRef = null;
const scrollToIndex = (index, animated, scrollToIndex) => {
  listRef.scrollToIndex({ index: index, animated: animated });
  scrollToIndex(index);
}
const inputFields = {
  note: "note"
}

export const ViewBookPickDay = ({
  state = null,
  props = null,
  inputs = {},
  onFunction = {
    onPressBack: () => { },
    onTogglePicker: () => { },
    onConfirm: () => { },
    onCancel: () => { },
    onPressContinue: () => { },
    scrollToIndex: () => { },
    onGetShipping: () => { },
    onChangeText: () => { },
    onPressChoosePayment: () => { },
    onPressChooseAddress: () => { },
  }
}) => {
  let colorScheme = useColorScheme();

  return (
    <Container style={styles.con}>
      <CHeader
        title={"order"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />

      <Content contentContainerStyle={styles.con_content} nestedScrollEnabled >
        <BookHeader currentSteps={state._pageIndex} />

        <View style={styles.con_separator} />

        <FlatList
          ref={(ref) => listRef = ref}
          data={state._data}
          renderItem={({ item, index }) => renderItem(index, state, props, onFunction, inputs)}
          keyExtractor={(item, index) => index.toString()}
          inverted={Configs.supportRTL}
          horizontal={true}
          pagingEnabled={true}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
        />

        <View style={[styles.con_footer, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
          {!Configs.supportRTL && state._pageIndex > 0 &&
            <Button style={[
              styles.con_btn_back,
              state._pageIndex > 0 && { marginRight: 5 }
            ]} block onPress={() => scrollToIndex(state._pageIndex - 1, true, onFunction.scrollToIndex)} >
              <CText style={styles.txt_btn_back} i18nKey={'back'} />
            </Button>
          }
          <Button style={[
            styles.con_btn,
            state._pageIndex > 0 && (Configs.supportRTL ? { marginRight: 5 } : { marginLeft: 5 }),
            { backgroundColor: Colors.PRIMARY_COLOR }]} block
            onPress={() => onFunction.onPressContinue(scrollToIndex)}>
            <CText style={styles.txt_btn} i18nKey={state._pageIndex === state._data.length - 1 ? 'confirm' : 'continue'} />
          </Button>
          {Configs.supportRTL && state._pageIndex > 0 &&
            <Button style={[
              styles.con_btn_back,
              state._pageIndex > 0 && { marginLeft: 5 }
            ]} block onPress={() => scrollToIndex(state._pageIndex - 1, true, onFunction.scrollToIndex)} >
              <CText style={styles.txt_btn_back} i18nKey={'back'} />
            </Button>
          }
        </View>
      </Content>

      <DateTimePickerModal
        isVisible={state._pickerVisible}
        mode={state._pickerMode}
        isDarkModeEnabled={colorScheme === 'dark'}
        onConfirm={onFunction.onConfirm}
        onCancel={onFunction.onCancel}
        minimumDate={new Date()}
      />
    </Container >
  )
}

const renderPickDay = (state, props, onFunction, inputs) => {
  return (
    <View style={styles.con_pick_day}>
      <TouchableOpacity onPress={() => onFunction.onTogglePicker(state._mode.DATE)}>
        <CViewRow style={[styles.con_row_item, { marginHorizontal: Devices.pH(layoutWidth.width) }]}
          between
          leftComp={
            <CViewRow
              leftComp={
                <Icon name={"calendar-alt"}
                  size={cStyles.ic_left_detail.size}
                  color={cStyles.ic_left_detail.color}
                  type={cStyles.ic_left_detail.type} />
              }
              rightComp={
                <CText style={[
                  styles.txt_title_item,
                  Configs.supportRTL ? cStyles.pr_10 : cStyles.pl_10]}
                  i18nKey={"txt_booking_day"} />
              }
            />
          }
          rightComp={
            <CText style={styles.txt_title_item}>{moment(state._date).format(Configs.formatDate)}</CText>
          }
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onFunction.onTogglePicker(state._mode.TIME)}>
        <CViewRow style={[styles.con_row_item, { marginHorizontal: Devices.pH(layoutWidth.width) }]}
          between
          leftComp={
            <CViewRow
              leftComp={
                <Icon name={"clock"}
                  size={cStyles.ic_left_detail.size}
                  color={cStyles.ic_left_detail.color}
                  type={cStyles.ic_left_detail.type} />
              }
              rightComp={
                <CText style={[
                  styles.txt_title_item,
                  Configs.supportRTL ? cStyles.pr_10 : cStyles.pl_10]}
                  i18nKey={"txt_booking_hour"} />
              }
            />
          }
          rightComp={
            <CText style={styles.txt_title_item}>{moment(state._time).format(Configs.formatTime)}</CText>
          }
        />
      </TouchableOpacity>

      <Form style={[styles.con_input_area, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
        <Textarea style={styles.txt_input}
          ref={ref => inputs[inputFields.note] = ref}
          rowSpan={5}
          bordered
          placeholder={Languages[props.language].notes}
          placeholderTextColor={Colors.PLACEHOLDER_COLOR}
          removeClippedSubviews={Devices.OS === 'android'}
          blurOnSubmit={false}
          value={state._note}
          onChangeText={value => onFunction.onChangeText(value)}
        />
      </Form>
    </View>
  )
}

const renderItem = (index, state, props, onFunction, inputs) => {
  if (Configs.allowBooking) {
    if (index === 0) {
      return <BookAddress onPressAddress={onFunction.onPressChooseAddress} dataUser={state._userInfo || null} />
    } else if (index === 1) {
      return renderPickDay(state, props, onFunction, inputs);
    } else if (index === 2) {
      return <BookConfirm
        day={state._date}
        time={state._time}
        paymentMethod={null}
        paymentAddress={state._paymentAddress}
        data={state._dataService}
        getShipping={onFunction.onGetShipping} />
    }
    else if (index === 3)
      return <BookPayment onPressPayment={onFunction.onPressChoosePayment} data={state._dataPayment} />
  } else {
    if (index === 0) {
      return <BookAddress onPressAddress={onFunction.onPressChooseAddress} dataUser={state._userInfo || null} />
    } else if (index === 1)
      return <BookConfirm
        day={state._date}
        time={state._time}
        paymentMethod={null}
        paymentAddress={state._paymentAddress}
        data={state._dataService}
        getShipping={onFunction.onGetShipping}
      />
    else if (index === 2)
      return <BookPayment onPressPayment={onFunction.onPressChoosePayment} data={state._dataPayment} />
  }

}

export const PopupModal = ({
  visible = false,
  language = "vi",
  error = false,
  bookingCode = "",
  dateCreated = new Date(),
  loading = true,
  contact = "19001080",
  onFunction = {
    onPressCfmPopup: () => { }
  }
}) => {
  return (
    <Modal isVisible={visible}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      deviceWidth={Devices.width}
      useNativeDriver={true}
      style={styles.con_modal}
      onBackButtonPress={onFunction.onPressCfmPopup}
      onBackdropPress={onFunction.onPressCfmPopup}
    >
      {!loading &&
        <TouchableOpacity style={styles.con_popup} activeOpacity={1}>
          {error ?
            <View style={styles.con_popup_img}>
              <CImage
                source={Assets.book_failed}
                style={styles.img_popup}
              />
            </View>
            :
            <View style={[styles.con_popup_img, cStyles.center]}>
              <Icon name={"check-circle"} size={Devices.sW("35%")} color={Colors.GREEN_COLOR} type={"light"} />
            </View>
          }

          <CText style={[styles.txt_title_success, { color: Colors.PRIMARY_COLOR }]}
            i18nKey={error ? "booking_failed" : "booking_success"} upperCase />
          {!error &&
            <View style={[cStyles.center, cStyles.row, { paddingTop: 10 }]}>
              <CText style={cStyles.txt_base_item} i18nKey={"date"} />
              <CText style={cStyles.txt_base_item}>{`: ${moment(dateCreated).format("DD-MM-YYYY HH:mm")}`}</CText>
            </View>
          }

          <Text style={styles.txt_popup_content} numberOfLines={3}>
            {Languages[language][error ? "book_failed_content" : "book_success_content"]}
          </Text>
          <View style={styles.con_booking_code}>
            <CText style={cStyles.txt_base_item} i18nKey={error ? "contact_number" : "your_booking_code"} />
            {!error ?
              <CText style={cStyles.txt_base_item} >{` ${bookingCode}`}</CText>
              :
              <TouchableOpacity
                onPress={() => { Linking.openURL('tel:' + contact).catch(error => console.log('Error call to ', contact)); }}
              >
                <CText style={cStyles.txt_base_item} >{` ${contact}`}</CText>
              </TouchableOpacity>

            }
          </View>
          <Button block style={[styles.con_popup_btn, { backgroundColor: Colors.BACKGROUND_PRIMARY_COLOR }]}
            transparent onPress={onFunction.onPressCfmPopup}>
            <CText style={[cStyles.txt_title_button]} i18nKey={'ok'} />
          </Button>

        </TouchableOpacity>
      }

      <CLoading visible={loading} />
    </Modal>
  )
}
