/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
/* COMPONENTS */
import { ViewRefine } from './render';

class Refine extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      _sortSelected: props.route.params.sortId || "latest",
      _arrAccordionSort: [
        { id: "total_sales", title: "sort_by_popularity" },
        { id: "average_rating", title: "sort_byt_average_rating" },
        { id: "latest", title: "latest" },
        { id: "incPrice", title: "sort_by_increase_price" },
        { id: "desPrice", title: "sort_by_decrease_price" },
      ]
    }
  }

  /**FUNCTION */
  _onPressItem = (id) => {
    this.setState({
      _sortSelected: id
    });
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
    this.props.route.params.onBack(this.state._sortSelected);
  }

  /** RENDER */
  render() {
    return (
      <ViewRefine
        state={this.state}
        onFunction={{
          onPressItem: this._onPressItem,
          onPressBack: this._onPressBack
        }}
      />
    )
  }

}

export default Refine;