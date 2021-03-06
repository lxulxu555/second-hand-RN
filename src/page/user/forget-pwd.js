import React, {Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native'
import {
    InputItem,
    Toast
} from "@ant-design/react-native";

import {reqFindPwd, reqVerificationCode} from '../../api'


export default class Register extends Component {

    state = {
        NewPwd: '',
        email: '',
        code: '',
        btnText: '获取验证码',
        btnBool: false,
    }


    forgetPwd = async () => {
        const NewPwd = this.state.NewPwd
        const email = this.state.email
        const code = this.state.code
        const result = await reqFindPwd(NewPwd, email, code)
        if (result.code === 0) {
            this.props.navigation.navigate('Login');
        } else {
            Toast.fail(result.msg, 1)
        }
    }

    VerificationCode = async () => {
        const email = {}
        clearInterval(this.timer)
        email.email = this.state.email
        let maxTime = 60
        const result = await reqVerificationCode(email)
        if (result.code === 0) {
            this.timer = setInterval(() => {
                if (maxTime > 0) {
                    --maxTime
                    this.setState({
                        btnText: '重新获取' + maxTime,
                        btnBool: true
                    })
                } else {
                    this.setState({
                        btnText: '获取验证码',
                        btnBool: false
                    })
                }
            }, 1000)
        } else {
            Toast.fail(result.msg, 1)
        }
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={80}>
                    <View style={{marginTop: '15%', marginLeft: '6%'}}>
                        <Text style={{fontSize: 19, fontWeight: 'bold'}}>欢迎使用Eurasia</Text>
                    </View>
                    <View style={{marginTop: '10%', marginLeft: '7%'}}>
                        <Text>使用邮箱快速找回Eurasia会员密码</Text>
                    </View>
                    <View style={{alignItems: 'center', marginTop: '5%'}}>
                        <View style={{backgroundColor: '#F5F5F5', width: '85%'}}>
                            <Text style={{margin: '3%'}}>新密码</Text>
                            <TextInput
                                placeholder='请输入你的新密码'
                                style={{fontSize: 14, paddingLeft: '5%'}}
                                returnKeyType='next'
                                onSubmitEditing={() => {
                                    this.SecondTextInput.focus()
                                }} //当软键盘的确定/提交按钮被按下的时候调用此函数
                                onChangeText={(text) => this.setState({
                                    NewPwd: text
                                })}/>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', marginTop: '5%'}}>
                        <View style={{backgroundColor: '#F5F5F5', width: '85%'}}>
                            <Text style={{margin: '3%'}}>邮箱</Text>
                            <InputItem
                                ref={(input) => {
                                    this.SecondTextInput = input
                                }}
                                placeholder='请输入你的邮箱'
                                style={{fontSize: 14, paddingLeft: '5%'}}
                                keyboardType='email-address'
                                returnKeyType='next'
                                onSubmitEditing={() => {
                                    this.ThreeTextInput.focus()
                                }} //当软键盘的确定/提交按钮被按下的时候调用此函数
                                onChangeText={(text) => this.setState({
                                    email: text
                                })}/>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', marginTop: '5%'}}>
                        <View style={{backgroundColor: '#F5F5F5', width: '85%'}}>
                            <Text style={{margin: '3%'}}>验证码</Text>
                            <InputItem
                                onChangeText={(text) => this.setState({
                                    code: text
                                })}
                                type='number'
                                placeholder='请输入你接受的验证码'
                                style={{fontSize: 14}}
                                ref={(input) => {
                                    this.ThreeTextInput = input
                                }}
                                extra={
                                    <TouchableOpacity style={{backgroundColor: '#36B7AB', padding: '3%'}}
                                                      onPress={() => this.VerificationCode()}
                                                      disabled={this.state.btnBool}>
                                        <Text style={{
                                            color: '#FFFFFF',
                                            textAlign: 'center',
                                            fontSize: 13
                                        }}>{this.state.btnText}</Text>
                                    </TouchableOpacity>
                                }
                                onSubmitEditing={() => this.forgetPwd()}
                                maxLength={6}
                            />
                        </View>
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
                            onPress={() => this.forgetPwd()}
                        >
                            <Text style={{color: '#FFFFFF', textAlign: 'center', fontSize: 15}}>找回</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

            </View>
        )
    }
}

