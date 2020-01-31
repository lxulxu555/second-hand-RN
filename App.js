import React,{Component} from 'react'
import Home from './src/page/home'
import User from './src/page/user'
import {Icon,Provider} from '@ant-design/react-native'
import ClassiFication from './src/page/classification'

import {createAppContainer} from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {ScrollView, StatusBar} from "react-native";



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
    render() {
        return (
            <Provider>
            <AppContainer/>
            </Provider>
        )
    }
}

/*export default class App extends Component{
    state = {
        selectedTab : 'home'
    }
    render () {
        return (
            <View style={style.container}>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'home'}
                        title="首页"
                        renderIcon={() => <Icon name='home'/>}
                        renderSelectedIcon={() => <Icon name='home'/>}
                        onPress={() => this.setState({ selectedTab: 'home' })}
                    >
                        <Home/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'classification'}
                        title="分类"
                        renderIcon={() => <Icon name='appstore'/>}
                        renderSelectedIcon={() => <Icon name='appstore'/>}
                        //renderBadge={() => <CustomBadgeView />}
                        onPress={() => this.setState({ selectedTab: 'classification' })}
                    >
                        <ClassiFication/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'user'}
                        title="个人中心"
                        renderIcon={() => <Icon name='user'/>}
                        renderSelectedIcon={() => <Icon name='user'/>}
                        //renderBadge={() => <CustomBadgeView />}
                        badgeText="1"
                        onPress={() => this.setState({ selectedTab: 'user' })}
                    >
                        <User/>
                    </TabNavigator.Item>
                </TabNavigator>
            </View>

        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1
    }
})*/



