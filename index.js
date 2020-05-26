/**
 * @format
 */
import React, { Component } from 'react'
import {AppRegistry,Text} from 'react-native';
import App1 from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux'
import store from './src/redux/store'
import  './RNAsyncStorage'
import JPushModule from 'jpush-react-native';


class App extends Component {

    componentDidMount() {
        // 初始化 JPush
        JPushModule.init()
    }


    render(){
        return (
            <Provider store={store}>
                <App1/>
            </Provider>
        )
    }
}
//关闭其中某些yellow警告
console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.','source.uri should not be an empty string','Invalid props.style key'];
// 关闭全部yellow警告
console.disableYellowBox = true
AppRegistry.registerComponent(appName, () => App);

