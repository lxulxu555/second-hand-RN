import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import React from 'react';
import {Icon, WhiteSpace, WingBlank, Card} from '@ant-design/react-native';

var {width, height} = Dimensions.get('window');

export class ChangePage {
  static getData(page, totalPage, result) {
    totalPage = result.pages;
    let data = result.data;
    let NewData = [];
    data.map(function(item, index) {
      NewData.push({
        key: index,
        value: item,
      });
    });
    let foot = 0;
    if (page >= totalPage) {
      foot = 1; //listView底部显示没有更多数据了
    }
    return {
      NewData,
      foot,
      totalPage,
    };
  }

  static contentViewScroll(e) {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    if (offsetY + oriageScrollHeight >= contentSizeHeight - 20) {
      return true;
    }
  }
}

export class Foot extends React.Component {
  _renderFooter() {
    const foot = this.props.showfooter;
    if (foot === 1) {
      return (
        <View
          style={{
            height: 30,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Text
            style={{
              color: '#999999',
              fontSize: 14,
              marginTop: 5,
              marginBottom: 5,
            }}>
            没有更多数据了
          </Text>
        </View>
      );
    } else if (foot === 2) {
      return (
        <View style={style.footer}>
          <ActivityIndicator />
          <Text>正在加载更多数据...</Text>
        </View>
      );
    } else if (foot === 0) {
      return (
        <View style={style.footer}>
          <Text />
        </View>
      );
    }
  }

  render() {
    return <View>{this._renderFooter()}</View>;
  }
}

export class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: false,
    };
  }

  ProductList = () => {
    const {AllProduct} = this.props;
    return AllProduct.map((item, index) => {
      const images = item?.value?.images?.split(',')[0];
      return (
        <TouchableNativeFeedback
          disabled={this.state.waiting}
          onPress={() => this._PressList(item)}
          key={item.value.id}>
          <View
            style={{
              width: '47%',
              marginTop: 10,
              borderRadius: 8,
              marginLeft: 7,
              backgroundColor: '#FFFFFF',
            }}>
            <Image
              source={{uri: images}}
              style={{width: '100%', height: 200, borderRadius: 8}}
            />
            <View>
              <Text style={{marginLeft: 10, fontWeight: 'bold', marginTop: 8}}>
                {item.value.name}
              </Text>
              {
                  item.type == "1" &&
                  <Text
                  style={{
                    color: 'red',
                    marginLeft: 10,
                    fontSize: 20,
                    marginTop: 5,
                  }}>
                  <Text style={{fontSize: 12}}>￥</Text>
                  {item.value.price1}
                </Text>
              }
            </View>
            {this.props.type === 'MyUser' ? (
              <View />
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 10,
                  marginBottom: 5,
                  marginLeft: 8,
                }}>
                <Image
                  source={{uri: item.value.user.img}}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                />
                <Text>{item.value.user.nickname}</Text>
              </View>
            )}
          </View>
        </TouchableNativeFeedback>
      );
    });
  };

  _PressList = product => {
    this.props.props.navigation.push('ProductDetail', {
      ProductId: product.value.id,
    });
    this.setState({waiting: true});
    setTimeout(() => {
      this.setState({waiting: false});
    }, 1000);
  };

  render() {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {this.props.AllProduct.length !== 0 ? (
          this.ProductList()
        ) : (
          <Image
            source={{uri: 'https://www.youzixy.com/img/noGoods.cc45e087.png'}}
            style={{width: width, height: (498 * width) / 750, marginTop: 80}}
          />
        )}
      </View>
    );
  }
}

