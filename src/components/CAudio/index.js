/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import * as Progress from 'react-native-progress';
import SoundPlayer from 'react-native-sound-player';
/** COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import { Colors } from '~/utils/colors';
import { Devices } from '~/config';
import Helpers from '~/utils/helpers';
/* STYLES */
import styles from './style';

class CAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _isPlaying: false,
      _progress: 0,
      _total: 0
    }
    this._intervalAudio = null;
    this._onFinishedLoadingURLSubscription = null;
    this._onFinishedPlayingSubscription = null;
  }

  /** FUNCTIONS */
  _onPressPlayPause = () => {
    if (!this.state._isPlaying) {
      SoundPlayer.play();
      this._intervalAudio = setInterval(() => {
        this.setState({ _progress: Number(this.state._progress) + 1 });
      }, 1000);
      this.setState({ _isPlaying: true });
    } else {
      this.setState({ _isPlaying: false });
      clearInterval(this._intervalAudio);
      SoundPlayer.pause();
    }
  }

  /** LIFE CYCLES */
  async componentDidMount() {
    this._onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', async ({ success }) => {
      if (success) {
        try {
          const info = await SoundPlayer.getInfo();
          this.setState({
            _progress: Number(info.currentTime).toFixed(0),
            _total: Number(info.duration).toFixed(0),
            _loading: false
          })
        } catch (e) {
          console.log('There is no song playing', e)
        }
      }
    })
    this._onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
      this.setState({ _isPlaying: false });
      clearInterval(this._intervalAudio);
      SoundPlayer.stop();
    })
    let { source } = this.props;
    try {
      SoundPlayer.loadUrl(source);
    } catch (e) {
      console.log(`cannot play the sound file`, e)
    }
  }

  componentWillUnmount() {
    SoundPlayer.stop();
    this._onFinishedLoadingURLSubscription.remove();
    this._onFinishedPlayingSubscription.remove();
    if (this._intervalAudio) clearInterval(this._intervalAudio);
  }

  /* RENDER */
  render() {
    let { _loading, _isPlaying, _progress, _total } = this.state;
    let progressParse = Helpers.secondsToHms(_progress);
    let totalParse = Helpers.secondsToHms(_total);
    _progress = _progress / _total;

    return (
      <View style={styles.con_bg_audio}>
        {_loading ?
          <View style={styles.con_bg_play_pause}>
            <ActivityIndicator color={Colors.WHITE_COLOR} size={'small'} />
          </View>
          :
          <TouchableOpacity activeOpacity={.5} onPress={this._onPressPlayPause}>
            <View style={styles.con_bg_play_pause}>
              <Icon name={_isPlaying ? 'pause-circle' : 'play-circle'} color={Colors.WHITE_COLOR} size={30} type={'regular'} />
            </View>
          </TouchableOpacity>
        }

        <View style={styles.con_progress}>
          <CText style={styles.txt_progress}>{progressParse.m + ":" + progressParse.s}</CText>
          <Progress.Bar width={Devices.sW('50%')} height={5}
            borderRadius={5}
            useNativeDriver={true}
            color={Colors.PRIMARY_COLOR}
            unfilledColor={Colors.BORDER_COLOR}
            progress={_progress}
            indeterminate={_loading}
          />
          <CText style={styles.txt_progress}>{totalParse.m + ":" + totalParse.s}</CText>
        </View>
      </View>
    )
  }

}

export default CAudio;