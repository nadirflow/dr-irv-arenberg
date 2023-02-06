import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import queryString from 'query-string';
import {URL} from 'react-native-url-polyfill';
import { Colors } from '~/utils/colors';
import { Button, Container, Footer } from 'native-base';
import { Devices } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
import { cStyles } from '~/utils/styles';
import CText from '~/components/CText';

class WebviewPaymentScreen extends Component {
  constructor(props, context) {
    super(props, context);
    const {route} = props;
    this.state = {
      loading: true,
      uri: route?.params?.uri ?? '',
    };
  }

  handleContinue = () => {
    const {navigation} = this.props;
    navigation.pop();
    navigation.navigate("RootTab");
  };

  handleResponse = request => {
    const {navigation} = this.props;
    const {url} = request;

    const parsed = queryString.parse(new URL(url).search);

    // Cancel order
    if (parsed.cancel_order) {
      navigation.goBack();
    }
  };

  render() {
    const {loading, uri} = this.state;
    return (
      <Container style={cStyles.container}>
        <WebView
          source={{uri}}
          onNavigationStateChange={data => this.handleResponse(data)}
          style={styles.webView}
          onLoadStart={() => this.setState({loading: false})}
        />
        {loading && (
          <View style={styles.viewLoading}>
            <ActivityIndicator size="large" color={Colors.PRIMARY_COLOR} />
          </View>
        )}
        <Footer style={[cStyles.center, { backgroundColor: Colors.WHITE_COLOR, borderTopWidth: 0, paddingHorizontal: Devices.pH(layoutWidth.width) }]}>
          <Button block style={[cStyles.full_center, { backgroundColor: Colors.PRIMARY_COLOR }]}
            onPress={this.handleContinue} >
            <CText style={cStyles.txt_title_button} i18nKey={'continue'} />
          </Button>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  viewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  footer: {
    marginVertical: 16,
  },
});

WebviewPaymentScreen.propTypes = {};

export default WebviewPaymentScreen;
