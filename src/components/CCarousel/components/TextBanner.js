/**
 ** Name: TextBanner.js
 ** Author: ZiniSoft Ltd
 ** CreatedAt: 2020
 ** Description: Description of TextBanner.js
**/
/* LIBRARY */
import React from "react";
import { View } from "react-native";
import HTML from 'react-native-render-html';
import LinearGradient from 'react-native-linear-gradient';
/* COMMON */
import { Colors } from '~/utils/colors';
import { cStyles } from '~/utils/styles';

const INIT = {
    PADDING_VERTICAL: 15,
    PADDING_HORIZONTAL: 10,
    BORDER_BOTTOM_LEFT_RADIUS: 10,
    BORDER_BOTTOM_RIGHT_RADIUS: 10,
}

const BANNER_TEXT_FORMAT = {
    text_above_bl: "text_above_bl",
    text_above_bc: "text_above_bc",
    text_above_br: "text_above_br",
    text_above_tl: "text_above_tl",
    text_above_tc: "text_above_tc",
    text_above_tr: "text_above_tr",
    text_above_middle: "text_above_middle",
    text_under_banner: "text_under_banner",
}

const styles = {
    con_txt_slider: { position: "absolute" },
    con_txt_slider_child: {
        height: "100%",
        paddingVertical: INIT.PADDING_VERTICAL,
        paddingHorizontal: INIT.PADDING_HORIZONTAL,
        borderBottomLeftRadius: INIT.BORDER_BOTTOM_LEFT_RADIUS,
        borderBottomRightRadius: INIT.BORDER_BOTTOM_RIGHT_RADIUS,
    },

    con_txt_slider_bl: { bottom: 0, left: 0, right: 0 },
    con_txt_slider_br: { bottom: 0, right: 0, left: 0 },
    con_txt_slider_tl: { top: 0, left: 0, right: 0 },
    con_txt_slider_tr: { top: 0, right: 0, left: 0 },
    con_txt_slider_bc: [cStyles.column_align_center, { bottom: 10, left: 0, right: 0 }],
    con_txt_slider_tc: [cStyles.column_align_center, { top: 10, left: 0, right: 0 }],
    con_txt_slider_middle: [cStyles.center, { top: 0, bottom: 0, right: 0, left: 0 }],
}

const HtmlText = (data = null) => {
    if (!data) return null;

    return (
        <HTML
            html={data.caption}
            tagsStyles={{
                p: {
                    color: Colors.WHITE_COLOR,
                    fontFamily: cStyles.txt_body_meta_item.fontFamily,
                    fontSize: cStyles.txt_base_item.fontSize
                }
            }}
        />
    )
}

export default TextBanner = (data = '') => {
    if (!data) return null;

    let title = data.caption !== "" ? <LinearGradient style={styles.con_txt_slider_child} colors={Colors.HOME_SLIDER_GRADIENT}>{HtmlText(data)}</LinearGradient > : null

    switch (data.format) {
        case BANNER_TEXT_FORMAT.text_above_bl:
            return (
                <View style={[styles.con_txt_slider, styles.con_txt_slider_bl]}>
                    {title}
                </View>
            );
        case BANNER_TEXT_FORMAT.text_above_br:
            return (
                <View style={[styles.con_txt_slider, styles.con_txt_slider_br]}>
                    {title}
                </View>
            )
        case BANNER_TEXT_FORMAT.text_above_tl:
            return (
                <View style={[styles.con_txt_slider, styles.con_txt_slider_tl]}>
                    {title}
                </View>
            )
        case BANNER_TEXT_FORMAT.text_above_tr:
            return (
                <View style={[styles.con_txt_slider, styles.con_txt_slider_tr]}>
                    {title}
                </View>
            )
        case BANNER_TEXT_FORMAT.text_above_bc:
            return (
                <View style={[styles.con_txt_slider, styles.con_txt_slider_bc]}>
                    {title}
                </View>
            )
        case BANNER_TEXT_FORMAT.text_above_tc:
            return (
                <View style={[styles.con_txt_slider, styles.con_txt_slider_tc]}>
                    {title}
                </View>
            )
        case BANNER_TEXT_FORMAT.text_above_middle:
            return (
                <View style={[styles.con_txt_slider, styles.con_txt_slider_middle]}>
                    {title}
                </View>
            )
        case BANNER_TEXT_FORMAT.text_under_banner:
            return (
                <View style={[styles.con_txt_slider, styles.con_txt_slider_bl]}>
                    {title}
                </View>
            )
        default:
            return (
                <View style={[styles.con_txt_slider, styles.con_txt_slider_bl]}>
                    {title}
                </View>
            );
    }
}