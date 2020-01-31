import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableNativeFeedback,
    BackHandler,
    ToastAndroid,
    StatusBar,
    Dimensions
} from 'react-native'
import {SearchBar, Carousel, Grid, Icon} from '@ant-design/react-native'
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import ProductDetail from './product-detail'

import ActionButton from 'react-native-action-button'
import {reqGetAllProduct, reqClassiFication,reqFindProduct} from '../api/index'
import SplashScreen from 'react-native-splash-screen'

var { width, height } = Dimensions.get('window');

let page = 1;//当前第几页
let totalPage = 0;//总的页数



class Home extends Component {

    state = {
        OneClassiFication: [],
        AllProduct: [],
        Onedata: [],
        isRefreshing: false,
        showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        isLoading: true,
        isTop: false,
        DataOu: [],
        DataJi: [],
        waiting: false,//防止多次重复点击
        searchName : ''
    }

    getOneClassFication = async () => {
        const result = await reqClassiFication()
        this.setState({
            OneClassiFication: result
        }, () => {
            this.getOneClassFicationList()
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
        let result
        if(this.state.searchName === ''){
            result = await reqGetAllProduct('', page, 10, 'create_time desc')
        }else{
            result = await reqFindProduct(this.state.searchName)
        }

        totalPage = result.pages
        let data = result.data;
        let NewData = [];

        data.map(function (item,index) {
            NewData.push({
                key: index,
                value: item,
            })
        });

        let foot = 0;

        if (page >= totalPage) {
            foot = 1;//listView底部显示没有更多数据了
        }

        this.setState({
            //复制数据源
            AllProduct: [...this.state.AllProduct,...NewData],
            isLoading: false,
            showFoot: foot,
            isRefreshing: false,
        }/*,() => this.AllProductList()*/);
        data = null;
        NewData = null;
    }

    AllProductList = () => {
        const AllProduct = this.state.AllProduct || []
        return AllProduct.map((item, index) => {
            const images = item.value.images.split(",")[0]
            return (
                <TouchableNativeFeedback
                    disabled={this.state.waiting}
                    onPress={() =>
                        this._PressList(item)
                    }
                    key={item.value.id}
                >
                    <View style={{
                        width: '48%',
                        marginTop: 10,
                        borderRadius: 8,
                        marginLeft: 7,
                        backgroundColor: '#FFFFFF'
                    }}>
                        <Image source={{uri: images}} style={{width: '100%', height: 200, borderRadius: 8}}/>
                        <View>
                            <Text style={{marginLeft: 10, fontWeight: 'bold', marginTop: 8}}>{item.value.name}</Text>
                            <Text style={{color: 'red', marginLeft: 10, fontSize: 20, marginTop: 5}}><Text
                                style={{fontSize: 12}}>￥</Text>{item.value.price1}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginTop: 10,
                            marginBottom: 5,
                            marginLeft: 8
                        }}>
                           {/* <Image
                                source={{uri: item.value.user.img}}
                                style={{width: 20, height: 20, borderRadius: 20, marginRight: 10}}
                            />
                            <Text>{item.value.user.username}</Text>*/}
                        </View>
                    </View>
                </TouchableNativeFeedback>
            )
        })
    }

    _PressList = (product) => {
        this.props.navigation.push('ProductDetail', {
            ProductId: product.value.id
        })
        this.setState({waiting: true});
        setTimeout(() => {
            this.setState({waiting: false})
        }, 1000)
    }
    /*  AllProductList = () => {
          const AllProduct = this.state.AllProduct || []
          let DataOu = []
          let DataJi = []

          return AllProduct.map((item,index) => {
              if(index % 2 === 0){
                  DataOu.push(
                      item
                  )
              }else{
                  DataJi.push(
                      item
                  )
              }
              this.setState({
                  DataOu,
                  DataJi
              })
          })
      }*/

    /*getOu = () => {
        const DataOu = this.state.DataOu || []
       return  DataOu.map(item=>{
           const images = item.value.images.split(",")[0]
           return (
                <Card style={{width:'48%',marginTop: 10, borderRadius: 15, marginLeft: 7}} key={item.value.id}>
                    <Card.Header
                        thumbStyle={{width: '100%', height: 200}}
                        thumb={images}>
                    </Card.Header>
                    <Card.Body>
                        <View style={{height: 42}}>
                            <Text style={{marginLeft: 10, fontWeight: 'bold'}}>{item.value.name}</Text>
                            <Text style={{color: 'red', marginLeft: 10, fontSize: 20, marginTop: 5}}><Text
                                style={{fontSize: 12}}>￥</Text>{item.value.price1}</Text>
                        </View>

                    </Card.Body>
                    <Card.Footer
                        style={{marginTop: 10}}
                        content={
                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                <Image
                                    source={{uri: item.value.user.img}}
                                    style={{width: 20, height: 20, borderRadius: 20, marginRight: 10}}
                                />
                                <Text>{item.value.user.username}</Text>
                            </View>
                        }
                    />
                </Card>
            )
        })

    }*/

    _onRefresh = () => {
        this.search.state.value = ''
        this.setState({isRefreshing: true});
        setTimeout(() => {
            this.setState({isRefreshing: false, AllProduct: [],searchName:''});
            page = 1;//当前第几页
            totalPage = 0;//总的页数
            this.getAllProduct()
        }, 1500);
    }

