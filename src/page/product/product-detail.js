import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    StatusBar,
    Modal,
    TouchableHighlight,
    ToastAndroid,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native'
import {reqIdDetail} from '../../api/index'
import {ImageViewer} from 'react-native-image-zoom-viewer'
import {Carousel, Icon, Toast, Grid} from '@ant-design/react-native'
import ActionButton from 'react-native-action-button'

const RNFS = require('react-native-fs'); //文件处理
import CameraRoll from "@react-native-community/cameraroll";
import axios from "axios";


export default class ProductDetail extends Component {

    state = {
        detail: {},
        images: [],
        messageList: [],
        isImageShow: false,
        index: 0,
        keyboard: false,
        text: '',
        replay:false,
        comment:false,
        commentItem : {}
    }

    getDetail = async () => {
        const id = this.props.navigation.getParam('ProductId')
        const userid = this.props.navigation.getParam('UserId')
        const result = await reqIdDetail(id, userid)
        const commentList = result.commentList
        const images = result.images.split(',')
        const NewImages = images.map(item => ({
            url: item
        }))
        this.setState({
            detail: result,
            images: NewImages,
            messageList: commentList,
        })
    }

    DetailImages = () => {
        const images = this.state.images || []
        return images.map((item, index) => {
            return (
                <TouchableHighlight onPress={() => this._OpenImage(index)}>
                    <View style={{height: 400}}>
                        <Image
                            source={{uri: item.url}}
                            style={{width: '100%', height: '100%'}}
                        />
                    </View>
                </TouchableHighlight>
            )
        })
    }

    _OpenImage = (index) => {
        this.setState({
            isImageShow: true,
            index
        }, () => {
            StatusBar.setTranslucent(false)
            StatusBar.setBackgroundColor('#FFFFFF')
        })
    }

    savePhoto = (url) => {
        this.androidDownPath = `${RNFS.DocumentDirectoryPath}/${((Math.random() * 1000) | 0)}.jpg`;
        if (Platform.OS === 'ios') {  //ios图片保存
            let promise = CameraRoll.saveToCameraRoll(url);
            promise.then(function (result) {
                alert("已保存到系统相册")
            }).catch(function (error) {
                alert('保存失败！\n' + error);
            });
        } else {  //Android  先下载到本地
            let DownloadFileOptions = {
                fromUrl: url,          //下载路径
                toFile: this.androidDownPath    // Local filesystem path to save the file to
            }
            let result = RNFS.downloadFile(DownloadFileOptions);
            let _this = this;
            result.promise.then(function (val) {
                    console.log("文件保存成功：" + _this.androidDownPath)
                    let promise = CameraRoll.saveToCameraRoll(_this.androidDownPath);
                    promise.then(function (result) {
                        // console.error(JSON.stringify(result))
                        ToastAndroid.show("保存成功", ToastAndroid.SHORT);
                    }).catch(function (error) {
                        alert('保存失败！\n' + error);
                    });

                }, function (val) {
                    console.log('Error Result:' + JSON.stringify(val));
                }
            ).catch(function (error) {
                console.log(error.message);
            });
        }
    }

    Heart = async () => {
        const code = this.state.detail.code
        const userId = this.props.navigation.getParam('UserId')
        const Token = this.props.navigation.getParam('UserToken')
        const goodsId = this.state.detail.id
        axios.post('http://39.106.188.22:8800/api/token/collect/save', {userId, goodsId}, {
            params: {
                token: Token
            }
        })
            .then(response => {
                if (response.data.code === -1) {
                    Toast.fail('请先登录', 1)
                } else {
                    if (code === false) {
                        this.heart.setNativeProps({
                            style: {
                                tintColor: 'red'
                            }
                        })
                        this.setState({
                            detail: {...this.state.detail, code: true}
                        })
                    } else {
                        this.heart.setNativeProps({
                            style: {
                                tintColor: 'black'
                            }
                        })
                        this.setState({
                            detail: {...this.state.detail, code: false}
                        })
                    }
                }
            })
            .catch(err => console.warn(err));
    }

    LikeComment = (comment) => {
        const Token = this.props.navigation.getParam('UserToken')
        const userId = this.props.navigation.getParam('UserId')
        const type = comment.leaf === null ? 'comment' + ':' + comment.commentid + ':' + userId : 'reply' + ':' + comment.id + ':' + userId
        const state = comment.state === null ? '1' : '0'
        axios.post('http://39.106.188.22:8800/api/token/like/save', {type, state}, {
            params: {
                token: Token
            }
        })
            .then(response => {
                if (userId === '') {
                    Toast.fail('请先登录', 1)
                } else {
                    if (comment.state === null) {
                        this.Likecomment[comment.leaf === null ? comment.commentid : comment.id].setNativeProps({
                            style: {
                                tintColor: 'red'
                            }
                        })
                        comment.state = 1
                    } else {
                        this.Likecomment[comment.leaf === null ? comment.commentid : comment.id].setNativeProps({
                            style: {
                                tintColor: 'black'
                            }
                        })
                        comment.state = null
                    }
                }
            })
            .catch(err => console.warn(err));
    }

