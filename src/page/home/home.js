import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    RefreshControl,
    BackHandler,
    ToastAndroid,
    StatusBar,
    TouchableOpacity
} from 'react-native'
import {SearchBar, Carousel, Grid, Icon} from '@ant-design/react-native'
import {EasyLoading, Loading} from "../../utils/Loading";

import ActionButton from 'react-native-action-button'
import {reqGetAllProduct, reqClassiFication, reqConditionFindProduct} from '../../api/index'
import SplashScreen from 'react-native-splash-screen'
import {ChangePage, Foot,BackTop,ProductList} from '../../utils/ChangePage'
import {readUser} from '../../utils/ReadUserData'

let page = 1;//当前第几页
let totalPage = 0;//总的页数

export default class Home extends Component {


    state = {
        OneClassiFication: [],
        Onedata: [],
        isTop: false,
        searchName: '',
        User: {},
        AllProduct: [],
        isRefreshing: false,
        showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        isLoading: true,
    }

    getOneClassFication = async () => {
        const result = await reqClassiFication()
        this.setState({
            OneClassiFication: result
        }, () => {
            this.getOneClassFicationList()
            EasyLoading.dismiss()
        })
    }

    getOneClassFicationList = () => {
        const OneList = this.state.OneClassiFication
        OneList.length = 8
        const Onedata = OneList.map(One => ({
            icon: One.image,
            text: One.name,
            id: One.id
        }));
        this.setState({
            Onedata
        })
    }

