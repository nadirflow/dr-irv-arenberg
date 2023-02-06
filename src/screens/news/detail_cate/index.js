/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, FlatList } from 'react-native';
/* COMPONENTS */
import { ViewNewsCategories } from './render';
import CLoading from '~/components/CLoading';
import Horizontal from '~/components/CLayout/Horizontal';
import CText from '~/components/CText';
import { BallIndicator } from "~/components/CIndicator";
/* COMMON */
import Services from '~/services';
import { Keys, Devices, Configs } from '~/config';
import { layoutWidth } from '~/utils/layout_width';
import { cStyles } from '~/utils/styles';
import { Colors } from '~/utils/colors';
/** STYLE */
import styles from './style';

class NewsCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _loadForList: true,
      _refreshing: false,
      _loadmore: true,
      _categoryId: props.route.params.id,
      _category: props.route.params.dataFull,
      index: 0,
      routes: [
        {
          index: 0,
          name: 'All',
          key: 'home',
          page: 1,
          post: []
        }
      ]
    }
    this._limit = 10;
  }

  /* FUNCTIONS */
  _onFetchData = async () => {
    let { setting } = this.props;
    let { routes } = this.state;
    if (setting.app && setting.app.blog.blog_categories_content_type === "sub_categories") {
      let paramsSubCategories = {
        parent: this.state._categoryId
      }

      let res = await Services.News.getSubCate(paramsSubCategories);
      if (res && !res.code && res.length > 0) {
        for (let std of res) {
          std.page = 1;
          std.post = [];
          let checkSub = await Services.News.getSubCate({ parent: std.id });
          if (checkSub && checkSub.length > 0) {
            std.isParent = true;
          }
        }
      }
      routes = [...routes, ...res]
    }


    let params = {
      page: 1,
      categories: this.state._categoryId,
      per_page: this._limit
    };
    this.setState({
      routes,
    }, () => this._getNewsByCategories(params, Keys.REFRESH))

  }

  _getNewsByCategories = async (params, TYPE) => {
    let { routes, index } = this.state;
    let loadmore = true;

    let res = await Services.News.list(params);
    if (res && !res.code && res.length > 0) {
      if (res.length < this._limit) {
        loadmore = false;
      }
      if (TYPE === Keys.REFRESH) {
        routes[index].post = [...res];
      } else if (TYPE == Keys.LOAD_MORE) {
        routes[index].post = [...routes[index].post, ...res];
      }
      routes[index].page += 1;
    } else {
      loadmore = false;
    }

    this.setState({
      routes,
      _refreshing: false,
      _loadForList: false,
      _loadmore: loadmore,
      _loading: false,
    });
  }

  _onRefresh = () => {
    let { routes, index, _categoryId } = this.state;
    routes[index].page = 1;
    let params = {
      page: routes[index].page,
      categories: routes[index].id ? routes[index].id : _categoryId,
      per_page: this._limit,
    };
    this.setState({ _refreshing: true, _loadmore: true }, () => {
      this._getNewsByCategories(params, Keys.REFRESH);
    });
  }

  _onLoadMore = () => {
    let { routes, index, _categoryId } = this.state;
    if (this.state._loadmore) {
      let params = {
        page: routes[index].page,
        categories: routes[index].id ? routes[index].id : _categoryId,
        per_page: this._limit,
      };
      this._getNewsByCategories(params, Keys.LOAD_MORE);
    }
  }

  _renderEmpty = () => {
    return (
      <View style={cStyles.full_center}>
        <CText style={cStyles.txt_no_data} i18nKey={'no_data'} />
      </View>
    )
  }

  _onRenderScene = ({ route, jumpTo }) => {
    return (
      <>
        {(!this.state._loadForList &&
          route.post.length > 0) ?
          <Horizontal
            contentStyle={[styles.con_content_news, { paddingHorizontal: Devices.pH(layoutWidth.width) }]}
            data={route.post}
            render={{
              header: null,
              footer: this.state._loadmore ?
                <View style={styles.con_footer_loading}>
                  <BallIndicator color={Colors.PRIMARY_COLOR} />
                </View> :
                null,
              empty: this._renderEmpty
            }}
            onFunction={{
              onPressItem: this._onPressItem
            }}
            paging={{
              onRefresh: this._onRefresh,
              onLoadMore: this._onLoadMore
            }}
            isNews
            leftThumb
            showBookmark
          />
          : (<View style={cStyles.full_center}>
            <CText style={cStyles.txt_no_data} i18nKey={'no_data'} />
          </View>)
        }

        <CLoading visible={this.state._loadForList} />
      </>
    )
  }

  _onRenderTabbar = (propsTab) => {
    return (
      <View style={{ paddingHorizontal: Devices.pH(layoutWidth.width) }}>
        <FlatList
          data={propsTab.navigationState.routes}
          renderItem={props => {
            return (
              <TouchableOpacity
                style={[styles.con_tabbar_item,
                props.index === this.state.index && [styles.con_tabbar_active_item,
                { borderBottomColor: '#18504D' }],
                props.index === propsTab.navigationState.routes.length - 1 && styles.con_tabbar_last_item
                ]}
                onPress={() => { props.item.isParent ? this._onPressSubCate(props.item) : this._onPressTabbar(props.item, props.index) }}>
                <CText style={[styles.txt_tabbar,
                this.state.index === props.index && [cStyles.txt_title_group, { color: '#18504D' }]]}>
                  {Configs.html5Entities.decode(props.item.name)}
                </CText>
              </TouchableOpacity>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
          inverted={Configs.supportRTL}
          horizontal
          removeClippedSubviews={Devices.OS === "android"}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  _onChangeTabIndex = (index) => {
    this.setState({ index });
  }

  _onPressTabbar = (route, index) => {
    if (route.post.length === 0) {
      let params = {
        page: route.page,
        categories: route.id ? route.id : this.state._categoryId,
        per_page: this._limit
      };
      this.setState({ index, _loadmore: true },
        () => this._getNewsByCategories(params, Keys.REFRESH)
      );
    } else {
      this.setState({ index, _loadmore: !(route.post.length < this._limit) })
    }

  }

  _onPressCart = () => {
    this.props.navigation.navigate("Cart");
  }

  _onPressBack = () => {
    this.props.navigation.goBack();
  }

  _onPressSubCate = (data) => {
    this.props.navigation.push("NewsCategories", {
      name: data.name,
      id: data.id
    })
  }

  _onPressItem = (item) => {
    this.props.navigation.navigate('NewsDetail', {
      data: item,
      category: this.state._category
    })
  }

  /* LIFE CYCLE */
  componentDidMount() {
    this._onFetchData();
  }

  /* RENDER */
  render() {
    return (
      <ViewNewsCategories
        state={this.state}
        props={this.props}
        onFunction={{
          onPressBack: this._onPressBack,
          onPressCart: this._onPressCart,
          onPressSubCate: this._onPressSubCate,
          onRefresh: this._onRefresh,
          onLoadMore: this._onLoadMore,
          onPressItem: this._onPressItem,
          onRenderScene: this._onRenderScene,
          onRenderTabbar: this._onRenderTabbar,
          onChangeTabIndex: this._onChangeTabIndex
        }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.carts,
    setting: state.setting
  }
}


export default connect(
  mapStateToProps,
  null
)(NewsCategories);
