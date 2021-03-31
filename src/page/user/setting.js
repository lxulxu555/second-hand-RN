import React, {Component} from 'react';
import {View, Text, StatusBar, TouchableOpacity} from 'react-native';
import {Button, List} from '@ant-design/react-native';

export default class Setting extends Component {
  exitUser = () => {
    storage.remove({
      key: 'loginState',
    });
    this.props.navigation.navigate('Main');
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content'); //状态栏文字颜色
      StatusBar.setBackgroundColor('#FFFFFF'); //状态栏背景色
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <List style={{marginTop: 10}}>
          <List.Item disabled arrow="horizontal">
            <TouchableOpacity
              onPress={() => this.props.navigation.push('UpdateUser')}>
              <Text style={{margin: 7, fontSize: 15}}>个人资料设置</Text>
            </TouchableOpacity>
          </List.Item>
          <List.Item disabled arrow="horizontal" onPress={() => {}}>
            <Text style={{margin: 7, fontSize: 15}}>个人资料设置</Text>
          </List.Item>
          <List.Item disabled arrow="horizontal" onPress={() => {}}>
            <Text style={{margin: 7, fontSize: 15}}>个人资料设置</Text>
          </List.Item>
        </List>
        <View style={{alignItems: 'center', borderRadius: 20, marginTop: 20}}>
          <Button
            onPress={() => this.exitUser()}
            type="warning"
            style={{width: '90%'}}>
            退出账户
          </Button>
        </View>
      </View>
    );
  }
}
