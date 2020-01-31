import React, {Component} from 'react'
import {
    Text,
    View,
    FlatList,
    ScrollView,
    BackHandler,
    ToastAndroid,
    TouchableHighlight,
    Image,
} from 'react-native'
import {Toast,Icon} from '@ant-design/react-native'
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {reqFindChildClass, reqClassiFication} from '../api'


class ClassiFication extends Component {

    state = {
        Leftclass: [],
        RightClass: [],
        LeftClassId: 1,
    }

    getLeftClass = async () => {
        const result = await reqClassiFication()
        this.setState({
            Leftclass: result
        })
    }

    _renderLeftItem = ({item, index}) => {
        return (
            <TouchableHighlight
                underlayColor='#DCDCDC'
                onPress={() => this.onSelected(item, index)}
                style={{width: 85, backgroundColor: '#F5F5F5'}}
                key={index}
            >
                <View
                    ref={(ref) => this.selectedView = {...this.selectedView, [`left${index}`]: ref}}
                    style={{
                        backgroundColor: index === 0 ? '#FFE4C4' : '#F5F5F5',
                        borderLeftWidth: index === 0 ? 4 : 0,
                        borderLeftColor: index === 0 ? 'red' : '',
                        justifyContent: 'center',
                        height: 50,
                        paddingLeft: 12,
                    }}>
                    <Text style={{fontSize: 14}}>{item.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    onSelected = (OneClass, index) => {
        var length = this.state.Leftclass.length;
        for (var i = 0; i < length; i++) {
            if (i === index) {
                this.selectedView['left' + i].setNativeProps({
                    style: {
                        backgroundColor: '#FFE4C4',
                        borderLeftWidth: 4,
                        borderLeftColor: 'red'
                    }
                });
            } else {
                this.selectedView['left' + i].setNativeProps({
                    style: {
                        backgroundColor: '#F5F5F5',
                        borderLeftWidth: 0,
                        borderLeftColor: ''
                    }
                });
            }
        }
        this.setState({
            LeftClassId: OneClass.id,
        }, () => {
            this.getRightClass()
        })
    }

    getRightClass = async () => {
        const id = this.state.LeftClassId
        const result = await reqFindChildClass(id)
        this.setState({
            RightClass: result
        },() => {
            Toast.loading('加载中', 0.3);
        })
    }

    _renderRightItem = ({item, index}) => {
        return (
            <TouchableHighlight
                underlayColor='#DCDCDC'
                onPress={() => alert(item.id)}
            >
                <View style={{alignItems: 'center', marginBottom: 10, marginLeft: 18, marginRight: 18}}>
                    <Image source={{uri: item.image}}
                           style={{height: 65, width: 65, marginTop: 10, marginBottom: 3}}/>
                    <Text style={{fontSize: 12, color: "#333", marginTop: 10}}>{item.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    onBackAndroid = () => {
        if (this.props.navigation.isFocused()) {//判断   该页面是否处于聚焦状态
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                BackHandler.exitApp();
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        }
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    componentDidMount() {
        this.getLeftClass()
        this.getRightClass()
    }

    render() {
        return (
            <View style={{flex: 1,flexDirection: 'row'}}>
                <ScrollView  showsVerticalScrollIndicator = {false}
                >
                        <View style={{width: 90, borderRightWidth: 0.5, borderRightColor: '#DCDCDC'}}>
                            <FlatList
                                data={this.state.Leftclass}
                                numColumns={1}
                                renderItem={this._renderLeftItem}
                            />
                        </View>
                </ScrollView>
                <FlatList
                    data={this.state.RightClass}
                    numColumns={3}
                    renderItem={this._renderRightItem}
                />
            </View>
        )
    }
}

const AppNavigator = createStackNavigator({
    ClassiFication: {
        screen: ClassiFication,
        navigationOptions: {
            title: '分类'
        },
    },
}, {
    headerLayoutPreset: 'center',   //将标题居中
})

export default createAppContainer(AppNavigator)




