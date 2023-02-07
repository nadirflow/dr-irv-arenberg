/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { View,
  StyleSheet,Dimensions } from 'react-native';
import { Container } from 'native-base';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import { Configs } from '~/config';
import Pdf from 'react-native-pdf';
import CText from '~/components/CText';
/* STYLES */


class ViewPdf extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fileAction(props.route.params.productId)
  }
  fileAction = async (productId) => {
    
    let fileUrl = Configs.hostApi+'/wp-json/wc/v3/products/'+productId+'?consumer_key='+Configs.cosumerKey+"&consumer_secret="+Configs.consumerSecret;
    let resp = await fetch(fileUrl);
    if (resp.ok) {
      let respJSON = await resp.json();
      this.setState({
        source: {
          uri: respJSON.downloads[0].file,
          cache: true,
          title: respJSON.downloads[0].name
        }
      });
    }
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }
  state = {
    source : null
  }

  render() {
    console.log(this.state.source);
    return (
      <Container>
        <CHeader
          style={{backgroundColor: '#18504D'}}
          customTitle="true"
          title={this.state.source ? this.state.source.title: "pdf_view"}
          iconLeft_1={Configs.supportRTL ? "angle-right" : "angle-left"}
          iconRight_1={"none"}
          onPressLeft_1={this._onPressBack}
        />
          
        <View style={ styles2.container } >
          {
            this.state.source &&
            <Pdf
            trustAllCerts={false}
            source={this.state.source}
            onLoadComplete={(numberOfPages,filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page,numberOfPages) => {
                console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
                console.log(error);
            }}
            onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
            }}
            style={styles2.pdf}/>
          }
          
        </View>
      </Container>
    )
  }
}
const styles2 = StyleSheet.create( {
  container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
  },
  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
  }
});

const mapStateToProps = state => {
  return {
    setting: state
  }
}

export default connect(mapStateToProps, null)(ViewPdf);