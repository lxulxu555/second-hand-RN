import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    BackHandler,
} from 'react-native'

import {InputItem, List, Icon, Toast} from '@ant-design/react-native'
import {reqLogin} from '../../api/index'
import {readUser} from '../../utils/ReadUserData'


export default class Login extends Component {

    static navigationOptions = (props) => {
        return {
            headerLeft: (
                <Icon
                    style={{marginLeft: 20, color: '#36B7AB'}}
                    name='arrow-left'
                    onPress={() => props.navigation.push('Home')}
                />
            ),
        }
    }


    state = {
        username: '',
        password: '',
        click: false
    }

    login = async () => {
        const username = this.state.username
        const password = this.state.password
        const code = '1'
        const result = await reqLogin(username, password, code)
        if (result.code === -1) {
            Toast.fail(result.msg, 1)
        } else {
            readUser._saveData(result.data)
            this.props.navigation.navigate('Main');
        }
    }

    onBackAndroid = () => {
        if (this.props.navigation.isFocused()) {//判断   该页面是否处于聚焦状态
            this.props.navigation.navigate('Main');
        }
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle("dark-content"); //状态栏文字颜色
            StatusBar.setBackgroundColor('#FFFFFF'); //状态栏背景色
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <View style={{alignItems: 'center', marginTop: 100}}>
                    <Image
                        source={{uri: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2345163956,3915170873&fm=26&gp=0.jpg'}}
                        style={{width: 100, height: 100}}
                    />
                </View>
                <View style={{alignItems: 'center',}}>
                    <List style={{marginTop: 20, width: '90%'}}>
                        <InputItem
                            onSubmitEditing = {()=> {this.type.focus()}} //当软键盘的确定/提交按钮被按下的时候调用此函数
                            clear
                            value={this.state.username}
                            onChange={value => {
                                this.setState({
                                    username: value,
                                });
                            }}
                            placeholder="请输入会员名/注册邮箱"
                        >
                            <Icon name='user'/>
                        </InputItem>
                        <InputItem
                            last
                            ref={(ref) => {
                                this.type = ref
                            }}
                            type={this.state.click === true ? '' : 'password'}
                            extra={<TouchableOpacity onPress={() => this.props.navigation.push('ForGetPwd')}><Text
                                style={{color: '#778899'}}>忘记密码</Text></TouchableOpacity>}
                            clear
                            value={this.state.password}
                            onChange={value => {
                                this.setState({
                                    password: value,
                                });
                            }}
                            onSubmitEditing={() => this.login()}
                            placeholder="请输入密码"
                        >
                            <Icon
                                name={this.state.click === false ? 'eye-invisible' : 'eye'}
                                onPress={() => this.setState({
                                    click: this.state.click === false ? true : false
                                })}/>
                        </InputItem>
                    </List>
                </View>
                <View style={{alignItems: 'center', marginTop: 50}}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#36B7AB',
                            alignItems: 'center',
                            borderRadius: 20,
                            width: '90%',
                            height: 45,
                            justifyContent: 'center',
                        }}
                        onPress={() => this.login()}
                    >
                        <Text style={{color: '#FFFFFF', textAlign: 'center', fontSize: 15}}>登录</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    style={{flex:4, margin: 20}}
                    onPress={() => this.props.navigation.push("Register",{
                        type : '登录'
                    })}
                >
                    <Text style={{color: '#778899'}}>快速登录</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flex:1, margin: 20}}
                    onPress={() => this.props.navigation.push("Register",{
                        type : '注册'
                    })}
                >
                    <Text style={{color: '#778899'}}>快速注册</Text>
                </TouchableOpacity>
                </View>
            </View>
        )
    }
}


