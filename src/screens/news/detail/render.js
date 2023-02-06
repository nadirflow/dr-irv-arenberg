/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { Container, Content } from "native-base";
import Icon from 'react-native-fontawesome-pro';
import HTML from 'react-native-render-html';
import firebase from 'react-native-firebase';
import WebView from 'react-native-webview';
/* COMPONENTS */
import CText from '~/components/CText';
import CImage from '~/components/CImage';
import CAudio from '~/components/CAudio';
import CVideo from '~/components/CVideo';
import CLightBox from '~/components/CLightBox';
import Horizontal from '~/components/CLayout/Horizontal';
import CLoading from '~/components/CLoading';
import CViewRow from '~/components/CViewRow';
/* COMMON */
import { Colors } from '~/utils/colors';
import { Devices, Assets, Configs, isIphoneX, Keys } from '~/config';
import { cStyles } from '~/utils/styles';
import { layoutWidth } from '~/utils/layout_width';
/* STYLES */
import styles from './style';

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();
const MIN_HEIGHT = 80;

export const ViewNewsPostDetail = ({
  data = null,
  category = null,
  
  state = null,
  settings = { 
    blog: {
      categories: null,
      author: null,
      tags: null
    }
  },
  onFunction = {
    onPressBack: () => { },
    onPressItem: () => { },
    onPressBookmark: () => { },
    onPressShare: () => { }
  }
}) => {
  
  let source = Assets.image_slider_failed,
    title = Configs.html5Entities.decode(data.title.rendered),
    time = Configs.parseTimestamp(data.date);
  let scaleImage = 1;
  if (data.featured_media && typeof data.featured_media !== 'number') {
    source = { uri: data.featured_media.sizes.large };
    scaleImage = data.featured_media.sizes["large-width"] / data.featured_media.sizes["large-height"]
  }
  let size = Devices.sImage("product_detail", scaleImage);

  let imageOpacity = state._scrollY.interpolate({
    inputRange: [0, (size.height - MIN_HEIGHT)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  let headerOpacity = state._scrollY.interpolate({
    inputRange: [0, (size.height - MIN_HEIGHT)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  console.log("data.content.rendered", data.content.rendered)
  console.log('category.thumbnail.sizes')
  console.log('category.thumbnail.sizes')
  console.log('category.thumbnail.sizes')
  console.log(category.thumbnail.sizes)
  console.log('category.thumbnail.sizes')
  console.log('category.thumbnail.sizes')
  console.log('category.thumbnail.sizes')
  return (
    <Container>
      {!Configs.supportRTL ?
        <Animated.View style={[styles.con_header_fixed, { opacity: headerOpacity }]}>
          <TouchableOpacity style={[styles.con_btn_back, { left: Devices.pH(layoutWidth.width) }]}
            onPress={onFunction.onPressBack}>
            <Icon name={"angle-left"}
              size={Devices.fS(20)}
              color={Colors.BLACK_COLOR}
              type={'regular'} />
          </TouchableOpacity>

          <CText style={[styles.txt_title_header_fixed, { left: Devices.pH(layoutWidth.width) + 30 }]} numberOfLines={2}>{title}</CText>

          <TouchableOpacity style={[styles.con_btn_bookmark, { right: Devices.pH(layoutWidth.width) * 4 }]}
            onPress={onFunction.onPressBookmark}>
            <Icon
              name={"bookmark"}
              size={Devices.fS(20)}
              color={state._isInBookmark ? Colors.PRIMARY_COLOR : Colors.BLACK_COLOR}
              type={state._isInBookmark ? 'solid' : 'regular'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.con_btn_share, { right: Devices.pH(layoutWidth.width) }]}
            onPress={() => onFunction.onPressShare(title)}>
            <Icon
              name={"share-alt"}
              size={Devices.fS(20)}
              color={Colors.BLACK_COLOR}
              type={'regular'}
            />
          </TouchableOpacity>
        </Animated.View>
        :
        <Animated.View style={[styles.con_header_fixed, { opacity: headerOpacity, justifyContent: "flex-end" }]}>
          <TouchableOpacity style={[styles.con_btn_share, { left: Devices.pH(layoutWidth.width) }]}
            onPress={() => onFunction.onPressShare(title)}>
            <Icon
              name={"share-alt"}
              size={Devices.fS(20)}
              color={Colors.BLACK_COLOR}
              type={'regular'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.con_btn_bookmark, { left: Devices.pH(layoutWidth.width) * 4 }]}
            onPress={onFunction.onPressBookmark}>
            <Icon
              name={"bookmark"}
              size={Devices.fS(20)}
              color={state._isInBookmark ? Colors.PRIMARY_COLOR : Colors.BLACK_COLOR}
              type={state._isInBookmark ? 'solid' : 'regular'}
            />
          </TouchableOpacity>

          <CText style={styles.txt_title_header_fixed_RTL} numberOfLines={2}>{title}</CText>

          <TouchableOpacity style={[styles.con_btn_back, { right: Devices.pH(layoutWidth.width) }]}
            onPress={onFunction.onPressBack}>
            <Icon
              name={"angle-right"}
              size={Devices.fS(20)}
              color={Colors.BLACK_COLOR}
              type={'regular'}
            />
          </TouchableOpacity>
        </Animated.View>
      }

      <Content
        style={styles.con_content_full}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: state._scrollY } } }]
        )}
      >
        {!Configs.supportRTL ?
          <Animated.View style={[styles.con_header, { opacity: imageOpacity, width: size.width, height: size.height }]}>
            <CImage
              style={[styles.img_header, { width: size.width, height: size.height }]}
              source={source}
            />

            <TouchableOpacity style={[styles.con_icon_back_full, { left: Devices.pH(layoutWidth.width) }]}
              onPress={onFunction.onPressBack}>
              <Icon
                name={"angle-left"}
                size={Devices.fS(20)}
                color={Colors.BLACK_COLOR}
                type={"regular"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.con_icon_bookmark_full, { right: (Devices.pH(layoutWidth.width)) * 4 }]}
              onPress={onFunction.onPressBookmark}>
              <Icon
                name={"bookmark"}
                size={Devices.fS(20)}
                color={state._isInBookmark ? Colors.PRIMARY_COLOR : Colors.BLACK_COLOR}
                type={state._isInBookmark ? 'solid' : "regular"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.con_icon_share_full, { right: Devices.pH(layoutWidth.width) }]}
              onPress={() => onFunction.onPressShare(title)}>
              <Icon
                name={"share-alt"}
                size={Devices.fS(20)}
                color={Colors.BLACK_COLOR}
                type={"regular"}
              />
            </TouchableOpacity>
          </Animated.View>
          :
          <Animated.View style={[styles.con_header, { opacity: imageOpacity, width: size.width, height: size.height }]}>
            <CImage
              style={[styles.img_header, { width: size.width, height: size.height }]}
              source={source}
            />

            <TouchableOpacity style={[styles.con_icon_share_full, { left: -13 }]}
              onPress={() => onFunction.onPressShare(title)}>
              <Icon
                name={"share-alt"}
                size={Devices.fS(20)}
                color={Colors.BLACK_COLOR}
                type={"regular"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.con_icon_bookmark_full, { left: 30 }]}
              onPress={onFunction.onPressBookmark}>
              <Icon
                name={"bookmark"}
                size={Devices.fS(20)}
                color={state._isInBookmark ? Colors.PRIMARY_COLOR : Colors.BLACK_COLOR}
                type={state._isInBookmark ? 'solid' : "regular"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.con_icon_back_full, { right: -13 }]}
              onPress={onFunction.onPressBack}>
              <Icon
                name={"angle-right"}
                size={Devices.fS(20)}
                color={Colors.BLACK_COLOR}
                type={"regular"}
              />
            </TouchableOpacity>
          </Animated.View>
        }

        {!state._loading &&
          <View style={[styles.con_content, { marginHorizontal: Devices.pH(layoutWidth.width), }]}>
            <CText numberOfLines={5} style={[styles.txt_title_header, { fontSize: cStyles.txt_title_group.fontSize * 1.5, color: '#000' }]}>{title}</CText>

            <CViewRow style={cStyles.pv_10} start={!Configs.supportRTL} end={Configs.supportRTL}
              leftComp={
                category &&
                <CViewRow
                  leftComp={
                    <>
                    {/* <CImage
                      style={styles.img_category}
                      source={{ uri: category.thumbnail.sizes["thumbnail"] }}
                    /> */}
                    </>
                  }
                  rightComp={
                    <CText style={[styles.txt_categories, cStyles.ph_10, {color: '#000'}]}>
                      {(Configs.supportRTL ? "| " : "") + category.name + (!Configs.supportRTL ? " |" : "")}
                    </CText>
                  }
                />
              }
              rightComp={
                <View style={styles.con_news_time}>
                  <CText style={[styles.txt_news_time, {color: '#000'} ]}>{time.time} </CText>
                  {time.type !== 'days' && <CText style={styles.txt_news_time} i18nKey={time.type} />}
                  {settings.blog.author && <CText style={styles.txt_news_time} i18nKey={"by"} />}
                  {settings.blog.author && <CText style={styles.txt_author}>{data.author.author_name}</CText>}
                </View>
              }
            />


            {state._isAudio &&
              <CAudio source={state._audioUrl} />
            }
            {state._isVideo &&
              <CVideo source={state._videoUrl} type={Keys.KEY_POST_VIDEO_YOUTUBE} />
            }
            {state._isGallery &&
              <CLightBox images={state._gallery} />
            }

            <HTML
              html={data.content.rendered}
              imagesMaxWidth={Devices.sW(`${layoutWidth.width}%`)}
              staticContentMaxWidth={Devices.sW(`${layoutWidth.width}%`)}
              tagsStyles={{
                p: {
                  color: '#000',
                  fontSize: cStyles.txt_base_item.fontSize,
                  fontFamily: cStyles.txt_base_item.fontFamily,
                  lineHeight: 25,
                  textAlign: Configs.supportRTL ? "right" : "left"
                },
                h1: {
                  color: '#000',
                  fontSize: cStyles.txt_title_group.fontSize,
                  fontFamily: cStyles.txt_title_group.fontFamily,
                  lineHeight: 25,
                  textAlign: Configs.supportRTL ? "right" : "left"
                },
                h2: {
                  color: '#000',
                  fontSize: cStyles.txt_title_item.fontSize,
                  fontFamily: cStyles.txt_title_item.fontFamily,
                  lineHeight: 25,
                  textAlign: Configs.supportRTL ? "right" : "left"
                },
                li: {
                  color: '#000',
                  fontSize: cStyles.txt_base_item.fontSize,
                  fontFamily: cStyles.txt_base_item.fontFamily,
                  lineHeight: 25,
                  textAlign: Configs.supportRTL ? "right" : "left"
                },
              }}
              renderers={{
                iframe: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                  return (
                    <View>
                      <WebView
                        source={{ uri: htmlAttribs.src }}
                        style={styles.con_video}
                      />
                      {htmlAttribs.title && htmlAttribs.title !== "" &&
                        <CText style={styles.txt_title_video} numberOfLines={3}>{htmlAttribs.title}</CText>
                      }
                    </View>
                  )
                },
                figure: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                  if (children && children.length > 0) {
                    for (let obj of children) {
                      if (obj && obj.length > 0) {
                        for (let obj1 of obj) {
                          if (obj1 && obj1.props && obj1.props.source && obj1.props.source.uri) {
                            return (
                              <View style={{ borderRadius: 10 }}>
                                <CImage
                                  style={styles.img_content}
                                  source={{ uri: obj1.props.source.uri }}
                                  resizeMode={"contain"}
                                />
                              </View>
                            )
                          }
                        }
                      }
                    }
                  }
                  return null
                }
              }}
            />
            {(settings.blog.tags && data.tags && data.tags.length > 0) &&
              <View style={styles.con_tags}>
                {data.tags.map((item, index) => {
                  return (
                    <View key={index.toString()} style={styles.con_single_tags}>
                      <CText style={styles.txt_tags}>{`#${item.name}`}</CText>
                    </View>
                  )
                })}
              </View>
            }
            {state._related.length > 0 && <CText style={styles.txt_title_related} i18nKey={"related_posts"} upperCase />}
            {state._related.length > 0 &&
              <Horizontal
                contentStyle={{ marginBottom: isIphoneX() ? Devices.sW('13%') : Devices.sW('10%') }}
                data={state._related}
                onFunction={{
                  onPressItem: onFunction.onPressItem
                }}
                isNews
                leftThumb
              />
            }
          </View>
        }
      </Content>

      <CLoading visible={state._loading} />
    </Container>
  )
}
