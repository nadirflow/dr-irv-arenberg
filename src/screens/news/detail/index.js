/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { StatusBar, Animated, Platform, Share } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
/* COMPONENTS */
import { ViewNewsPostDetail } from './render';
/** COMMON */
import { Configs, Devices } from '~/config';
import Helpers from '~/utils/helpers';
import Services from '~/services';

class NewsPostDetail extends React.Component {
  constructor(props) {
    super(props);
    StatusBar.setBackgroundColor("#18504D", true);
    StatusBar.setBarStyle("dark-content", true)
    this.state = {
      _loading: true,
      _isAudio: false,
      _isVideo: false,
      _isGallery: false,
      _isInBookmark: false,
      _scrollY: new Animated.Value(0),
      _related: [],
      _audioUrl: '',
      _videoUrl: '',
      _gallery: []
    }
    this._dataPostDetail = props.route.params.data;
    this._category = props.route.params.category
    this._settings = props.setting;
  }

  /* FUNCTIONS */
  _onCheckFormatPost = () => {
    if (this._dataPostDetail.format === 'audio') {
      if (this._dataPostDetail.zs_meta_data && this._dataPostDetail.zs_meta_data.audio_url !== "") {
        this.setState({ _audioUrl: this._dataPostDetail.zs_meta_data.audio_url, _isAudio: true });
      }
    }
    if (this._dataPostDetail.format === 'video') {
      if (this._dataPostDetail.zs_meta_data && this._dataPostDetail.zs_meta_data.video_url !== "") {
        this.setState({ _videoUrl: this._dataPostDetail.zs_meta_data.video_url, _isVideo: true });
      }
    }
    if (this._dataPostDetail.format === 'gallery') {
      if (this._dataPostDetail.zs_meta_data && this._dataPostDetail.zs_meta_data.gallery.length > 0) {
        this.setState({ _gallery: this._dataPostDetail.zs_meta_data.gallery, _isGallery: true });
      }
    }
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _parseString = async (_related) => {
    let { _isInBookmark } = this.state;
    /** Check in bookmark */
    _isInBookmark = Configs.bookmarks.includes(this._dataPostDetail.id);

    this.setState({
      _related,
      _isInBookmark,
      _loading: false
    })
  }

  _onFetchRelated = async () => {
    let { _related } = this.state;
    let params = {
      id: this._dataPostDetail.id
    };
    let res = await Services.News.getRelated(params);
    if (res) {
      _related = res
    }
    this._parseString(_related);
  }

  _onPressItem = (item) => {
    this.props.navigation.push("NewsDetail", {
      data: item
    })
  }

  _onPressBookmark = async () => {
    await Helpers.addOrRemoveBookmark(this._dataPostDetail.id);
    this.setState({ _isInBookmark: !this.state._isInBookmark });
  }

  _onPressShare = async (title) => {
    try {
      const result = await Share.share({
        message: title + " with " + this._dataPostDetail.link
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  /** LIFE CYCLE */
  componentDidMount() {
    this._onCheckFormatPost();
    this._onFetchRelated(); 
  }

  /* RENDER */
  render() {
    return (
      <ViewNewsPostDetail
        data={this._dataPostDetail}
        category={this._category}
        state={this.state}
        settings={{ 
          blog: this._settings.app.blog
        }}
        onFunction={{
          onPressBack: this._onPressBack,
          onPressItem: this._onPressItem,
          onPressBookmark: this._onPressBookmark,
          onPressShare: this._onPressShare
        }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    setting: state.setting
  }
}

export default connect(
  mapStateToProps,
  null
)(NewsPostDetail);