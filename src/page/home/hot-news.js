import React, {Component} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';
import {EasyLoading, Loading} from '../../utils/Loading';
import {reqConditionFindProduct} from '../../api/index';
import {SearchBar} from '@ant-design/react-native';
import {ChangePage, Foot, BackTop, ProductList} from '../../utils/ChangePage';

let page = 1; //当前第几页
let totalPage = 0; //总的页数

export default class HotNews extends Component {
  state = {
    isTop: false,
    searchName: '',
    AllProduct: [],
    isRefreshing: false,
    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
    isLoading: true,
  };

  getAllProduct = async page => {
    EasyLoading.show();
    const condition = {};
    condition.page = page;
    condition.rows = 5;
    condition.orderBy = 'create_time desc';
    condition.goodsName = this.state.searchName;
    condition.type = 2;
    const result = await reqConditionFindProduct(condition);
    EasyLoading.dismiss();
    const data = ChangePage.getData(page, totalPage, result);
    totalPage = data.totalPage;
    this.setState({
      //复制数据源
      AllProduct: [...this.state.AllProduct, ...data.NewData],
      isLoading: false,
      showFoot: data.foot,
      isRefreshing: false,
    });
  };

  _contentViewScroll = e => {
    const data = ChangePage.contentViewScroll(e);
    if (data === true) {
      //如果是正在加载中或没有更多数据了，则返回
      if (this.state.showFoot !== 0) {
        return;
      }
      //如果当前页大于或等于总页数，那就是到最后一页了，返回
      if (page !== 1 && page >= totalPage) {
        return;
      } else {
        page++;
      }
      //底部显示正在加载更多数据
      this.setState({showFoot: 2});
      this.getAllProduct(page);
    }
  };

  _onRefresh = () => {
    this.search.state.value = '';
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState(
        {
          isRefreshing: false,
          AllProduct: [],
          searchName: '',
        },
        () => {
          page = 1; //当前第几页
          totalPage = 0; //总的页数
          this.getAllProduct(page);
        },
      );
    }, 1500);
  };

  _getBackTop = e => {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    if (offsetY > 720) {
      this.setState({
        isTop: true,
      });
    } else {
      this.setState({
        isTop: false,
      });
    }
  };

  SubmitSearch = async () => {
    this.setState(
      {
        AllProduct: [],
      },
      () => {
        this.getAllProduct(1);
      },
    );
  };

  componentDidMount() {
    this.getAllProduct(page);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Loading />
        <SearchBar
          value={this.state.searchName}
          ref={search => (this.search = search)}
          placeholder="输入关键字"
          onChange={value =>
            this.setState({
              searchName: value,
            })
          }
          onSubmit={() => this.SubmitSearch()}
          onCancel={() => {
            this.setState({
              searchName: '',
            });
          }}
        />
        <ScrollView
          onMomentumScrollEnd={this._contentViewScroll} // 获取滑动数据
          onScroll={this._getBackTop}
          style={{flex: 1}}
          ref={r => (this.scrollview = r)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              colors={['#ff0000', '#00ff00', '#0000ff']} // 刷新指示器在刷新期间的过渡颜色(Android)
              progressBackgroundColor="#ffffff" // 指定刷新指示器的背景色(Android)
            />
          }>
          <ProductList AllProduct={this.state.AllProduct} props={this.props} />
          <Foot showfooter={this.state.showFoot} />
        </ScrollView>
      </View>
    );
  }
}
