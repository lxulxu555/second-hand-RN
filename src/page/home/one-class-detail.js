import React, {Component} from 'react'
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
     ScrollView, RefreshControl, StyleSheet, Dimensions
} from 'react-native'
import {Icon} from '@ant-design/react-native'

import {reqConditionFindProduct} from '../../api/index'
import ActionButton from "react-native-action-button";
import HeaderSearch from "../../utils/HeaderSearch";
import {ChangePage, Foot, ProductList} from "../../utils/ChangePage";
import {connect} from 'react-redux'

let page = 1;//当前第几页
let totalPage = 0;//总的页数
let that

class OneClassDetail extends Component {

    static navigationOptions = (props) => {
        return {
            header: <HeaderSearch
                SubmitSearch={(event) => that.SubmitSearch(event)}
                ChangeText = {(text) => that.setState({search : text})}
                props = {props}
            />
        }
    };

    constructor(props) {
        super(props);
        that = this;
        this.state = ({
            Timetype: 'create_time desc',
            Pricetype: 'price1 desc',
            AllProduct: [],
            isRefreshing: false,
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isLoading: true,
            isTop: false,
            waiting: false,//防止多次重复点击,
            search : ''
        })
    };

    SubmitSearch = (search) => {
        this.setState({
            AllProduct: [],
        }, () => {
            page = 1;//当前第几页
            totalPage = 0;//总的页数
            this.getProduct(page)
        })
    }

    getProduct = async (page) => {
        const condition = {}
        const type = this.props.navigation.getParam('type')
        condition.page = page
        condition.rows = 10
        condition.orderBy = this.state.Timetype === '' ? this.state.Pricetype : this.state.Timetype
        if(type === 'oneClass'){
            condition.classify1 = this.props.navigation.getParam('OneClassId')
        } else {
            condition.id = this.props.navigation.getParam('TwoClassId')
        }
        condition.goodsName = this.state.search
        const result = await reqConditionFindProduct(condition)
        const data = ChangePage.getData(page, totalPage, result)
        totalPage = data.totalPage
        this.setState({
            //复制数据源
            AllProduct: [...this.state.AllProduct, ...data.NewData],
            isLoading: false,
            showFoot: data.foot,
            isRefreshing: false,
        });
    }


    _onRefresh = () => {
        this.setState({isRefreshing: true,search:''});
        setTimeout(() => {
            this.setState({isRefreshing: false, AllProduct: []});
            page = 1;//当前第几页
            totalPage = 0;//总的页数
            this.getProduct()
        }, 1500);
    }


    _contentViewScroll = (e) => {
        const data = ChangePage.contentViewScroll(e)
        if(data === true){
            //如果是正在加载中或没有更多数据了，则返回
            if (this.state.showFoot !== 0) {
                return;
            }
            //如果当前页大于或等于总页数，那就是到最后一页了，返回
            if ((page !== 1) && (page >= totalPage)) {
                return;
            } else {
                page ++
            }
            //底部显示正在加载更多数据
            this.setState({showFoot:2})
            this.getProduct(page)
        }
    }

    TimeHeadtitle = () => {
        this.TimeheadTitle.setNativeProps({
            style: {
                color: '#36B7AB',
                fontWeight: 'bold'
            }
        })
        this.PriceheadTitle.setNativeProps({
            style: {
                color: 'black',
                fontWeight: ''
            }
        })
        this.setState({
            Timetype: this.state.Timetype === 'create_time desc' ? 'create_time' : 'create_time desc',
            Pricetype: ''
        }, () => {
            this.setState({AllProduct: []});
            page = 1;//当前第几页
            totalPage = 0;//总的页数
            this.getProduct(page)
        })
    }

    PriceHeadtitle = () => {
        this.PriceheadTitle.setNativeProps({
            style: {
                color: '#36B7AB',
                fontWeight: 'bold'
            }
        })
        this.TimeheadTitle.setNativeProps({
            style: {
                color: 'black',
                fontWeight: ''
            }
        })
        this.setState({
            Pricetype: this.state.Pricetype === 'price1 desc' ? 'price1' : 'price1 desc',
            Timetype: ''
        }, () => {
            this.setState({AllProduct: []});
            page = 1;//当前第几页
            totalPage = 0;//总的页数
            this.getProduct(page)
        })
    }


    componentWillMount() {
        this.getProduct(page)
        page = 1;//当前第几页
        totalPage = 0;//总的页数
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setTranslucent(false)
            this.TimeheadTitle.setNativeProps({
                style: {
                    color: '#36B7AB',
                    fontWeight: 'bold'
                }
            })
        })
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', backgroundColor: '#FFFFFF', height: 40, alignItems: 'center'}}>

                    <TouchableOpacity activeOpacity={0.6} style={{flex: 1, alignItems: 'center'}}
                                      onPress={() => this.TimeHeadtitle()}>
                        <View style={{flexDirection: 'row'}}>
                            <Text ref={(ref) => this.TimeheadTitle = ref}>时间</Text>
                            <Icon
                                name={this.state.Timetype === 'create_time desc' ? 'arrow-down' : 'arrow-up'}
                                size='sm'
                                style={{marginLeft: 10}}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} style={{flex: 1, alignItems: 'center'}}
                                      onPress={() => this.PriceHeadtitle()}>
                        <View style={{flexDirection: 'row'}}>
                            <Text ref={(ref) => this.PriceheadTitle = ref}>价格</Text>
                            <Icon
                                name={this.state.Pricetype === 'price1 desc' ? 'arrow-down' : 'arrow-up'}
                                size='sm'
                                style={{marginLeft: 10}}
                            />
                        </View>
                    </TouchableOpacity>

                </View>

                <ScrollView
                    onMomentumScrollEnd={this._contentViewScroll} // 获取滑动数据
                    onScroll={this._getBackTop}
                    style={{flex: 1}}
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
                    <ProductList
                        AllProduct={this.state.AllProduct}
                        props={this.props}
                    />
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
    User: state.receiveUserData
})

export default connect(
    mapStateToProps
)(OneClassDetail)
