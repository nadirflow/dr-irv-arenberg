import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {connect} from 'react-redux';
import { Devices, Keys } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
import { Button, Container, Footer } from 'native-base';
import * as cartActions from '~/redux/actions/cart';
import Helpers from '~/utils/helpers';
import { bindActionCreators } from 'redux';
import CText from '~/components/CText';

class WebviewThankYouScreen extends Component {
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
    //Clear data cart
    this.props.cartActions.removeAllCart();
    //Clear async storage
    Helpers.removeMultiKeyStorage([Keys.AS_DATA_CART, Keys.AS_DATA_CART_KEY]);
    navigation.pop();
    navigation.navigate("RootTab");
  };

  handleResponse = data => {
    console.log(data);
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

WebviewThankYouScreen.propTypes = {};

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {
    cartActions: bindActionCreators(cartActions, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WebviewThankYouScreen);
