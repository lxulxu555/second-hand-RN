import React, {Component} from 'react'
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    Image,
    TouchableOpacity,
} from 'react-native'

import {
    Card,
    Icon,
    WingBlank,
    WhiteSpace,Toast
} from '@ant-design/react-native'

import {reqCollectList, reqLikeProduct} from '../../api'
import ActionButton from "react-native-action-button";
import {ChangePage, Foot} from "../../utils/ChangePage";
import {connect} from 'react-redux'

let page = 1;//当前第几页
let totalPage = 0;//总的页数


class MyCollect extends Component {

    state = {
        CollectList: [],
        isLoading: true,
        showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        isRefreshing: false,
        isTop: false,
    }

    getCollect = async (page) => {
        const token = this.props.User.token
        const id = this.props.User.user.id
        const result = await reqCollectList(token, id, page, 10)
        const data = ChangePage.getData(page, totalPage, result)
        totalPage = data.totalPage
        this.setState({
            //复制数据源
            CollectList: [...this.state.CollectList, ...data.NewData],
            isLoading: false,
            showFoot: data.foot,
            isRefreshing: false,
        });
    }

    Heart = async (item, index) => {
        const CollectList = this.state.CollectList
        const userId = this.props.User.user.id
        const Token = this.props.User.token
        const goodsId = item.id
        const result = await reqLikeProduct(userId, goodsId, Token)
        if(result.code === 0){
            if (item.code === false) {
                this.heart[index].setNativeProps({
                    style: {
                        tintColor: 'red'
                    }
                });
                item.code = true
                this.setState({
                    CollectList: CollectList.map((item, idx) => idx === index ? {...item, code: true} : item)
                })
            } else {
                this.heart[index].setNativeProps({
                    style: {
                        tintColor: 'black'
                    }
                })
                item.code = false
                this.setState({
                    CollectList: CollectList.map((item, idx) => idx === index ? {...item, code: false} : item)
                })
            }
        } else {
            Toast.fail(result.msg,1)
        }

    }

goDetail = (product) => {
    this.props.navigation.push('ProductDetail', {
        ProductId: product.value.goods.id,
        User: this.User
    })
}

CollectList = () => {
    const data = this.state.CollectList || []
    return data.map((item, index) => {
        const images = item.value.goods.images.split(',')
        return <View key={item.value.goods.id}>
            <WingBlank size="lg">
                <WhiteSpace size='lg'/>
                <Card>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => this.goDetail(item)}>
                        <Card.Header
                            title={item.value.goods.name}
                            thumbStyle={{width: 40, height: 40, borderRadius: 4}}
                            thumb={item.value.goods.user.img}
                            extra={
                                <View style={{alignItems: 'flex-end'}}>
                                    <Text style={{color: 'red'}}>
                                        <Text style={{fontSize: 15}}>￥</Text>
                                        <Text style={{fontSize: 18}}>{item.value.goods.price1}</Text>
                                    </Text>
                                </View>}
                        />
                    </TouchableOpacity>
                    <Card.Body style={{flexDirection: 'column'}} id={item.value.goods.id}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                images.map((item, index) => {
                                    return <Image source={{uri: item}}
                                                  key={index}
                                                  style={{
                                                      width: 150,
                                                      height: 150,
                                                      marginLeft: 10,
                                                      marginRight: 5
                                                  }}/>
                                })
                            }
                        </ScrollView>
                        <Text style={{marginLeft: 10, marginTop: 10}}>{item.value.goods.intro}</Text>
                    </Card.Body>
                    <Card.Footer
                        style={{marginTop: 10}}
                        extra={
                            <View style={{alignItems: 'flex-end'}}>
                                <TouchableOpacity
                                    style={{borderWidth: 0.7, flexDirection: 'row', alignItems: 'center'}}
                                    onPress={() =>
                                        this.Heart(item.value.goods, index)
                                    }
                                    key={index}
                                >
                                    <Image
                                        source={require('../../../android/app/src/main/res/drawable-hdpi/collect.png')}
                                        style={{tintColor: 'red', width: 25, height: 25, margin: 5}}
                                        ref={(heart) => this.heart = {...this.heart, [index]: heart}}
                                    />
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 13,
                                        marginRight: 5
                                    }}>{item.code === false ? '收藏' : '取消收藏'}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </Card>
            </WingBlank>
        </View>
    })
}


_onRefresh = () => {
    this.setState({isRefreshing: true});
    setTimeout(() => {
        this.setState({isRefreshing: false, CollectList: []});
        page = 1;//当前第几页
        totalPage = 0;//总的页数
        this.getCollect(page)
    }, 1500);
}


_contentViewScroll = (e) => {
    const data = ChangePage.contentViewScroll(e)
    if (data === true) {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot !== 0) {
            return;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if ((page !== 1) && (page >= totalPage)) {
            return;
        } else {
            page++
        }
        //底部显示正在加载更多数据
        this.setState({showFoot: 2})
        this.getCollect(page)
    }
}

_getBackTop = (e) => {
    let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    if (offsetY > 720) {
        this.setState({
            isTop: true
        })
    } else {
        this.setState({
            isTop: false
        })
    }
}

componentDidMount()
{
    this.getCollect(page)
    page = 1;//当前第几页
    totalPage = 0;//总的页数
}

render()
{
    return (
        <View style={{flex: 1}}>
            <ScrollView
                onMomentumScrollEnd={this._contentViewScroll} // 获取滑动数据
                onScroll={this._getBackTop}
                ref={(r) => this.scrollview = r}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        colors={['#ff0000', '#00ff00', '#0000ff']} // 刷新指示器在刷新期间的过渡颜色(Android)
                        progressBackgroundColor="#ffffff" // 指定刷新指示器的背景色(Android)
                    />
                }
            >
                <View>
                    {this.CollectList()}
                </View>
                <Foot showfooter={this.state.showFoot}/>
            </ScrollView>
            {
                this.state.isTop === true ? <ActionButton
                    renderIcon={() => (<Icon name='arrow-up' style={{color: '#1DA57A'}}/>)}
                    buttonColor="#FFFFFF"
                    position='right'
                    verticalOrientation='up'
                    size={34}
                    border='#1DA57A'
                    onPress={() => this.scrollview.scrollTo({x: 0, y: 0, animated: true})}
                /> : <View/>
            }
        </View>

    )
}
}


const mapStateToProps = state => ({
    User: state.receiveUserData.User
})

export default connect(
    mapStateToProps
)(MyCollect)
