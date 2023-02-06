/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
/** COMPONENTS */
import CLoading from '~/components/CLoading';
/* STYLES */
import styles from './style';
/** COMMON */
import { Keys } from '~/config';
import { cStyles } from '~/utils/styles';

class CVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _isYoutube: false,
      _urlYoutubeConvert: ''
    }
  }

  /** LIFE CYCLE */
  componentDidMount() {
    let { type, source } = this.props;
    if (type === Keys.KEY_POST_VIDEO_YOUTUBE) {
      let str = 'https://www.youtube.com/embed/';
      let { _isYoutube } = this.state;
      if (source.indexOf("youtube") > -1 || source.indexOf("youtu.be") > -1) {
        if (source.indexOf("watch") > -1) {
          let idVideo = source.split("=").pop();
          str = 'https://www.youtube.com/embed/' + idVideo;
        } else if (source.indexOf("youtu.be") > -1) {
          let idVideo = source.split("youtu.be/").pop();
          str = 'https://www.youtube.com/embed/' + idVideo;
        } else {
          str = source;
        }
        _isYoutube = true;
      } else if (source.indexOf("vimeo") > -1) {
        let idVideo = source.split("/").pop();
        str = idVideo;
        _isYoutube = false;
      }
      this.setState({
        _isYoutube,
        _urlYoutubeConvert: str,
        _loading: false
      })
    }
  }

  /* RENDER */
  render() {
    let { _loading, _urlYoutubeConvert } = this.state;

    return (
      <View style={cStyles.flex_full}>
        {!_loading &&
          <WebView
            source={{ uri: _urlYoutubeConvert }}
            style={styles.con_video}
          />
        }

        <CLoading visible={_loading} />
      </View>
    )
  }

}

export default CVideo;