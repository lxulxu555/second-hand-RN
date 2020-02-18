import React,{Component} from 'react'
import Home from './src/page/home'
import User from './src/page/user/user'
import {Icon,Provider} from '@ant-design/react-native'
import ClassiFication from './src/page/classification'

import {createAppContainer} from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {PermissionsAndroid} from "react-native";



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
    },
    },
    {
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





const AppContainer = createAppContainer(TabNavigator)


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




