/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
/* COMPONENTS */
import { ViewBookPayment } from './render';

class BookPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _dataPayment: props.data,
      _methodId: props.data[0].id
    }
  }

  /* FUNCTIONS */
  _onToggleMethod = method => {
    let { _methodId } = this.state;
    if (method.id !== _methodId) {
      this.setState({ _methodId: method.id })
    }
    this.props.onPressPayment(method);
  }

  /* RENDER */
  render() {
    return (
      <ViewBookPayment
        state={this.state}
        onFunction={{
          onToggleMethod: this._onToggleMethod,
        }}
      />
    )
  }

}

export default BookPayment;