export class WantBuyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: false,
    };
  }

  UpdateWantBuy = item => {
    this.props.props.navigation.push('SendWantBuy', {
      WantBuyDetail: item.value,
      User: this.props.User,
      type: 'MyUser',
    });
    this.setState({waiting: true});
    setTimeout(() => {
      this.setState({waiting: false});
    }, 1000);
  };

  WantBuyList = () => {
    const data = this.props?.AllWantBuy;
    return (
      data &&
      data.map((item, index) => {
        const images = item.value?.images?.split(',');
        return (
          <View key={item.value.id}>
            <WingBlank size="lg">
              <WhiteSpace size="lg" />
              <Card>
                <TouchableNativeFeedback
                  disabled={this.state.waiting}
                  onPress={() =>
                    this.props.type === 'MyUser' ? this.UpdateWantBuy(item) : ''
                  }>
                  <Card.Header
                    title={item.value.title}
                    thumbStyle={{width: 40, height: 40, borderRadius: 4}}
                    thumb={item.value.user.img}
                    extra={
                      <View style={{alignItems: 'flex-end'}}>
                        <Text style={{color: 'red'}}>
                          <Text style={{fontSize: 15}}>￥</Text>
                          <Text style={{fontSize: 18}}>
                            {item.value.minPrice + '~~' + item.value.maxPrice}
                          </Text>
                        </Text>
                      </View>
                    }
                  />
                </TouchableNativeFeedback>
                <Card.Body style={{flexDirection: 'column'}}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {images &&
                      images.map((item, index) => {
                        return (
                          <Image
                            source={{uri: item}}
                            key={index}
                            style={{
                              width: 150,
                              height: 150,
                              marginLeft: 10,
                              marginRight: 5,
                            }}
                          />
                        );
                      })}
                  </ScrollView>
                  <Text style={{marginLeft: 10, marginTop: 10}}>
                    {item.value.intro}
                  </Text>
                </Card.Body>
                <Card.Footer
                  style={{marginTop: 10, aligenItems: 'flex-start'}}
                  content={
                    <View style={{flexDirection: 'row'}}>
                      <Icon name="wechat" color="#36B7AB" />
                      <Text style={{marginLeft: 10}}>{item.value.weixin}</Text>
                    </View>
                  }
                />
              </Card>
            </WingBlank>
          </View>
        );
      })
    );
  };

  render() {
    return (
      <View>
        {this.props.AllWantBuy.length !== 0 ? (
          this.WantBuyList()
        ) : (
          <Image
            source={{uri: 'https://www.youzixy.com/img/noGoods.cc45e087.png'}}
            style={{width: width, height: (498 * width) / 750, marginTop: 80}}
          />
        )}
      </View>
    );
  }
}

export class JobList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        waiting: false,
      };
    }
  
    JobList = () => {
      const {JobList} = this.props;
      return JobList.map((item, index) => {
        const images = item?.value?.images?.split(',')[0];
        return (
          <TouchableNativeFeedback
            disabled={this.state.waiting}
            onPress={() => this._PressList(item)}
            key={item.value.id}>
            <View
              style={{
                width: '47%',
                marginTop: 10,
                borderRadius: 8,
                marginLeft: 7,
                backgroundColor: '#FFFFFF',
              }}>
              <Image
                source={{uri: images}}
                style={{width: '100%', height: 200, borderRadius: 8}}
              />
              <View>
                <Text style={{marginLeft: 10, fontWeight: 'bold', marginTop: 8}}>
                  {item.value.name}
                </Text>
              </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 10,
                    marginBottom: 5,
                    marginLeft: 8,
                  }}>
                  <Image
                    source={{uri: item.value.user.img}}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                      marginRight: 10,
                    }}
                  />
                  <Text>{item.value.user.username}</Text>
                </View>
            </View>
          </TouchableNativeFeedback>
        );
      });
    };
  
    _PressList = product => {
      this.props.props.navigation.push('JobDetail', {
        ProductId: product.value.id,
      });
      this.setState({waiting: true});
      setTimeout(() => {
        this.setState({waiting: false});
      }, 1000);
    };
  
    render() {
      return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {this.props.JobList.length !== 0 ? (
            this.JobList()
          ) : (
            <Image
              source={{uri: 'https://www.youzixy.com/img/noGoods.cc45e087.png'}}
              style={{width: width, height: (498 * width) / 750, marginTop: 80}}
            />
          )}
        </View>
      );
    }
  }


const style = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});
