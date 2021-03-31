import React, {Component} from 'react';
import Home from './src/page/home/home';
import User from './src/page/user/user';
import {Provider} from '@ant-design/react-native';
import ClassiFication from './src/page/classification';

import {createAppContainer} from 'react-navigation';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {
  PermissionsAndroid,
  View,
  Text,
  DeviceEventEmitter,
  Image,
  TouchableOpacity,
} from 'react-native';
import ProductDetail from './src/page/product/product-detail';
import JobDetail from './src/page/home/jbo-detail';
import WantBuy from './src/page/home/want-buy';
import HotNews from './src/page/home/hot-news';
import Job from './src/page/home/job';
import OneClassDetail from './src/page/home/one-class-detail';
import Setting from './src/page/user/setting';
import Login from './src/page/user/login';
import SendProduct from './src/page/user/send-product';
import MyUser from './src/page/user/my-user';
import Register from './src/page/user/register';
import Mycollect from './src/page/user/my-collect';
import UpdateUser from './src/page/user/update-user';
import Nickname from './src/page/user/nick-name';
import ForGetPwd from './src/page/user/forget-pwd';
import SendWantBuy from './src/page/user/send-want-buy';
import LikeUser from './src/page/user/like-user';
import AboutMyUser from './src/page/user/about-myuser';

let that;
let msg = 3;

const TabNavigator = createBottomTabNavigator(
  {
    Main: {
      screen: Home,
      navigationOptions: ({navigation}) => {
        return {
          tabBarLabel: '首页',
          tabBarIcon: ({focused}) => {
            return focused ? (
              <Image
                source={require('./android/app/src/main/res/drawable-hdpi/homeselected.png')}
                style={{width: 25, height: 25}}
              />
            ) : (
              <Image
                source={require('./android/app/src/main/res/drawable-hdpi/home.png')}
                style={{width: 25, height: 25}}
              />
            );
          },
        };
      },
    },
    ClassiFication: {
      screen: ClassiFication,
      navigationOptions: {
        // 底部导航
        tabBarLabel: '分类',
        tabBarIcon: ({focused}) => {
          return focused ? (
            <Image
              source={require('./android/app/src/main/res/drawable-hdpi/classifyselected.png')}
              style={{width: 25, height: 25}}
            />
          ) : (
            <Image
              source={require('./android/app/src/main/res/drawable-hdpi/classify.png')}
              style={{width: 25, height: 25}}
            />
          );
        },
      },
    },
    User: {
      screen: User,
      navigationOptions: ({navigation}) => {
        return {
          // 底部导航
          tabBarLabel: '个人中心',
          tabBarIcon: ({focused}) => {
            let msg = that.state.msg;
            let icon = !!focused;
            return (
              <View>
                {msg > 0 ? (
                  <View
                    style={{
                      width: 13,
                      height: 13,
                      justifyContent: 'center',
                      position: 'absolute',
                      zIndex: 9,
                      backgroundColor: '#FB3768',
                      borderRadius: 6,
                      right: 0,
                      top: -2,
                    }}>
                    <Text
                      style={[
                        {fontSize: 10, color: '#fff', textAlign: 'center'},
                      ]}>
                      {msg}
                    </Text>
                  </View>
                ) : null}
                {icon === true ? (
                  <Image
                    source={{uri: that.state.url}}
                    style={{width: 34, height: 30, borderRadius: 15}}
                  />
                ) : (
                  <Image
                    source={require('./android/app/src/main/res/drawable-hdpi/user.png')}
                    style={{width: 25, height: 25}}
                  />
                )}
              </View>
            );
          },
        };
      },
    },
  },
  {
    navigationOptions: ({navigation}) => {
      const optisns = {};
      const {routeName} = navigation.state.routes[navigation.state.index];
      if (routeName === 'Main') {
        optisns.header = null;
        return optisns;
      } else if (routeName === 'ClassiFication') {
        return {
          title: '分类',
        };
      } else if (routeName === 'User') {
        return {
          headerTransparent: true, // 背景透明
          title: null,
          headerRight: (
            <TouchableOpacity onPress={() => navigation.push('Setting')}>
              <Image
                source={require('./android/app/src/main/res/drawable-hdpi/setting.png')}
                style={{width: 25, height: 25, marginRight: 20}}
              />
            </TouchableOpacity>
          ),
        };
      }
    },
    defaultNavigationOptions: ({navigation}) => {
      const {routes} = navigation.state;
      let flat = true;
      if (routes && routes.length > 1) {
        flat = false;
      }
      return {
        tabBarVisible: flat,
      };
    },
  },
  {
    initialRouteName: 'Main',
    tabBarOptions: {
      activeTintColor: 'gold',
      inactiveTintColor: 'gray',
      style: {
        height: 50,
      },
    },
  },
);

