/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, SectionList, TouchableOpacity } from 'react-native';
import {
  Container, Card, Badge, Separator
} from 'native-base';
import Icon from 'react-native-fontawesome-pro';
import moment from "moment";
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import CViewRow from "~/components/CViewRow";
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Configs, Devices } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

const RenderSectionHeader = (title) => {
  return (
    <Separator bordered style={styles.con_section_list}>
      <CText style={[cStyles.txt_title_group, Configs.supportRTL && cStyles.txt_RTL]}>
        {moment(title, "YYYY-MM").format("MMMM YYYY")}
      </CText>
    </Separator>
  )
}

const RenderAppointmentEmpty = () => {
  return (
    <View style={[cStyles.column_align_center, { marginTop: Devices.sW('40%') }]}>
      <Icon name={'comment-alt-exclamation'} color={Colors.BORDER_COLOR} size={Devices.fS(50)} type={'light'} />
      <CText style={cStyles.txt_no_data_1} i18nKey={'empty_list'} />
    </View>
  )
}

const RenderAppointmentItem = (index, data) => {
  if (!data) return null;

  let i, title = "", day = "", time = "", statusFooter = "booking_failed";
  let findDay = data.meta_data && data.meta_data.find(f => f.key === "day");
  let findTime = data.meta_data && data.meta_data.find(f => f.key === "hour");
  let statusHeader = { title: "cancelled", color: "warning" };

  if (data.line_items) {
    for (i = 0; i < data.line_items.length; i++) {
      title += data.line_items[i].name;
      if (i !== data.line_items.length - 1) title += " | "
    }
  }

  if (findDay) day = findDay.value;
  if (findTime) time = findTime.value;

  switch (data.status) {
    case "pending":
      statusHeader = { title: "booking_pending", color: "warning" }
      statusFooter = "booking_pending";
      break;

    case "processing":
      statusHeader = { title: "processing", color: "info" }
      statusFooter = "processing";
      break;

    case "completed":
      statusHeader = { title: "order_success", color: "success" }
      statusFooter = "order_success";
      break;

    case "cancelled":
      statusHeader = { title: "booking_cancelled", color: "danger" }
      statusFooter = "booking_cancelled";
      break;

    case "failed":
      statusHeader = { title: "booking_failed", color: "danger" }
      statusFooter = "booking_failed";
      break;

    case "refunded":
      statusHeader = { title: "refunded", color: "grey" }
      statusFooter = "refunded";
      break;

    case "on-hold":
      statusHeader = { title: "on_hold", color: "grey" }
      statusFooter = "on_hold";
      break;

    case "order-returned":
      statusHeader = { title: "order_returned", color: "grey" }
      statusFooter = "order_returned";
      break;

    case "out-for-delivery":
      statusHeader = { title: "out_for_delivery", color: "info" }
      statusFooter = "out_for_delivery";
      break;

    case "driver-assigned":
      statusHeader = { title: "driver_assigned", color: "info" }
      statusFooter = "driver_assigned";
      break;
  }

  return (
    <TouchableOpacity>
      <Card style={styles.con_content_item}>
        <CViewRow between
          leftComp={<CText style={styles.txt_title_item} numberOfLines={5}>{title}</CText>}
          rightComp={
            <Badge warning={statusHeader.color === "warning"} success={statusHeader.color === "success"}
              info={statusHeader.color === "info"} danger={statusHeader.color === "danger"}
              style={[statusHeader.color === "grey" && { backgroundColor: "grey" }]}>
              <CText style={styles.txt_status_header} i18nKey={statusHeader.title} />
            </Badge>
          }
        />

        <View style={styles.con_footer_item}>
          <View style={styles.con_row_item}>
            <CText style={styles.txt_row_item} i18nKey={Configs.allowBooking ? "booking_code" : "order_code"} />
            <CText style={styles.txt_row_item}>{': ' + data.number}</CText>
          </View>
          {Configs.allowBooking &&
            <View style={styles.con_row_item}>
              <CText style={styles.txt_row_item} i18nKey={'date'} />
              <CText style={styles.txt_group_right}>{``}</CText>
              <CText style={styles.txt_row_item}>{`: ${day} ${time}`}</CText>
            </View>
          }
        </View>
      </Card>
    </TouchableOpacity>
  )
}

export const ViewVendorOrders = ({
  state = null,
  onFunction = {
    onPressBack: () => { },
    onRefresh: () => { },
    onLoadMore: () => { }
  }
}) => {
  return (
    <Container>
      <CHeader
        title={"order"}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={"none"}
        onPressLeft_1={onFunction.onPressBack}
      />

      {!state._loading &&
        <SectionList style={cStyles.pb_10}
          contentContainerStyle={[cStyles.flex_grow, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}
          sections={state._orders}
          renderItem={({ item, index }) => RenderAppointmentItem(index, item)}
          renderSectionHeader={({ section: { title } }) => RenderSectionHeader(title)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={RenderAppointmentEmpty}
          removeClippedSubviews={Devices.OS === 'android'}
          refreshing={state._refreshing}
          onRefresh={onFunction.onRefresh}
          onEndReachedThreshold={0.5}
          onEndReached={onFunction.onLoadMore}
        />
      }

      <CLoading visible={state._loading} />
    </Container>
  )
}