import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  BackHandler,
} from 'react-native';

import {reqAllClass, reqAddProduct, reqUpdateProduct,reqUpdateJob,reqAddJob} from '../../api';
import {Icon, InputItem, List, Toast} from '@ant-design/react-native';
import Picker from 'react-native-picker';
import ImageWall from '../../utils/UpLoadImage';
import {connect} from 'react-redux';

class SendProduct extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {
        elevation: 0, //去除安卓手机header的样式
      },
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            backgroundColor: '#36B7AB',
            borderRadius: 15,
            marginRight: 15,
            width: 60,
            textAlign: 'center',
          }}
          onPress={() => navigation.state.params.navigatePress()}>
          <Text
            style={{
              color: '#FFFFFF',
              textAlign: 'center',
              textAlignVertical: 'center',
              height: 30,
            }}>
            发布
          </Text>
        </TouchableOpacity>
      ),
    };
  };

  state = {
    title: '',
    price: '',
    productText: '',
    mockData: [],
    pickerData: [],
    className: '',
    twoClassName: '',
    classId: '',
    ImageUrl: [],
    type: '',
    weixin: '',
  };

  createData = async () => {
    const result = await reqAllClass();
    let mockData1 = [];
    result.forEach(item => {
      let _firData = {};
      let secData = [];
      item.classify2List.forEach(item2 => {
        secData.push(item2.name);
      });
      let str = item.name;
      _firData[str] = secData;
      mockData1.push(_firData);
    });

    this.setState({
      pickerData: mockData1, //使用picker的数据源
      mockData: result, //旧数据源
    });
  };

  showDemoModal() {
    Keyboard.dismiss();
    Picker.init({
      pickerTitleText: '请选择商品分类',
      pickerCancelBtnText: '取消',
      pickerConfirmBtnText: '确定',
      pickerCancelBtnColor: [123, 123, 123, 1],
      pickerConfirmBtnColor: [45, 202, 150, 1],
      pickerData: this.state.pickerData,
      pickerBg: [255, 255, 255, 1],
      pickerFontColor: [45, 202, 150, 1],

      onPickerConfirm: data => {
        this.state.mockData.forEach(item => {
          item.classify2List.forEach(item2 => {
            if (item2.name === data[1] && item.name === data[0]) {
              this.setState({
                className: item.name,
                twoClassName: item2.name,
                classId: item2.id,
              });
            }
          });
        });
      },

      onPickerCancel: data => {
        //console.log(data);
      },
      onPickerSelect: data => {
        // console.log(data);
      },
    });

    Picker.show();
  }

  // 点击完成按钮
  saveProduct = async () => {
    const product = {};
    const type = this.props.navigation.getParam('type');
    const detail = this.props.navigation.getParam('detail');
    product.images = this.ImageWall?.state?.ImageUrl?.toString();
    product.name = this.state?.title;
    product.id = this.props.navigation?.getParam('detail')?.id;
    product.userid = this.props.User?.user?.id;
    product.classify2_id = detail.type == "1" ? this.state.classId : "2";
    product.intro = this.state.productText;
    product.weixin = this.state.weixin;
    product.price1 = this.state.price;
    product.type = this.state.type;
    if (
      !product.userid ||
      !product.name ||
      !product.price1 ||
      !product.intro ||
      !product.weixin
    ) {
      Toast.fail('不能为空');
    } else {
      const result =
        type === 'setting'
          ? this.state.type != "3" ? await reqUpdateProduct(product) : await reqUpdateJob(product)
          : this.state.type != "3" ? await reqAddProduct(product) : await reqAddJob(product)
      if (result.code === -1) {
        Toast.fail(result.msg, 1);
      } else {
        Toast.success('添加成功', 1);
        if (type === 'setting') {
          this.props.navigation.goBack();
          this.props.navigation.state.params.refresh();
        } else {
          this.props.navigation.navigate('Main');
        }
      }
    }
  };

  onBackAndroid = () => {
    Picker.hide();
  };

  SettingProduct = () => {
    const detail = this.props.navigation.getParam('detail');
    this.setState({
      ImageUrl: detail.images && detail.images.split(','),
      productText: detail.intro && detail.intro,
      title: detail.name && detail.name,
      weixin: detail.weixin && detail.weixin,
      type: detail.type,
      price: detail.price1 && detail.price1.toString(),
    });
  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    this.SettingProduct();
  }

  componentDidMount() {
    this.props.navigation.setParams({navigatePress: this.saveProduct});
    this.createData();
  }

  render() {
    return (
      <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
        <TextInput
          onFocus={() => Picker.hide()}
          onSubmitEditing={() => {
            this.titleTextInput.focus();
          }} //当软键盘的确定/提交按钮被按下的时候调用此函数
          multiline={true}
          returnKeyType="next"
          value={this.state.productText}
          placeholder={
            this.state.type == '1'
              ? '品牌，型号，几成新，入手渠道，转手原因...'
              : this.state.type == '2'
              ? '请输入帖子内容'
              : '请输入兼职信息'
          }
          style={{
            paddingLeft: 20,
            fontSize: 15,
            height: '22%',
            textAlignVertical: 'top',
          }}
          onChangeText={text =>
            this.setState({
              productText: text,
            })
          }
        />
        <ImageWall
          ref={ref => (this.ImageWall = ref)}
          ImageUrl={this.state.ImageUrl}
          site="/deal/goods"
        />
        <View style={{alignItems: 'center'}}>
          <List style={{width: '85%', paddingTop: 20}}>
            <InputItem
              onFocus={() => Picker.hide()}
              returnKeyType="next"
              ref={input => {
                this.titleTextInput = input;
              }}
              style={{paddingLeft: 15}}
              extra={
                <Text style={{fontSize: 13, color: '#778899'}}>{  this.state.type == '1'
                ? '吸引顾客'
                : this.state.type == '2'
                ? '帖子标题'
                : '兼职标题'}</Text>
              }
              value={this.state.title}
              onChange={value => {
                this.setState({
                  title: value,
                });
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="bulb" />
                <Text style={{marginLeft: 15, fontSize: 15}}>标题</Text>
              </View>
            </InputItem>
            {this.state.type == '1' && (
              <InputItem
                onFocus={() => Picker.hide()}
                returnKeyType="next"
                type="number"
                ref={input => {
                  this.priceTextInput = input;
                }}
                style={{paddingLeft: 15}}
                extra={
                  <Text style={{fontSize: 13, color: '#778899'}}>开个价</Text>
                }
                value={this.state.price}
                onChange={value => {
                  const newText = value.replace(/[^\d]+/, '');
                  this.setState({
                    price: newText,
                  });
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name="dollar" />
                  <Text style={{marginLeft: 15, fontSize: 15}}>价格</Text>
                </View>
              </InputItem>
            )}
            <InputItem
              onFocus={() => Picker.hide()}
              returnKeyType="next"
              type="number"
              ref={input => {
                this.priceTextInput = input;
              }}
              style={{paddingLeft: 15}}
              extra={
                <Text style={{fontSize: 13, color: '#778899'}}>方便联系</Text>
              }
              value={this.state.weixin}
              onChange={value => {
                this.setState({
                  weixin: value,
                });
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="dollar" />
                <Text style={{marginLeft: 15, fontSize: 15}}>微信</Text>
              </View>
            </InputItem>
            {this.state.type == '1' &&
              (this.props.navigation.getParam('type') === 'setting' ? (
                <View />
              ) : (
                <TouchableOpacity onPress={() => this.showDemoModal()}>
                  <Text
                    style={{
                      margin: 7,
                      fontSize: 15,
                    }}>
                    {this.state.className !== '' ? (
                      this.state.className + '/' + this.state.twoClassName
                    ) : (
                      <Text>请选择商品分类</Text>
                    )}
                  </Text>
                </TouchableOpacity>
              ))}
          </List>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  User: state.receiveUserData.User,
});

export default connect(mapStateToProps)(SendProduct);
