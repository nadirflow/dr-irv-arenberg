/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import HTML from 'react-native-render-html';
/* COMPONENTS */
import CHeader from "~/components/CHeader";
import CLoading from '~/components/CLoading';
/* COMMON */
import { Languages, Configs } from '~/config';
import { cStyles } from '~/utils/styles';
import Helpers from '~/utils/helpers';
import Services from '~/services';
import styles from "./style";

class Policy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _page: null
    }
    this._pageID = props.route.params.id;
  }

  /* FUNCTIONS */
  _fetchDataPage = async () => {
    let res = await Services.Page.get({ id: this._pageID });
    let textError = Languages[this.props.language].server_error;
    if (res) {
      if (res.code) {
        Helpers.showToastDuration({}, textError, "danger");
      } else {
        this.setState({
          _page: res,
          _loading: false
        })
      }
    } else {
      Helpers.showToastDuration({}, textError, "danger");
    }
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  /** LIFE CYCLE */
  componentDidMount() {
    this._fetchDataPage();
  }

  /* RENDER */
  render() {
    let { _loading, _page } = this.state;
    let titleScreen = this.props.route.params.type === "policy" ?
      "privacy_policy" :
      "terms_condition";
    let iconLeft = Configs.supportRTL ?
      "angle-right" :
      "angle-left";

    return (
      <Container>
        <CHeader
        style={{backgroundColor: '#18504D'}}
          title={titleScreen}
          iconLeft_1={iconLeft}
          iconRight_1={"none"}
          onPressLeft_1={this._onPressBack}
        />

        {!_loading &&
          <Content>
            <HTML
              containerStyle={[Configs.supportRTL && cStyles.column_align_end]}
              html={_page.content.rendered}
              tagsStyles={{
                p: [styles.txt_content, Configs.supportRTL && cStyles.txt_RTL],
                h2: [styles.txt_h2, Configs.supportRTL && cStyles.txt_RTL],
                h3: [styles.txt_content, Configs.supportRTL && cStyles.txt_RTL]
              }}
            />
          </Content>
        }

        <CLoading visible={_loading} />
      </Container >
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.language.language
  }
}

export default connect(mapStateToProps, null)(Policy);