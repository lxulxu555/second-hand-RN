import React, {Component} from 'react';
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
  BackHandler,
} from 'react-native';
import {
  reqIdDetail,
  reqLikeProduct,
  reqSendComment,
  reqSendReplay,
} from '../../api/index';
import {ImageViewer} from 'react-native-image-zoom-viewer';
import {Carousel, Icon, Toast} from '@ant-design/react-native';
import {EasyLoading, Loading} from '../../utils/Loading';
import CameraRoll from '@react-native-community/cameraroll';
import Replay from './replay';
import ActionButton from './ActionButton';
import {connect} from 'react-redux';

const RNFS = require('react-native-fs'); //文件处理

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      images: [],
      messageList: [],
      isImageShow: false,
      index: 0,
      keyboard: false,
      text: '',
      replay: false,
      comment: false,
      commentItem: {},
      ImageVisible: false,
      type: '',
    };
  }

  Modal = () => {
    this.setState({
      ImageVisible: true,
    });
  };

  getDetail = async () => {
    EasyLoading.show('网速有点慢');
    // const userid = this.user.user === {} ? '' : this.user.user.id
    const userid = this.user.user.id;
    const goodsid = this.goodsid;
    const result = await reqIdDetail(goodsid, userid);
    const commentList = result.commentList;
    const images = result.images?.split(',');
    const NewImages = images.map(item => ({
      url: item,
    }));
    this.setState({
      detail: result,
      images: NewImages,
      messageList: commentList,
      type: result.type,
    });
    EasyLoading.dismiss();
  };

  DetailImages = () => {
    const images = this.state.images
    return images && images.map((item, index) => {
      return (
        <TouchableHighlight onPress={() => this._OpenImage(index)} key={index}>
          <View style={{height: 400}}>
            <Image
              source={{uri: item.url}}
              style={{width: '100%', height: '100%'}}
            />
          </View>
        </TouchableHighlight>
      );
    });
  };

  _OpenImage = index => {
    this.setState(
      {
        isImageShow: true,
        index,
      },
      () => {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor('#FFFFFF');
      },
    );
  };

  savePhoto = url => {
    this.androidDownPath = `${RNFS.DocumentDirectoryPath}/${(Math.random() *
      1000) |
      0}.jpg`;
    if (Platform.OS === 'ios') {
      //ios图片保存
      let promise = CameraRoll.saveToCameraRoll(url);
      promise
        .then(function(result) {
          alert('已保存到系统相册');
        })
        .catch(function(error) {
          alert('保存失败！\n' + error);
        });
    } else {
      //Android  先下载到本地
      let DownloadFileOptions = {
        fromUrl: url, //下载路径
        toFile: this.androidDownPath, // Local filesystem path to save the file to
      };
      let result = RNFS.downloadFile(DownloadFileOptions);
      let _this = this;
      result.promise
        .then(
          function(val) {
            console.log('文件保存成功：' + _this.androidDownPath);
            let promise = CameraRoll.saveToCameraRoll(_this.androidDownPath);
            promise
              .then(function(result) {
                // console.error(JSON.stringify(result))
                ToastAndroid.show('保存成功', ToastAndroid.SHORT);
              })
              .catch(function(error) {
                alert('保存失败！\n' + error);
              });
          },
          function(val) {
            console.log('Error Result:' + JSON.stringify(val));
          },
        )
        .catch(function(error) {
          console.log(error.message);
        });
    }
  };

  Heart = async () => {
    const code = this.state.detail.code;
    const Token = this.user.token;
    const goodsId = this.state.detail.id;
    const userId = this.user.user.id;
    const type = 1;
    EasyLoading.show('网速有点慢');
    const result = await reqLikeProduct(userId, goodsId, type, Token);
    if (result.code === 0) {
      if (!userId) {
        Toast.fail('请先登录', 1);
      } else {
        if (code === false) {
          this.heart.setNativeProps({
            style: {
              tintColor: 'red',
            },
          });
          this.setState({
            detail: {...this.state.detail, code: true},
          });
        } else {
          this.heart.setNativeProps({
            style: {
              tintColor: 'black',
            },
          });
          this.setState({
            detail: {...this.state.detail, code: false},
          });
        }
      }
    } else {
      Toast.fail(result.msg, '1');
    }
    EasyLoading.dismiss()
  };

  sendComment = async () => {
    if (this.state.comment) {
      const content = this.state.text;
      const goodsid = this.goodsid;
      const userid = this.user.user.id;
      const type = 1;
      const result = await reqSendComment(
        content,
        userid,
        goodsid,
        type,
        this.user.token,
      );
      if (result.code === 0) {
        this.getDetail();
        this.setState({
          keyboard: false,
        });
      }
    } else if (this.state.replay) {
      const replay = {};
      const item = this.state.commentItem;
      replay.userid = this.user.user.id;
      replay.commentid = item.commentid;
      replay.goodsid = item.goodsid;
      replay.nameid = item.user.id;
      replay.leaf = item.leaf === null ? '0' : item.id;
      replay.parentname = item.user.nickname;
      replay.content = this.state.text;
      replay.type = 1;
      const result = await reqSendReplay(replay, this.user.token);
      if (result.code === 0) {
        this.getDetail();
        this.setState({
          keyboard: false,
        });
      } else {
        Toast.fail('回复失败', 1);
      }
    }
  };

  ReplayComment = (keyboard, replay, comment, commentItem) => {
    this.setState({
      keyboard,
      replay,
      comment,
      commentItem,
    });
  };

  HideButton = (keyboard, comment, replay) => {
    this.setState({
      keyboard,
      comment,
      replay,
    });
  };

  componentDidMount() {
    this.user = this.props.User;
    this.goodsid = this.props.navigation.getParam('ProductId');
    this.getDetail();
  }

  componentWillMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0)');
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    this._navListener.remove();
  }

  render() {
    const {images, messageList, detail, type} = this.state;
    const user = detail.user || {};
    return (
      <View style={{flex: 1}}>
        <Loading />
        <ScrollView style={{backgroundColor: '#F5F5F5'}}>
          {this.state.isImageShow ? (
            <Modal
              visible={true}
              transparent={true}
              animationType="fade"
              onRequestClose={() => {
                this.setState(
                  {
                    isImageShow: false,
                  },
                  () => {
                    StatusBar.setTranslucent(true);
                    StatusBar.setBackgroundColor('rgba(0, 0, 0, 0)');
                  },
                );
              }}>
              <ImageViewer
                imageUrls={images}
                index={this.state.index}
                menuContext={{saveToLocal: '保存图片', cancel: '取消'}}
                onClick={() =>
                  this.setState(
                    {
                      isImageShow: false,
                    },
                    () => {
                      StatusBar.setTranslucent(true);
                      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0)');
                    },
                  )
                }
                onSave={url => {
                  this.savePhoto(url);
                }}
              />
            </Modal>
          ) : null}
          <View>
            <Carousel>{this.DetailImages()}</Carousel>
            <View style={{backgroundColor: '#FFFFFF'}}>
              {type == '1' && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 15, color: 'red', margin: 15}}>
                    ￥<Text style={{fontSize: 20}}>{detail.price1}</Text>
                  </Text>
                  <View style={{flex: 1}} />
                  <TouchableOpacity onPress={() => this.Heart()}>
                    <Image
                      ref={ref => (this.heart = ref)}
                      source={require('../../../android/app/src/main/res/drawable-hdpi/collect.png')}
                      style={{
                        marginRight: 5,
                        width: 20,
                        height: 20,
                        tintColor:
                          this.state.detail.code === true ? 'red' : 'black',
                      }}
                    />
                  </TouchableOpacity>
                  <Text style={{marginRight: 15}}>
                    {this.state.detail.code === true ? (
                      <Text>取消收藏</Text>
                    ) : (
                      <Text>收藏</Text>
                    )}
                  </Text>
                </View>
              )}

              <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 15,marginTop:10}}>
                {detail.name}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  fontSize: 15,
                  color: '#778899',
                  marginLeft: 15,
                  marginBottom: 10,
                }}>
                {detail.intro}
              </Text>
            </View>
            <View style={{backgroundColor: '#FFFFFF', marginTop: 10}}>
              <View>
                <TouchableOpacity
                  style={{flexDirection: 'row', padding: 10}}
                  onPress={() => this.Replay.goMyUser(detail)}>
                  <Image
                    source={{uri: user.img}}
                    style={{width: 40, height: 40, borderRadius: 25}}
                  />
                  <Text style={{marginLeft: 10, paddingTop: 10}}>
                    {user.nickname}
                  </Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', padding: 10}}>
                  <Image
                    source={require('../../../android/app/src/main/res/drawable-hdpi/email.png')}
                    style={{width: 20, height: 20}}
                  />
                  <Text style={{paddingLeft: 10}}>{user.email}</Text>
                </View>
                 <View style={{flexDirection: 'row', padding: 10}}>
                  <Image
                    source={require('../../../android/app/src/main/res/drawable-hdpi/wechat.png')}
                    style={{width: 20, height: 20}}
                  />
                  <Text style={{paddingLeft: 10}}>{detail.weixin}</Text>
                </View> 
                <View style={{flexDirection: 'row', padding: 10}}>
                  <Image
                    source={require('../../../android/app/src/main/res/drawable-hdpi/phone.png')}
                    style={{width: 20, height: 20}}
                  />
                  <Text style={{paddingLeft: 10}}>{user.phone}</Text>
                </View>
                <View style={{flexDirection: 'row', padding: 10}}>
                <Image
                    source={require('../../../android/app/src/main/res/drawable-hdpi/time.png')}
                    style={{width: 20, height: 20}}
                  />
                  <Text style={{paddingLeft: 10}}>
                    创建于{detail.create_time}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{backgroundColor: '#FFFFFF', marginTop: 10}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 15,
                  margin: '3%',
                }}>
                全部留言&nbsp;&nbsp;x&nbsp;{this.state.detail.commentNum}
              </Text>
              <Replay
                ref={ref => (this.Replay = ref)}
                messageList={messageList}
                User={this.user}
                ReplayComment={this.ReplayComment}
                navigation={this.props}
              />
            </View>
          </View>
        </ScrollView>

        <ActionButton
          MyUserid={this.user}
          productDetai={detail}
          HideButton={this.HideButton}
          getDetail={this.getDetail}
          navigation={this.props}
          keyboard={this.state.keyboard}
        />

        {this.state.keyboard === true ? (
          <View style={{backgroundColor: '#FFFFFF', flexDirection: 'row'}}>
            <View style={{margin: 8}}>
              <Image
                source={{uri: this.user.user.img}}
                style={{width: 30, height: 30}}
              />
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
              onChangeText={text =>
                this.setState({
                  text,
                })
              }
              autoFocus={true}
              placeholder="你想说什么，告诉我吧！"
              onBlur={() =>
                this.setState({
                  keyboard: false,
                })
              }
            />
            <TouchableOpacity
              onPress={() => this.sendComment()}
              style={{
                backgroundColor: '#36B7AB',
                width: 50,
                height: 30,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  height: 30,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}>
                发送
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  }
}
const mapStateToProps = state => ({
  User: state.receiveUserData.User,
});

export default connect(mapStateToProps)(ProductDetail);
