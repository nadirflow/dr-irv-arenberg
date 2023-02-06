/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
/* COMPONENTS */
import { ViewAppointmentDetail } from './render';

class AppointmentDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this._appointment = props.route.params.data;
  }

  /* FUNCTIONS */
  _onPressBack = () => {
    this.props.navigation.goBack();
  }
  /* FUNCTIONS */
  _onPressViewPdf = (productId) => {
    console.log('_onPressViewPdf');
    this.props.navigation.navigate("ViewPdf",{productId});
  }

  /* RENDER */
  render() {
    return (
      <ViewAppointmentDetail
        data={this._appointment}
        onFunction={{
          onPressBack: this._onPressBack,
          onPressViewPdf: this._onPressViewPdf
        }}
      />
    )
  }

}

export default AppointmentDetail;