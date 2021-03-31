import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  Modal,
  TouchableHighlight,
  ToastAndroid,
  ScrollView,
  BackHandler,
} from 'react-native';
import {ImageViewer} from 'react-native-image-zoom-viewer';
import {Carousel} from '@ant-design/react-native';
import {EasyLoading, Loading} from '../../utils/Loading';
import ActionButton from 'react-native-action-button';
import CameraRoll from '@react-native-community/cameraroll';
import {Toast} from '@ant-design/react-native';
import {connect} from 'react-redux';
import {reqDeleteJob,reGetJobId} from '../../api';
const RNFS = require('react-native-fs'); //文件处理

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      images: [],
      isImageShow: false,
      index: 0,
      text: '',
      ImageVisible: false,
    };
  }

  Modal = () => {
    this.setState({
      ImageVisible: true,
    });
  };

  DetailImages = () => {
    const images = this.state.images;
    return (
      images &&
      images.map((item, index) => {
        return (
          <TouchableHighlight
            onPress={() => this._OpenImage(index)}
            key={index}>
            <View style={{height: 400}}>
              <Image
                source={{uri: item.url}}
                style={{width: '100%', height: '100%'}}
              />
            </View>
          </TouchableHighlight>
        );
      })
    );
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

  deleteJobs = async () => {
    const id = this.state.detail.id;
    const result = await reqDeleteJob(id);
    if (result.code === 0) {
      Toast.success('删除成功', 1);
      this.props.navigation.goBack();
    } else {
      Toast.fail(result.msg, 1);
    }
  }

  settingProduct =  () => {
    const detail = this.state.detail
    detail.type = "3"
    this.props.navigation.push('SendProduct', {
      type: 'setting',
      detail,
      refresh: () => {
        this.getDetail();
      },
    });
  }

  getDetail = async () => {
    EasyLoading.show('网速有点慢');
    // const userid = this.user.user === {} ? '' : this.user.user.id
    const id = this.goodsid;
    const result = await reGetJobId(id);
    const images = result.data.images?.split(',');
    const NewImages = images.map(item => ({
      url: item,
    }));
    this.setState({
      detail: result.data,
      images: NewImages,
    });
    EasyLoading.dismiss();
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
    const {images, detail} = this.state;
    const user = detail.user || {};
    console.log(detail)
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
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginLeft: 15,
                  marginTop: 10,
                }}>
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
                <View style={{flexDirection: 'row', padding: 10}}>
                  <Image
                    source={{uri: user.img}}
                    style={{width: 40, height: 40, borderRadius: 25}}
                  />
                  <Text style={{marginLeft: 10, paddingTop: 10}}>
                    {user.nickname}
                  </Text>
                </View>
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
                    创建于{detail.createTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {this.user?.user?.id == user?.id && (
          <ActionButton
            buttonColor="rgba(231,76,60,1)"
            position="right"
            verticalOrientation="up">
            <ActionButton.Item
              buttonColor="#3498db"
              onPress={() => this.settingProduct()}>
              <Text style={{color: '#FFFFFF'}}>管理</Text>
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#1abc9c"
              onPress={() => this.deleteJobs()}>
              <Text style={{color: '#FFFFFF'}}>删除</Text>
            </ActionButton.Item>
          </ActionButton>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => ({
  User: state.receiveUserData.User,
});

export default connect(mapStateToProps)(ProductDetail);
