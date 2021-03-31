import React, {Component} from 'react'
import {ScrollView} from 'react-native'
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
import {ChangePage, Foot, ProductList, WantBuyList,JobList} from "../../utils/ChangePage";
import {reqConditionFindProduct, reqGetWantBuy,reqConditionFindJob} from "../../api";
import {EasyLoading, Loading} from '../../utils/Loading';

let page = 1;//当前第几页
let totalPage = 0;//总的页数

export default class SliderUser extends Component {

    state = {
        UserProduct: [],
        AllWantBuy: [],
        UserHotNews: [],
        JobList:[],
        showFoot: 0,
        waiting: false,
        User: {}
    }

    UserProduct = async (page) => {
        EasyLoading.show('网速有点慢');
        const condition = {}
        condition.userid = this.state.User.user.id
        condition.page = page
        condition.rows = 10
        condition.type = 1
        const result = await reqConditionFindProduct(condition)
        const data = ChangePage.getData(page, totalPage, result)
        totalPage = data.totalPage
        this.setState({
            //复制数据源
            UserProduct: [...this.state.UserProduct, ...data.NewData],
            showFoot: data.foot,
        });
        EasyLoading.dismiss()
    }

    UserHotNews = async () => {
        EasyLoading.show('网速有点慢');
        const condition = {}
        condition.userid = this.state.User.user.id
        condition.type = 2 
        const result = await reqConditionFindProduct(condition)
        let NewData = []
        result.data.map(function (item, index) {
            NewData.push({
                key: index,
                value: item,
            })
        })
        this.setState({UserHotNews: NewData})
        EasyLoading.dismiss()
    }

    UserJob = async () => {
        EasyLoading.show('网速有点慢');
        const condition = {}
        condition.userid = this.state.User.user.id
        const result = await reqConditionFindJob(condition)
        let NewData = []
        result.data.map(function (item, index) {
            NewData.push({
                key: index,
                value: item,
            })
        })
        this.setState({JobList: NewData})
        EasyLoading.dismiss()
    }

    UserWantBuy = async () => {
        EasyLoading.show('网速有点慢');
        const condition = {}
        condition.token = this.props.MyToken
        condition.userid = this.state.User.user.id
        const result = await reqGetWantBuy(condition)
        let NewData = []
        result.data.map(function (item, index) {
            NewData.push({
                key: index,
                value: item,
            })
        })
        this.setState({AllWantBuy: NewData})
        EasyLoading.dismiss()
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
            this.UserProduct(page)
        }
    }





    componentWillReceiveProps(nextProps) {
        if(this.props.User !== nextProps.User){
            this.setState({
                User: nextProps.User
            }, () => {
                page = 1;//当前第几页
                totalPage = 0;//总的页数
                this.UserProduct(page)
            })
        }
    }


    render() {
        return (
            <>
            <Loading />
            <ScrollableTabView
                style={{marginTop: '4%'}}
                initialPage={0} //初始化时被选中的Tab下标，默认是0
                locked={false}//表示手指是否能拖动视图  默认false  true则不能拖动,只可点击
                renderTabBar={() => <ScrollableTabBar/>}
                onChangeTab={(obj) => {//Tab切换之后会触发此方法
                    if (obj.i === 1) {
                        this.UserWantBuy()
                    }else if(obj.i == 2){
                        this.UserHotNews()
                    }else if(obj.i == 3){
                        this.UserJob()
                    }
                }}
            >
                <ScrollView
                    tabLabel='我的商品'
                    onMomentumScrollEnd={this._contentViewScroll} // 获取滑动数据
                    style={{flex: 1}}
                >
                    <ProductList
                        AllProduct={this.state.UserProduct}
                        props={this.props.props}
                        type='MyUser'
                    />
                    <Foot showfooter={this.state.showFoot}/>
                </ScrollView>
                <ScrollView
                    tabLabel='我的求购'
                    style={{flex: 1}}
                >
                    <WantBuyList
                        AllWantBuy={this.state.AllWantBuy}
                        type='MyUser'
                        props={this.props.props}
                    />
                </ScrollView>
                <ScrollView
                    tabLabel='我的帖子'
                    style={{flex: 1}}
                >
                    <ProductList
                        AllProduct={this.state.UserHotNews}
                        type='MyUser'
                        props={this.props.props}
                    />
                </ScrollView>
                <ScrollView
                    tabLabel='我的兼职'
                    style={{flex: 1}}
                >
                    <JobList
                        JobList={this.state.JobList}
                        type='MyUser'
                        props={this.props.props}
                    />
                </ScrollView>

            </ScrollableTabView>
            </>
        )
    }
}

