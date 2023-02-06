/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import Dash from 'react-native-dash';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import { Colors } from '~/utils/colors';
import { Devices, Configs } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

let STEP = {
  SHIPPING: 0,
  PICK_DAY: 1,
  CONFIRM: 2,
  PAYMENT: 3,
}

export const BookHeader = ({
  currentSteps = STEP.PICK_DAY
}) => {
  return (
    <View style={styles.con}>
      {!Configs.supportRTL ?
        <View style={[styles.con_header, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
          {/** SHIPPING */}
          <View style={[styles.con_item, { borderColor: Colors.PRIMARY_COLOR }]}>
            <Icon containerStyle={[styles.con_item_icon, { backgroundColor: Colors.PRIMARY_COLOR }]}
              name={"map-marker-alt"}
              size={Devices.fS(20)}
              color={Colors.WHITE_COLOR}
              type={"light"}
            />
          </View>

          <Dash style={styles.con_content_dash}
            dashGap={4}
            dashLength={6}
            dashColor={
              currentSteps > (Configs.allowBooking ?
                STEP.PICK_DAY :
                STEP.PICK_DAY - 1) ?
                Colors.PRIMARY_COLOR :
                Colors.PLACEHOLDER_COLOR}
          />

          {/** PICK DAY */}
          {Configs.allowBooking &&
            <>
              <View style={
                currentSteps >= (Configs.allowBooking ?
                  STEP.PICK_DAY :
                  STEP.PICK_DAY - 1) ?
                  [styles.con_item, { borderColor: Colors.PRIMARY_COLOR }] :
                  styles.con_item_inActive}>
                <Icon containerStyle={
                  currentSteps >= (Configs.allowBooking ?
                    STEP.PICK_DAY :
                    STEP.PICK_DAY - 1) ?
                    [styles.con_item_icon, { backgroundColor: Colors.PRIMARY_COLOR }] :
                    styles.con_item_icon_inActive}
                  name={"calendar-alt"}
                  size={Devices.fS(20)}
                  color={Colors.WHITE_COLOR}
                  type={"light"}
                />
              </View>

              <Dash style={styles.con_content_dash}
                dashGap={4}
                dashLength={6}
                dashColor={currentSteps >= (Configs.allowBooking ?
                  STEP.CONFIRM :
                  STEP.CONFIRM - 1) ?
                  Colors.PRIMARY_COLOR :
                  Colors.PLACEHOLDER_COLOR}
              />
            </>
          }

          {/** CONFIRM */}
          <View style={
            currentSteps >= (Configs.allowBooking ?
              STEP.CONFIRM :
              STEP.CONFIRM - 1) ?
              [styles.con_item, { borderColor: Colors.PRIMARY_COLOR }] :
              styles.con_item_inActive}>
            <Icon containerStyle={
              currentSteps >= (Configs.allowBooking ?
                STEP.CONFIRM :
                STEP.CONFIRM - 1) ?
                [styles.con_item_icon, { backgroundColor: Colors.PRIMARY_COLOR }] :
                styles.con_item_icon_inActive}
              name={"check-circle"}
              size={Devices.fS(20)}
              color={Colors.WHITE_COLOR}
              type={"light"}
            />
          </View>

          <Dash style={styles.con_content_dash}
            dashGap={4}
            dashLength={6}
            dashColor={
              currentSteps >= (Configs.allowBooking ?
                STEP.PAYMENT :
                STEP.PAYMENT - 1) ?
                Colors.PRIMARY_COLOR :
                Colors.PLACEHOLDER_COLOR}
          />

          {/** PAYMENNT */}
          <View style={
            currentSteps >= (Configs.allowBooking ?
              STEP.PAYMENT :
              STEP.PAYMENT - 1) ?
              [styles.con_item, { borderColor: Colors.PRIMARY_COLOR }] :
              styles.con_item_inActive}>
            <Icon containerStyle={
              currentSteps >= (Configs.allowBooking ?
                STEP.PAYMENT :
                STEP.PAYMENT - 1) ?
                [styles.con_item_icon, { backgroundColor: Colors.PRIMARY_COLOR }] :
                styles.con_item_icon_inActive}
              name={"file-invoice-dollar"}
              size={Devices.fS(20)}
              color={Colors.WHITE_COLOR}
              type={"light"}
            />
          </View>
        </View>
        :
        <View style={[styles.con_header, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
          {/** PAYMENNT */}
          <View style={
            currentSteps >= (Configs.allowBooking ?
              STEP.PAYMENT :
              STEP.PAYMENT - 1) ?
              [styles.con_item, { borderColor: Colors.PRIMARY_COLOR }] :
              styles.con_item_inActive}>
            <Icon containerStyle={
              currentSteps >= (Configs.allowBooking ?
                STEP.PAYMENT :
                STEP.PAYMENT - 1) ?
                [styles.con_item_icon, { backgroundColor: Colors.PRIMARY_COLOR }] :
                styles.con_item_icon_inActive}
              name={"file-invoice-dollar"}
              size={Devices.fS(20)}
              color={Colors.WHITE_COLOR}
              type={"light"}
            />
          </View>

          <Dash style={styles.con_content_dash}
            dashGap={4}
            dashLength={6}
            dashColor={
              currentSteps > (Configs.allowBooking ?
                STEP.PAYMENT :
                STEP.PAYMENT - 1) ?
                Colors.PRIMARY_COLOR :
                Colors.PLACEHOLDER_COLOR}
          />

          {/** CONFIRM */}
          <View style={
            currentSteps >= (Configs.allowBooking ?
              STEP.CONFIRM :
              STEP.CONFIRM - 1) ?
              [styles.con_item, { borderColor: Colors.PRIMARY_COLOR }] :
              styles.con_item_inActive}>
            <Icon containerStyle={
              currentSteps >= (Configs.allowBooking ?
                STEP.CONFIRM :
                STEP.CONFIRM - 1) ?
                [styles.con_item_icon, { backgroundColor: Colors.PRIMARY_COLOR }] :
                styles.con_item_icon_inActive}
              name={"check-circle"}
              size={Devices.fS(20)}
              color={Colors.WHITE_COLOR}
              type={"light"}
            />
          </View>

          <Dash style={styles.con_content_dash}
            dashGap={4}
            dashLength={6}
            dashColor={
              currentSteps >= (Configs.allowBooking ?
                STEP.CONFIRM :
                STEP.CONFIRM - 1) ?
                Colors.PRIMARY_COLOR :
                Colors.PLACEHOLDER_COLOR}
          />

          {/** PICK DAY */}
          {Configs.allowBooking &&
            <>
              <View style={
                currentSteps >= (Configs.allowBooking ?
                  STEP.PICK_DAY :
                  STEP.PICK_DAY - 1) ?
                  [styles.con_item, { borderColor: Colors.PRIMARY_COLOR }] :
                  styles.con_item_inActive}>
                <Icon containerStyle={
                  currentSteps >= (Configs.allowBooking ?
                    STEP.PICK_DAY :
                    STEP.PICK_DAY - 1) ?
                    [styles.con_item_icon, { backgroundColor: Colors.PRIMARY_COLOR }] :
                    styles.con_item_icon_inActive}
                  name={"calendar-alt"}
                  size={Devices.fS(20)}
                  color={Colors.WHITE_COLOR}
                  type={"light"}
                />
              </View>

              <Dash style={styles.con_content_dash}
                dashGap={4}
                dashLength={6}
                dashColor={currentSteps >= (Configs.allowBooking ?
                  STEP.PICK_DAY :
                  STEP.PICK_DAY - 1) ?
                  Colors.PRIMARY_COLOR :
                  Colors.PLACEHOLDER_COLOR}
              />
            </>
          }


          {/** SHIPPING */}
          <View style={[styles.con_item, { borderColor: Colors.PRIMARY_COLOR }]}>
            <Icon containerStyle={[styles.con_item_icon, { backgroundColor: Colors.PRIMARY_COLOR }]}
              name={"map-marker-alt"}
              size={Devices.fS(20)}
              color={Colors.WHITE_COLOR}
              type={"light"}
            />
          </View>
        </View>
      }

      {!Configs.supportRTL ?
        <View style={[styles.con_header, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
          <CText style={[styles.txt_title, { color: Colors.PRIMARY_COLOR }]} i18nKey={"address"} />
          <View style={styles.con_dash}></View>
          {Configs.allowBooking &&
            <>
              <CText style={
                currentSteps >= (Configs.allowBooking ?
                  STEP.PICK_DAY :
                  STEP.PICK_DAY - 1) ?
                  [styles.txt_title, { color: Colors.PRIMARY_COLOR }] :
                  styles.txt_title_inActive} i18nKey={"delivery"} />
              <View style={styles.con_dash}></View>
            </>
          }
          <CText style={
            currentSteps >= (Configs.allowBooking ?
              STEP.CONFIRM :
              STEP.CONFIRM - 1) ?
              [styles.txt_title, { color: Colors.PRIMARY_COLOR }] :
              styles.txt_title_inActive} i18nKey={"confirm"} />
          <View style={styles.con_dash}></View>
          <CText style={
            currentSteps >= (Configs.allowBooking ?
              STEP.PAYMENT :
              STEP.PAYMENT - 1) ?
              [styles.txt_title, { color: Colors.PRIMARY_COLOR }] :
              styles.txt_title_inActive} i18nKey={"payment"} />
        </View>
        :
        <View style={[styles.con_header, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
          <CText style={
            currentSteps >= (Configs.allowBooking ?
              STEP.PAYMENT :
              STEP.PAYMENT - 1) ?
              [styles.txt_title, { color: Colors.PRIMARY_COLOR }] :
              styles.txt_title_inActive} i18nKey={"payment"} />

          <View style={styles.con_dash}></View>

          <CText style={
            currentSteps >= (Configs.allowBooking ?
              STEP.CONFIRM :
              STEP.CONFIRM - 1) ?
              [styles.txt_title, { color: Colors.PRIMARY_COLOR }] :
              styles.txt_title_inActive} i18nKey={"confirm"} />

          <View style={styles.con_dash}></View>

          {Configs.allowBooking &&
            <>
              <CText style={
                currentSteps >= (Configs.allowBooking ?
                  STEP.PICK_DAY :
                  STEP.PICK_DAY - 1) ?
                  [styles.txt_title, { color: Colors.PRIMARY_COLOR }] :
                  styles.txt_title_inActive} i18nKey={"delivery"} />

              <View style={styles.con_dash}></View>
            </>
          }

          <CText style={[styles.txt_title, { color: Colors.PRIMARY_COLOR }]} i18nKey={"address"} />
        </View>
      }
    </View>

  )
}