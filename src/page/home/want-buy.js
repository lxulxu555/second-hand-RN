import React, {Component} from 'react'
import {
    View,
    ScrollView,
    RefreshControl,
} from 'react-native'
import {Icon, Toast} from "@ant-design/react-native";
import {reqGetWantBuy} from '../../api'
import ActionButton from "react-native-action-button";
import HeaderSearch from '../../utils/HeaderSearch'
import {ChangePage, Foot,WantBuyList} from "../../utils/ChangePage";
import {connect} from 'react-redux'

let that

let page = 1;//当前第几页
let totalPage = 0;//总的页数

class WantBuy extends Component {

    static navigationOptions = (props) => {
        return {
            header: <HeaderSearch
                SubmitSearch={(event) => that.WantBuySearch(event)}
                ChangeText = {(text) => that.setState({search : text})}
                props = {props}
            />
        }
    };

    constructor(props) {
        super(props);
        that = this;
        this.state = ({
            search: '',
            AllWantBuy: [],
            isRefreshing: false,
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isLoading: true,
            isTop: false,
            waiting: false,//防止多次重复点击,
        })
    }


    getWantBuy = async (page) => {
        const token  = this.props.User.token
        if(!token){
            Toast.fail('请先登录',1)
        }
        const condition = {}
        condition.token = token
        condition.buyName = this.state.search
        condition.page = page
        condition.rows = 10
        const result = await reqGetWantBuy(condition)
        const data = ChangePage.getData(page, totalPage, result)
        totalPage = data.totalPage
        this.setState({
            //复制数据源
            AllWantBuy: [...this.state.AllWantBuy, ...data.NewData],
            isLoading: false,
            showFoot: data.foot,
            isRefreshing: false,
        });
    }



    _onRefresh = () => {
        this.setState({isRefreshing: true});
        setTimeout(() => {
            this.setState({isRefreshing: false, AllWantBuy: []});
            page = 1;//当前第几页
            totalPage = 0;//总的页数
            this.getWantBuy()
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
            this.getWantBuy(page)
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

    WantBuySearch = (search) => {
        this.setState({
            AllWantBuy: [],
        }, () => {
            page = 1;//当前第几页
            totalPage = 0;//总的页数
            this.getWantBuy(page)
        })
    }

    componentDidMount() {
        this.getWantBuy(page)
        page = 1;//当前第几页
        totalPage = 0;//总的页数
    }

    render() {
        return (
            <View style={{flex: 1}}>
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

                    <WantBuyList
                        AllWantBuy = {this.state.AllWantBuy}
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
    User: state.receiveUserData.User
})

export default connect(
    mapStateToProps
)(WantBuy)
