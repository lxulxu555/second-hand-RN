/**
 * @format
 */
import React, { Component } from 'react'
import {AppRegistry} from 'react-native';
import App1 from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux'
import store from './src/redux/store'
import  './RNAsyncStorage'


class App extends Component {


    render(){
        return (
            <Provider store={store}>
                <App1/>
            </Provider>
        )
    }
}
AppRegistry.registerComponent(appName, () => App);
