import React,{Component} from 'react'
import Home from './src/page/home/home'
import User from './src/page/user/user'
import {Icon,Provider} from '@ant-design/react-native'
import ClassiFication from './src/page/classification'

import {createAppContainer} from 'react-navigation'
import {createStackNavigator,CardStyleInterpolators} from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {PermissionsAndroid} from "react-native";
import ProductDetail from './src/page/product/product-detail'
import WantBuy from './src/page/home/want-buy'
import OneClassDetail from './src/page/home/one-class-detail'
import Setting from './src/page/user/setting'
import Login from './src/page/user/login'
import SendProduct from './src/page/user/send-product'
import MyUser from './src/page/user/my-user'
import Register from './src/page/user/register'
import Mycollect from './src/page/user/my-collect'
import UpdateUser from './src/page/user/update-user'
import Nickname from './src/page/user/nick-name'
import ForGetPwd from './src/page/user/forget-pwd'
import SendWantBuy from './src/page/user/send-want-buy'
import LikeUser from './src/page/user/like-user'


const TabNavigator = createBottomTabNavigator(
    {
        Main : {
            screen :  Home,
            navigationOptions : ({ navigation }) => {
                return {
                    tabBarLabel:'首页',
                    tabBarIcon: ({ focused }) => {
                        return (
                            focused ? <Icon name='home' style={{color:'red'}}/> : <Icon name='home'/>
                        )
                    }
                }
            }
        },
        ClassiFication:{
            screen: ClassiFication,
            navigationOptions: {
                // 底部导航
                tabBarLabel:'分类',
                tabBarIcon: ({ focused }) => {
                    return (
                        focused ? <Icon name='appstore' style={{color:'red'}}/> : <Icon name='appstore'/>
                    )
                }
            }
        },
        User:{
            screen: User,
            navigationOptions: {
                // 底部导航
                tabBarLabel:'个人中心',
                tabBarIcon: ({ focused }) => {
                    return (
                        focused ? <Icon name='user' style={{color:'red'}}/> : <Icon name='user'/>
                    )
                }
            }
    }},
    {
        navigationOptions: ({ navigation }) => {
            const optisns = {};
            const { routeName } = navigation.state.routes[navigation.state.index];
            if (routeName === "Main") {
                optisns.header = null;
                return optisns;
            } else if (routeName === "ClassiFication") {
                return {
                    title: '分类',
                }
            } else if (routeName === "User") {
                return {
                    headerTransparent: true, // 背景透明
                    title: null,
                    headerRight: (
                        <Icon
                            name='setting'
                            style={{marginRight: 20, color: '#FFFFFF'}}
                            onPress={() => navigation.push('Setting')}
                        />
                    ),
                }
            }
        },
        defaultNavigationOptions: ({navigation}) => {
            const {routes} = navigation.state;
            let flat = true;
            if (routes && routes.length > 1) {
                flat = false;
            }
            return {
                tabBarVisible: flat,
            };
        },
    },
    {
        initialRouteName: 'Main',
        tabBarOptions: {
            activeTintColor: 'gold',
            inactiveTintColor: 'gray',
            style: {
                height: 50,
            }
        },
    }
    )



const AppStackNavigation = createStackNavigator({
    Homes: {
        screen : TabNavigator,
    },
    ProductDetail : {
        screen : ProductDetail,
        navigationOptions: {
            headerTransparent: true, // 背景透明
            cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
            headerTintColor: '#36B7AB',
        },
    },
    WantBuy : {
        screen : WantBuy
    },
    OneClassDetail : {
        screen : OneClassDetail
    },
    Setting : {
        screen : Setting
    },
    Login : {
        screen : Login
    },
    SendProduct : {
        screen : SendProduct
    },
    MyUser: {
        screen: MyUser,
        navigationOptions: {
            headerTransparent: true, // 背景透明
            headerTintColor: '#36B7AB',
        }
    },
    Register : {
        screen : Register,
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
        }
    },
    Nickname : {
        screen : Nickname,
    },
    ForGetPwd: {
        screen : ForGetPwd,
    },
    SendWantBuy : {
        screen : SendWantBuy,
        navigationOptions: {
            title: '发布求购',
        },
    },
    LikeUser : {
        screen : LikeUser,
    }
},{
    defaultNavigationOptions : {
        title : null,
        headerStyle: {
            elevation: 0,  //去除安卓手机header的样式
        },
    },
    headerLayoutPreset: 'center',   //将标题居中
})

const AppContainer = createAppContainer(AppStackNavigation)


export default class App extends Component{

    //获取保存图片到相册权限
    requestExternalStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'My App Storage Permission',
                    message: 'My App needs access to your storage ' +
                        'so you can save your photos',
                },
            );
            return granted;
        } catch (err) {
            console.error('Failed to request permission ', err);
            return null;
        }
    };
    //获取相机权限
    requestCarmeraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    'title': 'Camera Permission',
                    'message': 'the project needs access to your camera ' +
                        'so you can take awesome pictures.'
                }
            );
            return granted;
        } catch (err) {
            console.error('Failed to request permission ', err);
            return null;
        }
    }




    componentWillMount(){
        this.requestExternalStoragePermission()
        this.requestCarmeraPermission()
    }

    render() {
        return (
            <Provider>
            <AppContainer/>
            </Provider>
        )
    }
}