const AppStackNavigation = createStackNavigator(
  {
    Homes: {
      screen: TabNavigator,
    },
    ProductDetail: {
      screen: ProductDetail,
      navigationOptions: {
        headerTransparent: true, // 背景透明
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
        headerTintColor: '#36B7AB',
      },
    },
    JobDetail: {
      screen: JobDetail,
      navigationOptions: {
        headerTransparent: true, // 背景透明
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
        headerTintColor: '#36B7AB',
      },
    },
    WantBuy: {
      screen: WantBuy,
    },
    Job: {
      screen: Job,
    },
    HotNews: {
      screen: HotNews,
    },
    OneClassDetail: {
      screen: OneClassDetail,
    },
    Setting: {
      screen: Setting,
    },
    Login: {
      screen: Login,
    },
    SendProduct: {
      screen: SendProduct,
    },
    MyUser: {
      screen: MyUser,
      navigationOptions: {
        headerTransparent: true, // 背景透明
        headerTintColor: '#36B7AB',
      },
    },
    Register: {
      screen: Register,
    },
    Mycollect: {
      screen: Mycollect,
      navigationOptions: {
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
        title: '我收藏的',
      },
    },
    UpdateUser: {
      screen: UpdateUser,
      navigationOptions: {
        title: '我的资料',
      },
    },
    Nickname: {
      screen: Nickname,
    },
    ForGetPwd: {
      screen: ForGetPwd,
    },
    SendWantBuy: {
      screen: SendWantBuy,
      navigationOptions: {
        title: '发布求购',
      },
    },
    LikeUser: {
      screen: LikeUser,
    },
    AboutMyUser: {
      screen: AboutMyUser,
      navigationOptions: {
        title: '消息',
      },
    },
  },
  {
    defaultNavigationOptions: {
      title: null,
      headerStyle: {
        elevation: 0, //去除安卓手机header的样式
      },
    },
    headerLayoutPreset: 'center', //将标题居中
  },
);

const AppContainer = createAppContainer(AppStackNavigation);

export default class App extends Component {
  constructor(props) {
    super(props);
    that = this;
    this.state = {
      url: '',
      msg: '',
    };
  }

  //获取保存图片到相册权限
  requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'My App Storage Permission',
          message:
            'My App needs access to your storage ' +
            'so you can save your photos',
        },
      );
      return granted;
    } catch (err) {
      console.error('Failed to request permission ', err);
      return null;
    }
  };
  //获取相机权限
  requestCarmeraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message:
            'the project needs access to your camera ' +
            'so you can take awesome pictures.',
        },
      );
      return granted;
    } catch (err) {
      console.error('Failed to request permission ', err);
      return null;
    }
  };

  componentDidMount() {
    DeviceEventEmitter.addListener('changeMine', url => {
      //收到监听后想做的事情
      that.setState({url});
    });
    DeviceEventEmitter.addListener('msg', msg => {
      //收到监听后想做的事情
      that.setState({msg});
    });
  }

  componentWillMount() {
    this.requestExternalStoragePermission();
    this.requestCarmeraPermission();
  }

  render() {
    return (
      <Provider>
        <AppContainer />
      </Provider>
    );
  }
}
