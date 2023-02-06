/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import { ActionSheet } from 'native-base';
/* COMPONENTS */
import { ViewBookmark } from './render';
/** COMMON */
import Helpers from '~/utils/helpers';
import { Languages, Configs } from '~/config';
import Services from '~/services';
import { Colors } from '~/utils/colors';

var CANCEL_INDEX = 1;
var DESTRUCTIVE_INDEX = 0;

class Bookmark extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _news: []
    }
  }

  /* FUNCTIONS */
  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onPressItem = (data) => {
    this.props.navigation.navigate('NewsDetail', {
      data
    })
  }

  _onPressDeleteBookmark = (title, id) => {
    let { language } = this.props;
    Alert.alert(
      Languages[language].notification,
      Languages[language].txt_alert_delete_bm + ` "` + title + `"?`,
      [
        { text: Languages[language].cancel, onPress: () => null, style: 'cancel' },
        { text: Languages[language].ok, onPress: () => this._onDeleteItemBookmark(id), style: 'default' }
      ],
      { cancelable: true });
  }

  _onDeleteItemBookmark = async (id) => {
    let { _news } = this.state;
    let findIdx = _news.findIndex(f => f.id === id);
    if (findIdx !== -1) _news.splice(findIdx, 1);
    this.setState({ _news });
    Helpers.addOrRemoveBookmark(id);
  }

  _onPressDeleteAll = () => {
    let { language } = this.props;
    ActionSheet.show(
      {
        options: [
          { text: Languages[language].txt_alert_delete_all_bm, icon: "trash", iconColor: Colors.PRIMARY_COLOR },
          { text: Languages[language].cancel, icon: "close", iconColor: Colors.RED_COLOR }
        ],
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX
      },
      buttonIndex => {
        if (buttonIndex === DESTRUCTIVE_INDEX) {
          this._onDeleteAll();
        }
      }
    )
  }

  _onDeleteAll = () => {
    this.setState({ _news: [] });
    Helpers.removeAllBookmark();
  }

  _onPrepareData = async () => {
    let result = [];
    if (Configs.bookmarks && Configs.bookmarks.length > 0) {
      let params = {}, str = "";
      for (let id of Configs.bookmarks) str += id + ",";
      params.include = str;
      let res = await Services.News.list(params);

      if (res && res.length > 0) {
        Configs.bookmarks.forEach(function (key) {
          let found = false;
          res = res.filter(function (item) {
            if (!found && item.id === key) {
              result.push(item);
              found = true;
              return false;
            } else
              return true;
          })
        })
      }
    }
    this.setState({ _news: result.reverse(), _loading: false });
  }


  /* LIFE CYCLE */
  componentDidMount() {
    this._onPrepareData();
  }

  /* RENDER */
  render() {
    return (
      <ViewBookmark
        state={this.state}
        onFunctions={{
          onPressBack: this._onPressBack,
          onPressItem: this._onPressItem,
          onPressDeleteBookmark: this._onPressDeleteBookmark,
          onPressDeleteAll: this._onPressDeleteAll
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.language.language
  }
}

export default connect(mapStateToProps, null)(Bookmark);