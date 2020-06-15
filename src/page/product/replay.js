import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'
import axios from "axios";
import {Toast} from "@ant-design/react-native";
import {reqLikeComment} from '../../api'

export default class Replay extends Component {

    state = {
        messageList: [],
        replay: false,
        comment: false,
        commentItem: {},
        keyboard: false,
        User: {},
        CommentNumber: []
    }


    _renderMessage = (MessageList) => {
        return MessageList.map((item, index) => {
            if (!item.replyList) {
                return (
                    <View
                        key={item.leaf === null ? item.commentid : item.id}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{borderBottomWidth: 0.8, borderColor: '#F5F5F5'}}
                            onPress={() => this.replayComment(item)}
                        >
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity activeOpacity={0.6}
                                                  style={{borderBottomWidth: 0.8, borderColor: '#F5F5F5'}}
                                                  onPress={() => this.goMyUser(item)}>
                                    <Image source={{uri: item.user.img}}
                                           style={{width: 35, height: 35, borderRadius: 20, marginLeft: 10}}/>
                                </TouchableOpacity>
                                <Text style={{
                                    paddingTop: 10,
                                    marginLeft: 10,
                                    fontWeight: 'bold',
                                    width: 200
                                }}
                                      numberOfLines={1}
                                >
                                    {item.leaf === null ? item.user.nickname : item.user.nickname + '回复@' + item.parentname}
                                </Text>
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    style={{marginRight: 10}}
                                    onPress={() => this.LikeComment(item, index)}
                                >
                                    <Image
                                        ref={(ref) => this.Likecomment = {
                                            ...this.Likecomment,
                                            [item.leaf === null ? item.commentid : item.id]: ref
                                        }}
                                        style={{
                                            width: 18,
                                            height: 18,
                                            marginTop: 10,
                                            tintColor: item.state === null ? 'black' : 'red'
                                        }}
                                        source={require('../../../android/app/src/main/res/drawable-hdpi/like.png')}
                                    />
                                </TouchableOpacity>
                                <Text style={{marginRight: 15, marginTop: 10}}>{item.number}</Text>
                            </View>
                            <Text style={{marginTop: '1%', marginLeft: '13%', marginBottom: '2%'}}>{item.content}</Text>
                            <Text style={{
                                marginLeft: '13%',
                                marginBottom: '1%',
                                color: '#C0C0C0'
                            }}>{item.createtime}</Text>
                        </TouchableOpacity>
                    </View>
                )
            } else {
                return (
                    <View key={item.leaf === null ? item.commentid : item.id}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{borderBottomWidth: 0.8, borderColor: '#F5F5F5'}}
                            onPress={() => this.replayComment(item)}
                        >
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity activeOpacity={0.6}
                                                  style={{borderBottomWidth: 0.8, borderColor: '#F5F5F5'}}
                                                  onPress={() => this.goMyUser(item)}>
                                    <Image source={{uri: item.user.img}}
                                           style={{
                                               width: 35,
                                               height: 35,
                                               borderRadius: 20,
                                               marginLeft: 10,
                                               marginTop: 10,
                                           }}/>
                                </TouchableOpacity>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{
                                        paddingTop: 10,
                                        marginLeft: 10,
                                        fontWeight: 'bold',
                                        width: 200
                                    }}
                                          numberOfLines={1}
                                    >
                                        {item.leaf === null ? item.user.nickname : item.user.nickname + '回复@' + item.parentname}
                                    </Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    style={{marginRight: 10}}
                                    onPress={() => this.LikeComment(item, index)}
                                >
                                    <Image
                                        ref={(ref) => this.Likecomment = {
                                            ...this.Likecomment,
                                            [item.leaf === null ? item.commentid : item.id]: ref
                                        }}
                                        style={{
                                            width: 18,
                                            height: 18,
                                            marginTop: 10,
                                            tintColor: item.state === null ? 'black' : 'red'
                                        }}
                                        source={require('../../../android/app/src/main/res/drawable-hdpi/like.png')}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{marginRight: 15, marginTop: 10}}
                                >
                                    {item.number}
                                </Text>
                            </View>
                            <Text style={{marginTop: '1%', marginLeft: '13%', marginBottom: '2%'}}>{item.content}</Text>
                            <Text style={{
                                marginLeft: '13%',
                                marginBottom: '1%',
                                color: '#C0C0C0'
                            }}>{item.createtime}</Text>
                        </TouchableOpacity>
                        <View style={{
                            marginLeft: item.leaf === null ? '8%' : '0%'
                        }}>
                            {this._renderMessage(item.replyList)}
                        </View>
                    </View>
                )
            }
        })
    }

    replayComment = (item) => {
        this.props.ReplayComment(true, true, false, item)
    }

    UpdateCommentNumber = (messageList, comment) => {
        messageList.map(item => {
            const id = item.leaf === null ? item.commentid : item.id
            const commentid = comment.leaf === null ? comment.commentid : comment.id
            if (item.replyList) {
                this.UpdateCommentNumber(item.replyList, comment)
            }
            if (id === commentid && comment.state === null) {
                this.Likecomment[commentid].setNativeProps({
                    style: {
                        tintColor: 'red'
                    }
                })
                comment.state = 1
                if (id === commentid) {
                    this.setState({
                        CommentNumber: {...item, number: item.number++}
                    })
                }
            } else if (id === commentid && comment.state !== null) {
                this.Likecomment[commentid].setNativeProps({
                    style: {
                        tintColor: 'black'
                    }
                })
                comment.state = null
                if (id === commentid) {
                    this.setState({
                        CommentNumber: {...item, number: item.number--}
                    })
                }
            }
        })

    }

    LikeComment = async (comment, index) => {
        const messageList = this.state.messageList
        const User = this.state.User
        const type = comment.leaf === null ? 'comment' + ':' + comment.commentid + ':' + User.user.id : 'reply' + ':' + comment.id + ':' + User.user.id
        const state = comment.state === null ? '1' : '0'
        reqLikeComment(type,state,User.token)
        if (!User.user.id) {
            Toast.fail('请先登录', 1)
        } else {
            this.UpdateCommentNumber(messageList, comment)
        }
    }

    goMyUser = (item) => {
        const User = this.state.User
        if (!User.user.id) {
            Toast.fail('请先登录', 1)
        } else {
            this.props.navigation.navigation.push('MyUser', {
                type: 'productDetail',
                id: item.user.id,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            messageList: nextProps.messageList,
            User: nextProps.User
        })
    }

    render() {
        const messageList = this.state.messageList
        return (
            <View>
                <View>
                    {this._renderMessage(messageList)}
                </View>
            </View>
        )
    }
}