    _renderMessage = (MessageList) => {
        return MessageList.map((item, index) => {
            if (!item.replyList) {
                return (
                    <View
                        style={{marginLeft: item.leaf === null ? '5%' : '0%'}}
                        key={item.leaf === null ? item.commentid : item.id}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{borderBottomWidth: 0.8, borderColor: '#F5F5F5'}}
                            onPress={() => this.replayComment(item)}
                        >
                            <View style={{flexDirection: 'row'}}>
                                <Image source={{uri: item.user.img}}
                                       style={{width: 35, height: 35, borderRadius: 20, marginLeft: 10}}/>
                                <Text style={{
                                    paddingTop: 10,
                                    marginLeft: 10,
                                    fontWeight: 'bold'
                                }}>{item.user.nickname}</Text>
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    style={{marginRight: 10}}
                                    onPress={() => this.LikeComment(item)}
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
                                        source={require('../../../resources/images/点赞.png')}
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
                    <View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{borderBottomWidth: 0.8, borderColor: '#F5F5F5'}}
                            onPress={() => this.replayComment(item)}
                        >
                            <View style={{flexDirection: 'row'}}>
                                <Image source={{uri: item.user.img}}
                                       style={{
                                           width: 35,
                                           height: 35,
                                           borderRadius: 20,
                                           marginLeft: 10,
                                           marginTop: 10,
                                       }}/>
                                <Text style={{
                                    paddingTop: 10,
                                    marginLeft: 10,
                                    fontWeight: 'bold',
                                }}>
                                    {item.user.nickname}
                                </Text>
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    style={{marginRight: 10}}
                                    onPress={() => this.LikeComment(item)}
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
                                        source={require('../../../resources/images/点赞.png')}
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

    sendComment = () => {
        if(this.state.comment){
            const content = this.state.text
            const userid = this.props.navigation.getParam('UserId')
            const goodsid = this.props.navigation.getParam('ProductId')
            const Token = this.props.navigation.getParam('UserToken')
            axios.post('http://39.106.188.22:8800/api/token/comment/save', {content, userid, goodsid}, {
                params: {
                    token: Token
                }
            })
                .then(response => {
                    if (userid === '') {
                        Toast.fail('请先登录', 1)
                    } else {
                        if (response.data.code === 0) {
                            this.getDetail()
                            this.setState({
                                keyboard: false,
                            })
                        }
                    }
                })
                .catch(err => console.warn(err));
        } else if(this.state.replay){
            const item = this.state.commentItem
            const userId = this.props.navigation.getParam('UserId')
            const Token = this.props.navigation.getParam('UserToken')
            const userid = this.props.navigation.getParam('UserId')
            const commentid = item.commentid
            const goodsid = item.goodsid
            const nameid = item.user.id
            const leaf = item.leaf === null ? '0' : item.id
            const parentname = item.user.nickname
            const content = this.state.text
            axios.post('http://39.106.188.22:8800/api/token/reply/save', {content, userid, commentid, goodsid, nameid, leaf, parentname}, {
                params: {
                    token: Token
                }
            })
                .then(response => {
                    if (userId === '') {
                        Toast.fail('请先登录', 1)
                    } else {
                        if (response.data.code === 0) {
                            this.getDetail()
                            this.setState({
                                keyboard: false,
                            })
                        } else {
                            Toast.fail('回复失败',1)
                        }
                    }
                })
                .catch(err => console.warn(err));
        }
    }

    replayComment = (item) => {
        this.setState({
            keyboard: true,
            replay:true,
            commentItem : item
        })
    }

    componentDidMount() {
        this.getDetail()
    }

    componentWillMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor('rgba(0, 0, 0, 0)')
        })
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        const {images, messageList} = this.state
        const detail = this.state.detail || ''
        const user = detail.user || ''
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{backgroundColor: '#F5F5F5'}}>
                    {
                        this.state.isImageShow ?
                            <Modal
                                visible={true}
                                transparent={true}
                                animationType='fade'
                                onRequestClose={() => {
                                    this.setState({
                                        isImageShow: false,
                                    }, () => {
                                        StatusBar.setTranslucent(true)
                                        StatusBar.setBackgroundColor('rgba(0, 0, 0, 0)')
                                    });
                                }}>
                                <ImageViewer
                                    imageUrls={images}
                                    index={this.state.index}
                                    menuContext={{"saveToLocal": "保存图片", "cancel": "取消"}}
                                    onClick={() => this.setState({
                                        isImageShow: false
                                    }, () => {
                                        StatusBar.setTranslucent(true)
                                        StatusBar.setBackgroundColor('rgba(0, 0, 0, 0)')
                                    })}
                                    onSave={(url) => {
                                        this.savePhoto(url)
                                    }}
                                />
                            </Modal> : null
                    }
                    <View>
                        <Carousel>
                            {this.DetailImages()}
                        </Carousel>
                        <View style={{backgroundColor: '#FFFFFF'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Text style={{fontSize: 15, color: 'red', margin: 15}}>
                                    ￥<Text style={{fontSize: 20}}>{detail.price1}</Text>
                                </Text>
                                <View style={{flex: 1}}/>
                                <TouchableOpacity onPress={() => this.Heart()}>
                                    <Image
                                        ref={(ref) => this.heart = ref}
                                        source={require('../../../resources/images/收藏.png')}
                                        style={{
                                            marginRight: 5,
                                            width: 20,
                                            height: 20,
                                            tintColor: this.state.detail.code === true ? 'red' : 'black'
                                        }}
                                    />
                                </TouchableOpacity>
                                <Text style={{marginRight: 15}}>
                                    {this.state.detail.code === true ? <Text>取消收藏</Text> : <Text>收藏</Text>}
                                </Text>
                            </View>
                            <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 15}}>{detail.name}</Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    fontSize: 15,
                                    color: '#778899',
                                    marginLeft: 15,
                                    marginBottom: 10
                                }}>{detail.intro}</Text>
                        </View>
                        <View style={{backgroundColor: '#FFFFFF', marginTop: 10}}>
                            <View>
                                <View style={{flexDirection: 'row', padding: 10}}>
                                    <Image
                                        source={{uri: user.img}}
                                        style={{width: 40, height: 40, borderRadius: 25}}
                                    />
                                    <Text style={{marginLeft: 10, paddingTop: 10}}>{user.nickname}</Text>
                                </View>
                                <View style={{flexDirection: 'row', padding: 10}}>
                                    <Icon name='environment' style={{color: '#36B7AB'}}/>
                                    <Text style={{paddingLeft: 10}}>西安欧亚学院</Text>
                                </View>
                                <View style={{flexDirection: 'row', padding: 10}}>
                                    <Icon name='wechat' style={{color: '#36B7AB'}}/>
                                    <Text style={{paddingLeft: 10}}>{detail.weixin}</Text>
                                </View>
                                <View style={{flexDirection: 'row', padding: 10}}>
                                    <Icon name='phone' style={{color: '#36B7AB'}}/>
                                    <Text style={{paddingLeft: 10}}>{user.phone}</Text>
                                </View>
                                <View style={{flexDirection: 'row', padding: 10}}>
                                    <Icon name='clock-circle' style={{color: '#36B7AB'}}/>
                                    <Text style={{paddingLeft: 10}}>创建于{detail.create_time}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{backgroundColor: '#FFFFFF', marginTop: 10}}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 15,
                                    margin: '3%'
                                }}>全部留言&nbsp;&nbsp;x&nbsp;{this.state.detail.commentNum}
                            </Text>
                            <View>
                                {this._renderMessage(messageList)}
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {
                    this.state.keyboard === false ?
                        <ActionButton
                            buttonColor="#36B7AB"
                            onPress={() => {
                                this.setState({
                                    keyboard: true,
                                    comment:true
                                })
                            }}
                            renderIcon={() => (<View><Icon name="form" style={{padding: 2, color: '#FFFFFF'}}/>
                                <Text style={{color: '#FFFFFF'}}>留言</Text>
                            </View>)}
                        /> : <View/>
                }

                {this.state.keyboard === true ?
                    <View style={{backgroundColor: '#FFFFFF', flexDirection: 'row'}}>
                        <View style={{margin: 8}}>
                            <Image source={{uri: this.props.navigation.getParam('UserImage')}} style={{width: 30, height: 30}}/>
                        </View>
                        <TextInput
                            style={{
                                width: '70%',
                                backgroundColor: '#F5F5F5',
                                borderRadius: 15,
                                height: 38,
                                margin: 5,
                                paddingLeft: 13,
                            }}
                            onChangeText={(text) =>
                                this.setState({
                                    text
                                })
                            }
                            autoFocus={true}
                            placeholder='你想说什么，告诉我吧！'
                            onBlur={() => this.setState({
                                keyboard: false,
                            })}
                        />
                        <TouchableOpacity onPress={() => this.sendComment()}
                                          style={{
                                              backgroundColor: '#36B7AB',
                                              height: 25,
                                              width: 50,
                                              margin: 5,
                                              alignItems: 'center',
                                              marginTop: 10
                                          }}
                        >
                            <Text style={{color: '#FFFFFF'}}>发送</Text>
                        </TouchableOpacity>
                    </View>
                    : <View/>}
            </View>
        )
    }
}
