/**
 ** Name: ParallaxImage.js
 ** Author: ZiniSoft Ltd
 ** CreatedAt: 2020
 ** Description: Description of ParallaxImage.js
**/
/* LIBRARY */
import React from "react";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { ParallaxImage } from 'react-native-snap-carousel';
/* COMPONENTS */
import TextBanner from "./TextBanner";
/* COMMON */
import { Colors } from '~/utils/colors';
import { Assets, Devices } from '~/config';
import { cStyles } from '~/utils/styles';

const INIT = {
    CONTAINER_PADDING: 60,
    IMAGE_MARGIN_VERTICAL: {
        ios: 0,
        android: 10
    },
    IMAGE_PADDING_VERTICAL: 20,
    BORDER_RADIUS: 10
}

const styles = {
    con: {
        height: Devices.width - INIT.CONTAINER_PADDING,
        width: Devices.width - INIT.CONTAINER_PADDING
    },
    con_image: [cStyles.shadow, cStyles.flex_full, {
        marginVertical: Platform.select({
            ios: INIT.IMAGE_MARGIN_VERTICAL.ios,
            android: INIT.IMAGE_MARGIN_VERTICAL.android
        }),
        backgroundColor: Colors.WHITE_COLOR,
        paddingVertical: INIT.IMAGE_PADDING_VERTICAL,
        borderRadius: INIT.BORDER_RADIUS,
    }],
    img_slider: {
        width: '100%',
        height: Devices.sW("100%"),
        resizeMode: 'cover',
        paddingVertical: INIT.IMAGE_PADDING_VERTICAL,
    },
}

export default CParallaxImage = ({ item, index }, parallaxProps, onPress) => {
    let source = Assets.image_failed;
    if (item.image) source = { uri: item.image.sizes.large };

    return (
        <View style={[cStyles.shadow, cStyles.mb_20]}>
            <TouchableOpacity style={styles.con} activeOpacity={.5} onPress={() => onPress(item)}>
                <ParallaxImage
                    style={styles.img_slider}
                    containerStyle={styles.con_image}
                    parallaxFactor={0.35}
                    showSpinner={true}
                    spinnerColor={parallaxProps.even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
                    source={source}
                    {...parallaxProps}
                />
            </TouchableOpacity>
            {TextBanner(item)}
        </View>
    )
}