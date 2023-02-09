/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';

import { View, ScrollView,  Text } from 'react-native';
import {Button} from 'native-base';
import CText from '~/components/CText';
import HTML from 'react-native-render-html';
import { Colors } from '~/utils/colors';
import { CRateStar } from '~/components/CRateStar';
import { cStyles } from '~/utils/styles';
import { useNavigation } from '@react-navigation/native';
import { Devices } from '~/config';
import CLoadingPlaceholder from '~/components/CLoadingPlaceholder';
export class OverviewDetail extends React.Component {
  constructor(props) {
    super(props);
    // this.redirectToProduct = this.redirectToProduct.bind(this);
  }

  /* LIFE CYCLE */
  // componentDidMount() {
    
  // }

  // componentWillUnmount() {
  // }
  componentDidUpdate(nextProps, nextState){
    // console.log('hit here');
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('-----shouldComponentUpdate--------');
    return true;
    // if ( nextProps.snap_selected || this.props.snap_selected  && ( this.props.snap_selected != nextProps.snap_selected )) {
    //   console.log('----------shouldComponentUpdatev hit-------');
    // }
    // return false;
  }
  redirectToProduct = (product) => {
    console.log('props establish');
    console.log(this.props.onFunction);
    // // const navigation = useNavigation();
    // this.props.navigation.push("ProductDetail", {
      //   product
      // });
      this.props.onFunction.onPressItem(product);
  }

  /* RENDER */
  render() {
    // console.log('hello');
    // console.log(this.props.snap_selected);
    return (
      <>
      {this.props.snap_selected ?
      <ScrollView style={[{flex:1, backgroundColor: '#18504D'}, cStyles.p_15, cStyles.br_tr_15,cStyles.br_tl_15]}>
        <View key={'asdads'}>
          <Text style={[cStyles.txt_title_header,{color:Colors.WHITE_COLOR}]}>{ this.props.snap_selected && this.props.snap_selected.name ? this.props.snap_selected.name : 'Title'}</Text>
          <CRateStar containerStyleStar={{marginBottom:10, marginTop:5}} fullStarColor={Colors.YELLOW_COLOR} emptyStarColor={Colors.YELLOW_COLOR} averageRating={5} />
          <View style={[cStyles.row_justify_between]}>
            <Text style={[cStyles.txt_title_header,cStyles.row_justify_between,{color:Colors.WHITE_COLOR, marginBottom:10, marginTop:0}]}>About The Book</Text>
            <Button  small bordered
              style={[{ backgroundColor: Colors.TRANSPARENT, padding: 5, borderColor: Colors.BLACK_COLOR, borderRadius: 5, borderWidth:4 }]}
              // onPress={() => this.props.onFunction.onPressServiceItem("ProductDetail", this.props.snap_selected)}
              onPress={() => this.redirectToProduct(this.props.snap_selected)} 
              >
              <CText style={[{ color: Colors.BLACK_COLOR }]} i18nKey={'view_product'} />
            </Button>
          </View>
          {/* <Text style={{color:'#fff', fontSize:Devices.fS(16)}}>
            { (this.props.snap_selected && this.props.snap_selected.description) ? this.props.snap_selected.description: '' }
          </Text> */}
            <HTML
                                    html={ (this.props.snap_selected && this.props.snap_selected.description) ? this.props.snap_selected.description: '' }
                                    tagsStyles={{
                                        p: {
                                            color: '#fff',
                                            fontFamily: cStyles.txt_body_meta_item.fontFamily,
                                            fontSize: Devices.fS(14),
                                           
                                        }
                                    }}
                                />
        
        </View>
      </ScrollView>
        :
        <CLoadingPlaceholder/>
      }
      </>                               
    )
  }

}


export default OverviewDetail;
