import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    ScrollView,
    ImageBackground,
    StatusBar,
    TouchableOpacity,
} from 'react-native'
import {Icon} from '@ant-design/react-native'
import {createAppContainer} from 'react-navigation';
import {createStackNavigator, CardStyleInterpolators} from 'react-navigation-stack';
import Login from './login'
import Setting from './setting'
import Register from './register'
import Mycollect from './my-collect'
import UpdateUser from './update-user'
import Nickname from './nick-name'
import ForGetPwd from './forget-pwd'
import SendProduct from './send-product'
import SendWantBuy from './send-want-buy'
import MyUser from './my-user'
import ProductDetail from "../product/product-detail";
import Fans from './fans'
import LikeUser from './like-user'


class User extends Component {

    state = {
        UserData: {},
        UserToken : ''
    }

    static navigationOptions = (props) => {
        return {
            headerRight: (
                <Icon
                    name='setting'
                    style={{marginRight: 20, color: '#FFFFFF'}}
                    onPress={() => props.navigation.push('Setting')}
                />
            ),
        }
    }


    _readData = () => {
        storage.load({
            key: 'loginState',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,

            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
            syncInBackground: true,

            // 你还可以给sync方法传递额外的参数
            syncParams: {
                extraFetchOptions: {
                    // 各种参数
                },
                someFlag: true,
            },
        }).then(ret => {
            // 如果找到数据，则在then方法中返回
            // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
            // 你只能在then这个方法内继续处理ret数据
            // 而不能在then以外处理
            // 也没有办法“变成”同步返回
            // 你也可以使用“看似”同步的async/await语法
            this.setState({
                UserData: ret
            })
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            this.props.navigation.push('Login')
        })
        storage.load({
            key: 'UserToken',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,

            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
            syncInBackground: true,

            // 你还可以给sync方法传递额外的参数
            syncParams: {
                extraFetchOptions: {
                    // 各种参数
                },
                someFlag: true,
            },
        }).then(ret => {
            // 如果找到数据，则在then方法中返回
            // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
            // 你只能在then这个方法内继续处理ret数据
            // 而不能在then以外处理
            // 也没有办法“变成”同步返回
            // 你也可以使用“看似”同步的async/await语法
            this.setState({
                UserToken: ret
            })
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            this.props.navigation.push('Login')
        })
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this._readData()
            StatusBar.setTranslucent(true)
            StatusBar.setBarStyle('light-content'); //状态栏文字颜色
            StatusBar.setBackgroundColor('#36B7AB'); //状态栏背景色
        });
    }



    componentWillUnmount() {
        this._navListener.remove();
    }



    render() {
        const UserData = this.state.UserData
        return (
            <View style={{flex: 1, marginTop: 15}}>
                <ScrollView>
                    <ImageBackground style={{width: '100%', height: 150, backgroundColor: '#36B7AB'}}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('MyUser',{
                                id: this.state.UserData.id,
                                UserToken : this.state.UserToken,
                            })} activeOpacity={0.6}>
                            <Image
                                source={{uri: UserData.img === '' ? 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4147505531,1886811031&fm=26&gp=0.jpg' : UserData.img}}
                                style={{width: 100, height: 100, borderRadius: 10, margin: 20}}
                            />
                            </TouchableOpacity>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={{fontSize: 20, marginTop: 18}}>{UserData.username}</Text>
                                <Text style={{marginTop: 10}}>昵称:<Text>{UserData.nickname}</Text></Text>
                                <TouchableOpacity style={{backgroundColor:'#F5F5F5',marginTop:10,borderRadius:10,alignItems:'center'}} onPress={() => this.props.navigation.push('MyUser',{
                                    id: this.state.UserData.id,
                                    UserToken : this.state.UserToken,
                                })} activeOpacity={0.6}>
                                <Text style={{fontSize:12}}>个人主页></Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        marginTop: -15,
                        marginLeft: 20,
                        borderRadius: 18,
                        height: 55,
                        width: '90%',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity style={{fontSize: 15, borderRightWidth: 0.5, flex: 1}}
                                          onPress={() => alert('s')}>
                            <Text style={{textAlign: 'center'}}>1与我相关</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{fontSize: 15, borderRightWidth: 0.5, flex: 1}}
                                          onPress={() => this.props.navigation.push('LikeUser',{
                                              id : this.state.UserData.id,
                                              Token : this.state.UserToken
                                          })}>
                            <Text style={{textAlign: 'center'}}>4关注</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{fontSize: 15, flex: 1}} onPress={() => {
                            this.props.navigation.push('Fans')
                        }}>
                            <Text style={{textAlign: 'center'}}>10粉丝</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'center'}}>
                    <View style={{
                        backgroundColor:'#FFFFFF',
                        flexDirection: 'row',
                        width:'95%',
                        borderRadius:18,
                        marginTop:30,
                        paddingTop:20,
                        paddingBottom:20,
                    }}>
                        <TouchableOpacity style={{flex:1,alignItems: 'center'}} onPress={() => this.props.navigation.push('Mycollect',{
                            UserToken: this.state.UserToken,
                            UserData: this.state.UserData,
                        })}>
                            <Image
                                source={require('../../../android/app/src/main/res/drawable-hdpi/mycollect.png')}
                                style={{height:35,width:35}}
                            />
                            <Text style={{marginTop:8}}>我收藏的</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,alignItems: 'center'}} onPress={() =>  this.props.navigation.push('SendProduct',{
                            UserId: this.state.UserData.id,
                            type : 'send'
                        })}>
                            <Image
                                source={require('../../../android/app/src/main/res/drawable-hdpi/sendproduct.png')}
                                style={{height:35,width:35,tintColor:'blue'}}
                            />
                            <Text style={{marginTop:8}}>发布商品</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,alignItems: 'center'}}  onPress={() =>  this.props.navigation.push('SendWantBuy',{
                            UserId: this.state.UserData.id,
                            UserToken : this.state.UserToken
                        })}>
                            <Image
                                source={require('../../../android/app/src/main/res/drawable-hdpi/sendwantbuy.png')}
                                style={{height:35,width:35,tintColor:'green'}}
                            />
                            <Text style={{marginTop:8}}>发布求购</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const AppNavigator = createStackNavigator({
    User: {
        screen: User,
        navigationOptions: {
            headerTransparent: true, // 背景透明
            title: null,
        },
    },
    ProductDetail: {
        screen: ProductDetail,
        navigationOptions: {
            headerTransparent: true, // 背景透明
            cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
            title: null,
            headerTintColor: '#36B7AB',
        },
    },
    Login: {
        screen: Login,
        navigationOptions: {
            headerTransparent: true, // 背景透明
            cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
            title: null,
            headerTintColor: '#36B7AB',
        },
    },
    Setting: {
        screen: Setting,
        navigationOptions: {
            cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
            title: '设置',
        },
    },
    Register : {
        screen : Register,
        navigationOptions: {
            title: null,
        },
    },
    Mycollect : {
        screen : Mycollect,
        navigationOptions: {
            cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
            title: '我收藏的',
        },
    },
    UpdateUser : {
        screen : UpdateUser,
        navigationOptions: {
            title: '我的资料',
        },
    },
    Nickname : {
        screen : Nickname,
    },
    ForGetPwd: {
        screen : ForGetPwd,
        navigationOptions: {
            title: null,
        },
    },
    SendProduct : {
        screen : SendProduct,
        navigationOptions: {
            title: '发布商品',
        },
    },
    SendWantBuy : {
        screen : SendWantBuy,
        navigationOptions: {
            title: '发布求购',
            headerStyle: {
                elevation: 0,  //去除安卓手机header的样式
            },
        },
    },
    MyUser : {
        screen : MyUser,
        navigationOptions: {
            headerTransparent: true, // 背景透明
            title: null,
            headerTintColor: '#36B7AB',
            headerStyle: {
                elevation: 0,  //去除安卓手机header的样式
            },
        },
    },
    Fans : {
        screen : Fans,
        navigationOptions: {
            headerStyle: {
                elevation: 0,  //去除安卓手机header的样式
            },
        },
    },
    LikeUser : {
        screen : LikeUser,
        navigationOptions: {
            title:'我关注的',
            headerStyle: {
                elevation: 0,  //去除安卓手机header的样式
            },
        },
    }
}, {
    initialRouteName: 'User',
    headerLayoutPreset: 'center',   //将标题居中
})

export default createAppContainer(AppNavigator)

