import React, {Component} from 'react'
import {
    View,
    Text,
    StatusBar,
    ImageBackground,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native'

import {findByUserId, reqLikeUser, reqJudgeLikeUser} from '../../api'
import {receiveAddFans, receiveUserData} from '../../redux/actions'

import {Card} from "@ant-design/react-native/lib/card";
import SliderUser from "./slider-user";
import {connect} from 'react-redux'
import {readUser} from "../../utils/ReadUserData";
import {EasyLoading, Loading} from '../../utils/Loading';

let height = Dimensions.get('window').height


class MyUser extends Component {

    state = {
        UserData: {},
        UserProduct: [],
        LikeUserType: '',
    }


    findUserById = async () => {
        EasyLoading.show('网速有点慢');
        const type = this.props.navigation.getParam('type')
        const id = type === 'My' ? this.props.User.user.id : this.props.navigation.getParam('id')
        const result = await findByUserId(id)
        this.setState({
            UserData: result.data,
        })
        EasyLoading.dismiss()
    }

    likeUser = async () => {
        const User = this.props.User    //这是本地已经登陆的用户
        const userId = this.props.navigation.getParam('id')   //这是打开用户详情时候，传过来该ID
        const fansId = User.user.id
        const token = User.token
        const result = await reqLikeUser(userId, fansId, token)
        if (result.code === 0) {
            this.setState({
                LikeUserType: this.state.LikeUserType === '关注' ? '已关注' : '关注'
            })
        }
    }



    JudgeLikeUser = async () => {
        const userId = this.props.User.user.id //登录的用户的ID
        const toUserId = this.props.navigation.getParam('id') ? this.props.navigation.getParam('id') : ""
        const result = await reqJudgeLikeUser(userId, toUserId, this.props.User.token)
        this.setState({
            LikeUserType: result === true ? '已关注' : '关注'
        })
    }


    componentDidMount() {
        this.findUserById()
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this.JudgeLikeUser()
            StatusBar.setTranslucent(true)
            StatusBar.setBarStyle("dark-content"); //状态栏文字颜色
            StatusBar.setBackgroundColor('rgba(0, 0, 0, 0)')
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }


    render() {
        const UserData = this.state.UserData
        const type = this.props.navigation.getParam('type')
        const User = UserData.user || {}
        const Fans = UserData.fans || {}
        return (
            <View style={{flex: 1}}>
                   <Loading />
                <View>
                    <ImageBackground
                        style={{height: height * 0.4, width: '100%', opacity: 0.2}}
                        source={{uri: User.img}}
                    />
                    <View style={{marginTop: -height * 0.3, flexDirection: 'row'}}>
                        <Image
                            source={{uri: User.img}}
                            style={{width: 70, height: 70, borderWidth: 2, borderColor: '#FFFFFF', marginLeft: 20}}
                        />
                        <View style={{flexDirection: 'column', marginLeft: 10}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{User.username}</Text>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 15,
                                marginTop: 5
                            }}>昵称：{User.nickname}</Text>
                        </View>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity style={{marginRight: 10, marginTop: 10}}
                                          onPress={() => type === 'productDetail' ?
                                              this.likeUser() :
                                              this.props.navigation.push("UpdateUser")}
                        >
                            <View style={{
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: '#FFFFFF',
                                width: 75
                            }}>
                                <Text style={{padding: 5, fontWeight: 'bold'}}>
                                    {type === 'productDetail' ? this.state.LikeUserType : '编辑资料'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{margin: 15, fontSize: 15}}>{User.intro}</Text>
                    </View>
                    <View style={{
                        marginTop: 30,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity style={{fontSize: 15, borderRightWidth: 0.5, flex: 1}}
                                          onPress={() => this.props.navigation.push('LikeUser', {
                                              type: 'attention',
                                              title: User.nickname + '的关注',
                                          })}>
                            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{Fans.attention}关注</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{fontSize: 15, flex: 1}}
                                          onPress={() => this.props.navigation.push('LikeUser', {
                                              type: 'fans',
                                              title: User.nickname + '的粉丝',
                                          })}>
                            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{Fans.fans}粉丝</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <SliderUser
                    User={this.state.UserData}
                    MyToken={this.props.User.token}
                    props={this.props}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    User: state.receiveUserData.User
})

export default connect(
    mapStateToProps
)(MyUser)
