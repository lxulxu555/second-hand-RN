import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    ScrollView,
    ImageBackground,
    StatusBar,
    TouchableOpacity, DeviceEventEmitter
} from 'react-native'
import {connect} from 'react-redux'
import {findByUserId} from '../../api'
import {reqgetMessage} from '../../redux/actions'
import JPushModule from "jpush-react-native";


class User extends Component {

    constructor(props) {
        super(props)
        this.state = {
            User: {}
        }
    }


    findUserById = async () => {
        const result = await findByUserId(this.props.User.user.id)
        if (result.code === 0) {
            this.setState({User: result.data}, () => {
                DeviceEventEmitter.emit('changeMine', this.state.User.user.img);
            })
        } else {
            this.props.navigation.push('Login')
        }
    }

    JPush = () => {
        JPushModule.addLocalNotification({
            messageID: '1',
            title : '你好',
            content:'哈哈哈哈啊',
        })
        JPushModule.getRegistrationID((registrationId) => {
            console.log("Device register succeed, registrationId " + JSON.stringify(registrationId));
        });
    }


    componentDidMount() {
        //注册监听事件，时间名称：changeMine  传参：jsonData.avatar（头像url）
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this.JPush()
            this.props.dispatch(reqgetMessage(this.props.User.user.id))
            //this.findUserById()
            StatusBar.setTranslucent(true)
            StatusBar.setBarStyle('light-content'); //状态栏文字颜色
            StatusBar.setBackgroundColor('#36B7AB'); //状态栏背景色
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }


    render() {
        const UserData = this.state.User
        const User = UserData.user || {}
        const fans = UserData.fans || {}
        return (
            <View style={{flex: 1, marginTop: 15}}>
                <ScrollView>
                    <ImageBackground style={{width: '100%', height: 150, backgroundColor: '#36B7AB'}}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('MyUser', {
                                type: 'My',
                            })} activeOpacity={0.6}>
                                <Image
                                    source={{uri: User.img === '' ? 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4147505531,1886811031&fm=26&gp=0.jpg' : User.img}}
                                    style={{width: 100, height: 100, borderRadius: 10, margin: 20}}
                                />
                            </TouchableOpacity>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={{fontSize: 20, marginTop: 18}}>{User.username}</Text>
                                <Text style={{marginTop: 10}}>昵称:<Text>{User.nickname}</Text></Text>
                                <TouchableOpacity style={{
                                    backgroundColor: '#F5F5F5',
                                    marginTop: 10,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    padding: 2
                                }} onPress={() => this.props.navigation.push('MyUser', {
                                    type: 'My',
                                })} activeOpacity={0.6}>
                                    <Text style={{fontSize: 12}}>个人主页></Text>
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
                                          onPress={() => this.props.navigation.push('AboutMyUser')}>
                            <Text style={{textAlign: 'center'}}>
                                {this.props.message}与我相关
                            </Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={{fontSize: 15, borderRightWidth: 0.5, flex: 1}}
                                          onPress={() => this.props.navigation.push('LikeUser', {
                                              title: '我的关注',
                                              type: 'attention',
                                          })}>
                            <Text style={{textAlign: 'center'}}>{fans.attention + '关注'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{fontSize: 15, flex: 1}}
                                          onPress={() => this.props.navigation.push('LikeUser', {
                                              title: '我的粉丝',
                                              type: 'fans',
                                          })}>
                            <Text style={{textAlign: 'center'}}>{fans.fans + '粉丝'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            flexDirection: 'row',
                            width: '95%',
                            borderRadius: 18,
                            marginTop: 30,
                            paddingTop: 20,
                            paddingBottom: 20,
                        }}>
                            <TouchableOpacity style={{flex: 1, alignItems: 'center'}}
                                              onPress={() => this.props.navigation.push('Mycollect')}>
                                <Image
                                    source={require('../../../android/app/src/main/res/drawable-hdpi/mycollect.png')}
                                    style={{height: 35, width: 35}}
                                />
                                <Text style={{marginTop: 8}}>我收藏的</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex: 1, alignItems: 'center'}}
                                              onPress={() => this.props.navigation.push('SendProduct', {
                                                  type: 'send'
                                              })}>
                                <Image
                                    source={require('../../../android/app/src/main/res/drawable-hdpi/sendproduct.png')}
                                    style={{height: 35, width: 35, tintColor: 'blue'}}
                                />
                                <Text style={{marginTop: 8}}>发布商品</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex: 1, alignItems: 'center'}}
                                              onPress={() => this.props.navigation.push('SendWantBuy')}>
                                <Image
                                    source={require('../../../android/app/src/main/res/drawable-hdpi/sendwantbuy.png')}
                                    style={{height: 35, width: 35, tintColor: 'green'}}
                                />
                                <Text style={{marginTop: 8}}>发布求购</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    User: state.receiveUserData.User,
    message: state.receiveGetMessage.message
})

export default connect(
    mapStateToProps
)(User)
