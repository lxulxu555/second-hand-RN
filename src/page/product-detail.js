import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    StatusBar,
    Modal,
    TouchableHighlight,
    ToastAndroid,
    TouchableOpacity
} from 'react-native'
import {reqIdDetail} from '../api'
import {ImageViewer} from 'react-native-image-zoom-viewer'
import {Carousel, Icon, SearchBar} from '@ant-design/react-native'

const RNFS = require('react-native-fs'); //文件处理
import CameraRoll from "@react-native-community/cameraroll";
let click = false

export default class ProductDetail extends Component {

    state = {
        detail: [],
        images: [],
        isImageShow: false,
        index: 0,
    }

    getDetail = async () => {
        const id = this.props.navigation.getParam('ProductId')
        const userid = 15
        const result = await reqIdDetail(id, userid)
        const images = result.images.split(',')
        const NewImages = images.map(item => ({
            url: item
        }))
        this.setState({
            detail: result,
            images: NewImages
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

    Heart = () => {
        if(click === false){
            this.heart.setNativeProps({
                style: {
                    tintColor:  'red'
                }
            })
            click = true
        }else if(click === true){
            this.heart.setNativeProps({
                style: {
                    tintColor: 'black'
                }
            })
            click = false
        }
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
        const {images} = this.state
        const detail = this.state.detail || ''
        const user = detail.user || ''
        return (
            <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
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
                            <Text style={{fontSize: 15, color: 'red', margin: 15, flex: 4}}>
                                ￥<Text style={{fontSize: 20}}>{detail.price1}</Text>
                            </Text>
                            <TouchableOpacity onPress={() => this.Heart()}>
                                <Image
                                    ref={(ref) => this.heart = ref}
                                    source={require('../../resources/images/收藏.png')}
                                    style={{marginRight: 5, width: 20, height: 20,}}
                                />
                            </TouchableOpacity>
                            <Text style={{flex: 1}}>
                                <Text>收藏</Text>
                            </Text>
                        </View>
                        <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 15}}>{detail.name}</Text>
                        <Text
                            style={{marginTop: 5, fontSize: 15, color: '#778899', marginLeft: 15}}>{detail.intro}</Text>
                    </View>
                    <View style={{backgroundColor: '#FFFFFF', marginTop: 10}}>
                        <View>
                            <View style={{flexDirection: 'row', padding: 10}}>
                                <Image
                                    source={{uri: user.img}}
                                    style={{width: 40, height: 40, borderRadius: 25}}
                                />
                                <Text style={{marginLeft: 10, paddingTop: 10}}>{user.username}</Text>
                            </View>
                            <Text>
                                西安欧亚学院
                            </Text>
                            <Text>{detail.weixin}</Text>
                            <Text>{user.phone}</Text>
                            <Text>{detail.create_time}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
