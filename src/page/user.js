import React,{Component} from 'react'
import {
    View,
    Text,
    Image,
    BackHandler,
    ToastAndroid,
    ScrollView,
    ImageBackground,
    StatusBar,
    TouchableOpacity
} from 'react-native'
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

class User extends Component{

    componentDidMount(){
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content'); //状态栏文字颜色
            StatusBar.setBackgroundColor('#36B7AB'); //状态栏背景色
        });
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        this._navListener.remove();
    }

    onBackAndroid = () => {
        if(this.props.navigation.isFocused()) {//判断   该页面是否处于聚焦状态
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                BackHandler.exitApp();
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        }
    };

    render () {
        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    <ImageBackground style={{width:'100%',height:150,backgroundColor:'#36B7AB'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Image
                            source={{uri: 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2034740944,4251903193&fm=26&gp=0.jpg'}}
                            style={{width: 100, height: 100, borderRadius: 10,margin:20}}
                        />
                        <View style={{flexDirection: 'column'}}>
                        <Text style={{fontSize:20,marginTop:18}}>lxuly000</Text>
                        <Text style={{marginTop:10}}>昵称:<Text>lxulxu555</Text></Text>
                        </View>
                    </View>
                    </ImageBackground>
                    <View style={{
                        backgroundColor:'#FFFFFF',
                        marginTop:-15,
                        marginLeft:20,
                        borderRadius:18,
                        height:55,
                        width:'90%',
                        flexDirection: 'row',
                        alignItems:'center',
                    }}>
                        <TouchableOpacity  style={{fontSize:15,borderRightWidth: 0.5,flex:1}} onPress={() => alert('s')}>
                        <Text style={{textAlign :'center'}}>1与我相关</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{fontSize:15,borderRightWidth: 0.5,flex:1}} onPress={() => alert('s')}>
                        <Text  style={{textAlign :'center'}}>4关注</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{fontSize:15,flex:1}}>
                        <Text  style={{textAlign :'center'}}>10粉丝</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const AppNavigator = createStackNavigator({
    User: {
        screen: User,
        navigationOptions: {
            header : null
        },
    },
}, {
    headerLayoutPreset: 'center',   //将标题居中
})

export default createAppContainer(AppNavigator)

