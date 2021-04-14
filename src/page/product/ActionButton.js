import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import ActionButton from 'react-native-action-button';
import {Icon, Toast} from '@ant-design/react-native';
import {reqDeleteProduct, reqUpdateProduct} from '../../api';

export default class App extends Component {
  state = {
    ProductUserId: '',
    MyUserId: '',
    keyboard: false,
    detail: {},
  };

  settingProduct = () => {
    this.props.navigation.navigation.push('SendProduct', {
      type: 'setting',
      detail: this.state.detail,
      refresh: () => {
        this.props.getDetail();
      },
    });
  };

  UpOrDownProduct = async () => {
    const detail = this.state.detail;
    const product = {};
    product.id = detail.id;
    if (detail.state === 0) {
      this.setState({
        detail: {...detail, state: 1},
      });
      product.state = 1;
    } else {
      this.setState({
        detail: {...detail, state: 0},
      });
      product.state = 0;
    }
    const result = await reqUpdateProduct(product);
    if (result.code === 0) {
      Toast.success(detail.state === 1 ? '上架成功' : '下架成功', 1);
    } else {
      Toast.fail(result.msg, 1);
    }
  };

  hideButton = () => {
    this.props.HideButton(true, true, false);
  };

  detailProduct = async () => {
    const id = this.state.detail.id;
    const result = await reqDeleteProduct(id);
    if (result.code === 0) {
      Toast.success('删除成功', 1);
      this.props.navigation.navigation.goBack();
    } else {
      Toast.fail(result.msg, 1);
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      ProductUserId: nextProps.productDetai.user.id,
      MyUserId: nextProps.MyUserid.user.id,
      detail: nextProps.productDetai,
      keyboard: nextProps.keyboard,
    });
  }

  render() {
    const {ProductUserId, MyUserId, keyboard, detail} = this.state;
    return keyboard === false ? (
      
        ProductUserId === MyUserId ? (
          <ActionButton
            buttonColor="rgba(231,76,60,1)"
            position="right"
            verticalOrientation="up">
            <ActionButton.Item
              buttonColor="#9b59b6"
              onPress={() => this.hideButton()}>
              <Text style={{color: '#FFFFFF'}}>留言</Text>
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#3498db"
              onPress={() => this.settingProduct()}>
              <Text style={{color: '#FFFFFF'}}>管理</Text>
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#1abc9c"
              onPress={() => this.detailProduct()}>
              <Text style={{color: '#FFFFFF'}}>删除</Text>
            </ActionButton.Item>
            {
              detail.type == "1" &&  <ActionButton.Item
              buttonColor="#1abc9c"
              onPress={() => this.UpOrDownProduct()}>
              <Text style={{color: '#FFFFFF'}}>
                {detail.state === 0 ? '下架' : '上架'}
              </Text>
            </ActionButton.Item> 
            }
           
          </ActionButton>
        ) : (
          <ActionButton
            buttonColor="#36B7AB"
            onPress={() => this.hideButton()}
            renderIcon={() => (
              <View>
                <Image
                  source={require('../../../android/app/src/main/res/drawable-hdpi/message.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={{color: '#FFFFFF'}}>留言</Text>
              </View>
            )}
          />
        )
      ) : (
      <View />
    );
  }
}