    getAllProduct = async (page) => {
        const condition = {}
        condition.page = page
        condition.rows = 5
        condition.orderBy = 'create_time desc'
        condition.goodsName = this.state.searchName
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
        this.search.state.value = ''
        this.setState({isRefreshing: true});
        setTimeout(() => {
            this.setState({
                isRefreshing: false, AllProduct: [], searchName: ''
            }, () => {
                page = 1;//当前第几页
                totalPage = 0;//总的页数
                this.getAllProduct(page)
            });
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
            this.getAllProduct(page)
        }
    }

    _getBackTop = (e) => {
        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
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

    onBackAndroid = () => {
        if (this.props.navigation.isFocused()) {//判断   该页面是否处于聚焦状态
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                BackHandler.exitApp();
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        }
    };

    SubmitSearch = async () => {
        this.setState({
            AllProduct: [],
        }, () => {
            this.getAllProduct(1)
        })
    }

    _readData = async () => {
        const data = await readUser._readData('home')
        this.setState({User:data})
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }

    componentDidMount() {
        EasyLoading.show()
        this.getOneClassFication()
        this.getAllProduct(page)
        setTimeout(() => {
            SplashScreen.hide()
        }, 2000)
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this._readData()
            StatusBar.setTranslucent(false)
            StatusBar.setBarStyle("dark-content"); //状态栏文字颜色
            StatusBar.setBackgroundColor("#ffffff"); //状态栏背景色
        })

    }



    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        this._navListener.remove();
    }

    render() {
        const Onedata = this.state.Onedata || []
        const User = this.state.User
        return (
            <View style={{flex: 1}}>
                <Loading/>
                <SearchBar
                    value={this.state.searchName}
                    ref={(search) => this.search = search}
                    placeholder='输入关键字'
                    onChange={(value) => this.setState({
                        searchName: value
                    })}
                    onSubmit={() => this.SubmitSearch()}
                    onCancel={() => {
                        this.setState({
                            searchName: ''
                        })
                    }}
                />
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

                    <Carousel
                        style={{marginTop: 2}}
                        selectedIndex={2}
                        autoplay
                        infinite
                        afterChange={this.onHorizontalSelectedIndexChange}
                    >
                        <Image
                            source={{uri: 'https://api.youzixy.com/public/uploads/attach/2019/09/16/5d7f9df01b29f.jpg'}}
                            style={{width: '100%', height: 120}}
                        />
                        <Image
                            style={{width: '100%', height: 120}}
                            source={{uri: 'https://api.youzixy.com/public/uploads/attach/2019/09/16/5d7f9df9c8ffd.jpg'}}
                        />
                        <Image
                            style={{width: '100%', height: 120}}
                            source={{uri: 'https://api.youzixy.com/public/uploads/attach/2019/09/16/5d7f9de20f273.jpg'}}
                        />
                    </Carousel>
                    <Grid
                        columnNum={4}
                        carouselMaxRow={4}
                        data={Onedata}
                        hasLine={false}
                        onPress={(_el) => this.props.navigation.push('OneClassDetail', {
                            type: 'oneClass',
                            OneClassId: _el.id,
                            User: User,
                        })}
                    />
                    <Text style={{paddingLeft: 10}}>
                        <Icon name='fire' color='red'/>
                        校园生活
                    </Text>

                    <View style={style.flex}>
                        <View style={style.SchoolHotBg}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={style.SchoolHotTitle}>学生兼职</Text>
                                <Text style={style.SchoolHotDescribe}>校园兼职</Text>
                                <View style={{flex: 1}}/>
                                <Text style={style.SchoolClickLook}>点击查看 ></Text>
                            </View>
                            <View style={{flex: 1}}/>
                            <View style={{marginTop: '23%'}}>
                                <Image
                                    source={require('../../../android/app/src/main/res/drawable-hdpi/sendjob.png')}
                                    style={{width: 70, height: 77}}
                                />
                            </View>
                        </View>
                        <View style={style.SchoolHotBg}>
                            <TouchableOpacity style={{flexDirection: 'column'}} activeOpacity={0.6}
                                              onPress={() => this.props.navigation.push('WantBuy', {
                                                  UserToken: User.token,
                                              })}>
                                <Text style={style.SchoolHotTitle}>查看求购</Text>
                                <Text style={style.SchoolHotDescribe}>卖你想卖</Text>
                                <View style={{flex: 1}}/>
                                <Text style={style.SchoolClickLook}>点击查看 ></Text>
                            </TouchableOpacity>
                            <View style={{flex: 1}}/>
                            <View style={{marginTop: '23%'}}>
                                <Image
                                    source={require('../../../android/app/src/main/res/drawable-hdpi/wantbuy.png')}
                                    style={{width: 70, height: 70}}
                                />
                            </View>
                        </View>
                        <View style={style.SchoolHotBg}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={style.SchoolHotTitle}>学生兼职</Text>
                                <Text style={style.SchoolHotDescribe}>校园兼职</Text>
                                <View style={{flex: 1}}/>
                                <Text style={style.SchoolClickLook}>点击查看 ></Text>

                            </View>
                            <View style={{flex: 1}}/>
                            <View style={{marginTop: '23%'}}>
                                <Image
                                    source={require('../../../android/app/src/main/res/drawable-hdpi/sendjob.png')}
                                    style={{width: 70, height: 77}}
                                />
                            </View>
                        </View>
                        <View style={style.SchoolHotBg}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={style.SchoolHotTitle}>校园热点</Text>
                                <Text style={style.SchoolHotDescribe}>Eurasia热点</Text>
                                <View style={{flex: 1}}/>
                                <Text style={style.SchoolClickLook}>点击查看 ></Text>
                            </View>
                            <View style={{flex: 1}}/>
                            <View style={{marginTop: '23%'}}>
                                <Image
                                    source={require('../../../android/app/src/main/res/drawable-hdpi/hot.png')}
                                    style={{width: 65, height: 70}}
                                />
                            </View>
                        </View>
                    </View>
                    <Text style={{paddingLeft: 10}}>
                        <Image
                            style={{width: 30, height: 30}}
                            source={require('../../../android/app/src/main/res/drawable-hdpi/youlike.png')}
                        />
                        猜您喜欢
                    </Text>

                    <ProductList
                        AllProduct={this.state.AllProduct}
                        User={this.state.User}
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


const style = StyleSheet.create({
    flex: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    SchoolHotBg: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        marginLeft: 7,
        height: 145,
        width: '47%',
        marginTop: 10,
        flexDirection: 'row',
    },
    SchoolHotTitle: {
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 10
    },
    SchoolHotDescribe: {
        color: '#CDC5BF'
        , marginLeft: 15
    },
    SchoolClickLook: {
        marginLeft: 15,
        marginBottom: 10
    },
})


