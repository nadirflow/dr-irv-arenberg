/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import {
  Container, Button, Footer, Form, Textarea
} from 'native-base';
import Icon from 'react-native-fontawesome-pro';
import HTML from 'react-native-render-html';
import StarRating from 'react-native-star-rating';
import * as Progress from 'react-native-progress';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import CImage from '~/components/CImage';
import { CRateStar } from '~/components/CRateStar';
import CHeader from "~/components/CHeader";
import CViewRow from '~/components/CViewRow';
/* COMMON */
import { cStyles } from '~/utils/styles';
import { Assets, Configs, Languages, Devices } from '~/config';
import { Colors } from '~/utils/colors';
/* STYLES */
import styles from './style';
import { layoutWidth } from '~/utils/layout_width';

const RenderEmptyReviews = () => {
  return (
    <View style={[cStyles.column_align_center, { marginTop: Devices.sW('10%') }]}>
      <Icon name={'comment-alt-exclamation'} color={Colors.BORDER_COLOR} size={Devices.fS(50)} type={'light'} />
      <CText style={cStyles.txt_no_data_1} i18nKey={'empty_reviews'} />
    </View>
  )
}

const RenderReviewsItem = (index, data) => {
  let source = Assets.image_failed, time = "";
  time = moment(data.date_created).format(Configs.formatDate);
  if (data.reviewer_avatar_urls) {
    source = { uri: data.reviewer_avatar_urls['96'] };
  }

  return (
    <View style={[styles.con_review_item, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
      <View style={styles.con_item_top}>
        <View style={styles.con_item_top_left}>
          <CImage
            style={styles.img_avatar}
            source={source}
          />
          <View style={cStyles.column_align_start, { marginLeft: 10 }}>
            <CText style={styles.txt_name_reviewer}>{data.reviewer}</CText>
            <CRateStar containerStyleStar={styles.con_star} averageRating={Number(data.rating)} />
          </View>
        </View>

        <View style={styles.con_item_top_right}>
          <CText style={styles.txt_time_reviewer}>{time}</CText>
        </View>
      </View>

      <View style={styles.con_item_bottom}>
        <HTML
          html={data.review}
          tagsStyles={{ p: styles.txt_tag_content }}
        />
      </View>
    </View>
  )
}

export const ViewReviews = ({
  state = null,
  props = null,
  data = {
    numOfStar5: 0,
    numOfStar4: 0,
    numOfStar3: 0,
    numOfStar2: 0,
    numOfStar1: 0,
  },
  onFunctions = {
    onPressWriteReview: () => { },
    onPressSubmitReview: () => { },
    onPressBack: () => { },
    onChangeText: () => { },
    selectedStar: () => { }
  }
}) => {
  let scaleImage = 1, source = Assets.image_failed, size = null;
  let _progress5Star = data.numOfStar5 > 0 ? (data.numOfStar5 / state._product.rating_count).toFixed(1) : 0;
  let _progress4Star = data.numOfStar4 > 0 ? (data.numOfStar4 / state._product.rating_count).toFixed(1) : 0;
  let _progress3Star = data.numOfStar3 > 0 ? (data.numOfStar3 / state._product.rating_count).toFixed(1) : 0;
  let _progress2Star = data.numOfStar2 > 0 ? (data.numOfStar2 / state._product.rating_count).toFixed(1) : 0;
  let _progress1Star = data.numOfStar1 > 0 ? (data.numOfStar1 / state._product.rating_count).toFixed(1) : 0;
  if (state._isWriteReview) {
    if (state._product.images && state._product.images.length > 0) {
      source = { uri: state._product.images[0].sizes.thumbnail };
      scaleImage = state._product.images[0].sizes["woocommerce_thumbnail-width"] / state._product.images[0].sizes["woocommerce_thumbnail-height"];
    }

    size = Devices.sImage("column", scaleImage);
  }

  return (
    <Container>
      <CHeader
        title={!state._isWriteReview ? 'all_reviews' : 'write_review'}
        iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
        iconRight_1={state._isWriteReview ? "paper-plane" : "none"}
        onPressLeft_1={onFunctions.onPressBack}
        onPressRight_1={onFunctions.onPressSubmitReview}
      />

      {!state._isWriteReview &&
        <>
          <ScrollView style={cStyles.pb_10}>
            <View style={styles.con_top_content}>
              <View style={styles.con_rating_count}>
                <CText style={styles.txt_rating_count}>{parseFloat(state._product.average_rating).toFixed(1)}</CText>
              </View>
              <View style={[styles.con_star_reviewer, { paddingVertical: 10 }]}>
                <CText style={styles.txt_title_tab_star}>
                  <CText style={styles.txt_title_tab_star} i18nKey={'base_on'} />
                  {' ' + state._product.rating_count + ' '}
                  <CText style={styles.txt_title_tab_star} i18nKey={'reviews_lower'} toLowerCase />
                </CText>
                <CRateStar containerStyle={cStyles.pt_10}
                  averageRating={state._product.average_rating}
                  size={Devices.fS(20)}
                />
              </View>
            </View>

            <View style={styles.con_middle_content}>
              <CViewRow style={styles.con_row_num_star}
                leftComp={
                  <CViewRow
                    leftComp={
                      <CText style={[styles.txt_num_star, { flex: .15 }]} i18nKey={'star_5'} />
                    }
                    rightComp={
                      <Progress.Bar style={{ flex: .8 }} height={3} width={null}
                        borderRadius={5}
                        useNativeDriver={true}
                        color={Colors.PRIMARY_COLOR}
                        unfilledColor={Colors.BORDER_COLOR}
                        progress={_progress5Star}
                        indeterminate={state._loading}
                      />
                    }
                  />
                }
                rightComp={
                  <CText style={[styles.txt_num_star, { flex: .5, textAlign: 'center' }]}>{data.numOfStar5}</CText>
                }
              />

              <CViewRow style={styles.con_row_num_star}
                leftComp={
                  <CViewRow
                    leftComp={
                      <CText style={[styles.txt_num_star, { flex: .15 }]} i18nKey={'star_4'} />
                    }
                    rightComp={
                      <Progress.Bar style={{ flex: .8 }} height={3} width={null}
                        borderRadius={5}
                        useNativeDriver={true}
                        color={Colors.PRIMARY_COLOR}
                        unfilledColor={Colors.BORDER_COLOR}
                        progress={_progress4Star}
                        indeterminate={state._loading}
                      />
                    }
                  />
                }
                rightComp={
                  <CText style={[styles.txt_num_star, { flex: .5, textAlign: 'center' }]}>{data.numOfStar4}</CText>
                }
              />

              <CViewRow style={styles.con_row_num_star}
                leftComp={
                  <CViewRow
                    leftComp={
                      <CText style={[styles.txt_num_star, { flex: .15 }]} i18nKey={'star_3'} />
                    }
                    rightComp={
                      <Progress.Bar style={{ flex: .8 }} height={3} width={null}
                        borderRadius={5}
                        useNativeDriver={true}
                        color={Colors.PRIMARY_COLOR}
                        unfilledColor={Colors.BORDER_COLOR}
                        progress={_progress3Star}
                        indeterminate={state._loading}
                      />
                    }
                  />
                }
                rightComp={
                  <CText style={[styles.txt_num_star, { flex: .5, textAlign: 'center' }]}>{data.numOfStar3}</CText>
                }
              />

              <CViewRow style={styles.con_row_num_star}
                leftComp={
                  <CViewRow
                    leftComp={
                      <CText style={[styles.txt_num_star, { flex: .15 }]} i18nKey={'star_2'} />
                    }
                    rightComp={
                      <Progress.Bar style={{ flex: .8 }} height={3} width={null}
                        borderRadius={5}
                        useNativeDriver={true}
                        color={Colors.PRIMARY_COLOR}
                        unfilledColor={Colors.BORDER_COLOR}
                        progress={_progress2Star}
                        indeterminate={state._loading}
                      />
                    }
                  />
                }
                rightComp={
                  <CText style={[styles.txt_num_star, { flex: .5, textAlign: 'center' }]}>{data.numOfStar2}</CText>
                }
              />

              <CViewRow style={styles.con_row_num_star}
                leftComp={
                  <CViewRow
                    leftComp={
                      <CText style={[styles.txt_num_star, { flex: .15 }]} i18nKey={'star_1'} />
                    }
                    rightComp={
                      <Progress.Bar style={{ flex: .8 }} height={3} width={null}
                        borderRadius={5}
                        useNativeDriver={true}
                        color={Colors.PRIMARY_COLOR}
                        unfilledColor={Colors.BORDER_COLOR}
                        progress={_progress1Star}
                        indeterminate={state._loading}
                      />
                    }
                  />
                }
                rightComp={
                  <CText style={[styles.txt_num_star, { flex: .5, textAlign: 'center' }]}>{data.numOfStar1}</CText>
                }
              />
            </View>

            <View style={{ justifyContent: "space-between", flex: 1 }}>
              {!state._loading &&
                <FlatList contentContainerStyle={cStyles.flex_grow}
                  data={state._reviews}
                  renderItem={({ item, index }) => RenderReviewsItem(index, item)}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={() => <View style={[styles.con_separator_option, { marginHorizontal: Devices.pH(layoutWidth.width) }]} />}
                  ListEmptyComponent={RenderEmptyReviews}
                  scrollEnabled={false}
                />
              }
            </View>
          </ScrollView>

          {(props.user && state._product.reviews_allowed) &&
            <Footer style={[styles.con_footer, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
              <Button style={styles.con_btn} bordered color={Colors.PRIMARY_COLOR} onPress={onFunctions.onPressWriteReview}>
                <CText style={styles.txt_write}>{Languages[props.language].write_review}</CText>
              </Button>
            </Footer>
          }
        </>
      }

      {state._isWriteReview &&
        <>
          <ScrollView style={cStyles.container}>
            <View style={styles.con_img_product}>
              <CImage
                style={[styles.img_product, { width: size.width, height: size.height }]}
                source={source}
                resizeMod={"contain"}
              />
              <CText style={styles.txt_product_name} numberOfLines={2}>{state._product.name}</CText>
            </View>

            <View style={styles.con_star_reviewer}>
              <CText style={styles.txt_title_tab_star} i18nKey={'tab_to_star'} />
              <StarRating
                starStyle={styles.con_star_for_review}
                maxStars={5}
                rating={state._star}
                starSize={Devices.fS(25)}
                disabled={state._loadingSubmit}
                selectedStar={onFunctions.selectedStar}
                animation={'tada'}
                fullStarColor={Colors.YELLOW_COLOR}
                emptyStarColor={Colors.YELLOW_COLOR}
              />
            </View>

            <Form style={[styles.con_input_area, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
              <Textarea style={[styles.txt_input, Configs.supportRTL && { textAlign: "right" }]}
                rowSpan={5}
                bordered
                placeholder={Languages[props.language].your_review}
                placeholderTextColor={Colors.PLACEHOLDER_COLOR}
                removeClippedSubviews={Devices.OS === 'android'}
                blurOnSubmit={false}
                value={state._review}
                disabled={state._loadingSubmit}
                onChangeText={value => onFunctions.onChangeText(value)}
              />
            </Form>
          </ScrollView>
        </>
      }
      <CLoading visible={state._loading} />
    </Container >
  )
}