    _renderFooter() {
        if (this.state.showFoot === 1) {
            return (
                <View style={{height: 30, alignItems: 'center', justifyContent: 'flex-start',}}>
                    <Text style={{color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={style.footer}>
                    <ActivityIndicator/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={style.footer}>
                    <Text></Text>
                </View>
            );
        }
    }

    _contentViewScroll = (e) => {
        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        if (offsetY + oriageScrollHeight >= contentSizeHeight - 20) {
            //如果是正在加载中或没有更多数据了，则返回
            if (this.state.showFoot !== 0) {
                return;
            }
            //如果当前页大于或等于总页数，那就是到最后一页了，返回
            if ((page !== 1) && (page >= totalPage)) {
                return;
            } else {
                page++;
            }
            //底部显示正在加载更多数据
            this.setState({showFoot: 2});
            //获取数据
            this.getAllProduct(page);
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

    onBackAndroid = () => {
        if(this.props.navigation.isFocused()) {//判断   该页面是否处于聚焦状态
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                BackHandler.exitApp();
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        }
    };

    SubmitSearch =  async () => {
        this.setState({
            AllProduct : [],
        },() => {
            this.getAllProduct(1)
        })
    }




    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }

    componentDidMount() {
        page = 1;//当前第几页
        totalPage = 0;//总的页数
        this.getOneClassFication()
        this.getAllProduct(page)
        setTimeout(() => {
            SplashScreen.hide()
        }, 1500)
        this._navListener = this.props.navigation.addListener("didFocus", () => {
            StatusBar.setBarStyle("dark-content"); //状态栏文字颜色
            StatusBar.setBackgroundColor("#ffffff"); //状态栏背景色
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        this._navListener.remove();
    }

    render() {
        const Onedata = this.state.Onedata || []
        return (
            <View style={{flex: 1}}>
                <SearchBar
                    value = {this.state.searchName}
                    ref={(search) => this.search = search}
                    placeholder='输入关键字'
                    onChange={(value) => this.setState({
                        searchName : value
                    })}
                    onSubmit = {() => this.SubmitSearch()}
                    onCancel = {() => {
                        this.setState({
                            searchName : ''
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
                        onPress={(_el) => alert(_el.id)}
                    />
                    <Text style={{paddingLeft: 10}}>
                        <Icon name='fire' color='red'/>
                        校园生活
                    </Text>

                    <View style={style.flex}>
                        <View style={style.SchoolHotBg}>
                            <Text style={style.SchoolHotTitle}>学生兼职</Text>
                            <Text style={style.SchoolHotDescribe}>校园兼职</Text>
                            <View style={{paddingLeft: 120, marginTop: -20}}>
                                <Image
                                    source={require('../../resources/images/外块兼职.png')}
                                    style={{width: 70, height: 77}}
                                />
                            </View>
                            <Text style={style.SchoolClickLook}>点击查看 ></Text>
                        </View>
                        <View style={style.SchoolHotBg}>
                            <Text style={style.SchoolHotTitle}>查看求购</Text>
                            <Text style={style.SchoolHotDescribe}>卖你想卖</Text>
                            <View style={{paddingLeft: 120, marginTop: -13}}>
                                <Image
                                    source={require('../../resources/images/求购.png')}
                                    style={{width: 70, height: 70}}
                                />
                            </View>
                            <Text style={style.SchoolClickLook}>点击查看 ></Text>
                        </View>
                        <View style={style.SchoolHotBg}>
                            <Text style={style.SchoolHotTitle}>学生兼职</Text>
                            <Text style={style.SchoolHotDescribe}>校园兼职</Text>
                            <View style={{paddingLeft: 120, marginTop: -20}}>
                                <Image
                                    source={require('../../resources/images/外块兼职.png')}
                                    style={{width: 70, height: 77}}
                                />
                            </View>
                            <Text style={style.SchoolClickLook}>点击查看 ></Text>
                        </View>
                        <View style={style.SchoolHotBg}>
                            <Text style={style.SchoolHotTitle}>校园热点</Text>
                            <Text style={style.SchoolHotDescribe}>Eurasia热点</Text>
                            <View style={{paddingLeft: 120, marginTop: -10}}>
                                <Image
                                    source={require('../../resources/images/热点.png')}
                                    style={{width: 65, height: 70}}
                                />
                            </View>
                            <Text style={style.SchoolClickLook}>点击查看 ></Text>
                        </View>
                    </View>
                    <Text style={{paddingLeft: 10}}>
                        <Image
                            style={{width: 30, height: 30}}
                            source={require('../../resources/images/猜您喜欢.png')}
                        />
                        猜您喜欢
                    </Text>

                    <View>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            {
                                this.state.AllProduct.length !== 0
                                    ? this.AllProductList() :
                                    <Image
                                        source={{uri : 'https://www.youzixy.com/img/noGoods.cc45e087.png'}}
                                        style={{ width:width, height:498*width/750, marginTop:80}}
                                    />
                            }
                        </View>
                    </View>


                    {/*<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    </View>*/}


                    <View>
                        {this._renderFooter()}
                    </View>

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
        width: '48%',
        marginTop: 10
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
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
})

/*
export default () => (
    <Provider>
        <Home/>
    </Provider>
);
*/


const HomeNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            header: null,
        },
    },
    ProductDetail: {
        screen: ProductDetail,
        navigationOptions: {
            title: '商品详情',
            gesturesEnabled: true,
            headerMode: 'screen',
        },
    }
},
    {
    initialRouteName: 'Home',
    headerLayoutPreset: 'center',   //将标题居中
}
)


export default createAppContainer(HomeNavigator)


/*export default connect(
    state => ({OneClassFication : state.One}),
    {OneClassiFication}
)(Home)*/

