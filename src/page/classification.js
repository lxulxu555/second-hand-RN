import React, {Component} from 'react'
import {
    Text,
    View,
    FlatList,
    ScrollView,
    TouchableHighlight,
    Image, StatusBar,
} from 'react-native'
import {Toast} from '@ant-design/react-native'
import {reqFindChildClass, reqClassiFication} from '../api'
import {EasyLoading, Loading} from "../utils/Loading";

export default class ClassiFication extends Component {

    state = {
        Leftclass: [],
        RightClass: [],
        LeftClassId: 1,
        User : {}
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
        EasyLoading.show()
        const id = this.state.LeftClassId
        const result = await reqFindChildClass(id)
        this.setState({
            RightClass: result
        },() => {
            EasyLoading.dismiss()
        })
    }

    _renderRightItem = ({item, index}) => {
        return (
            <TouchableHighlight
                underlayColor='#DCDCDC'
                onPress={() => this.SendClassDetail(item.id)}
            >
                <View style={{alignItems: 'center', marginBottom: 10, marginLeft: 18, marginRight: 18}}>
                    <Image source={{uri: item.image}}
                           style={{height: 65, width: 65, marginTop: 10, marginBottom: 3}}/>
                    <Text style={{fontSize: 12, color: "#333", marginTop: 10}}>{item.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    _readData = () => {
        storage.load({
            key: 'loginState',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,

            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
            syncInBackground: true,

            // 你还可以给sync方法传递额外的参数
            syncParams: {
                extraFetchOptions: {
                    // 各种参数
                },
                someFlag: true,
            },
        }).then(ret => {
            // 如果找到数据，则在then方法中返回
            // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
            // 你只能在then这个方法内继续处理ret数据
            // 而不能在then以外处理
            // 也没有办法“变成”同步返回
            // 你也可以使用“看似”同步的async/await语法
            this.setState({
                User: ret,
            })
        }).catch(ret => {
            this.setState({
                User: {
                    user :{
                        id : ''
                    }
                },
            })
        })
    }

    SendClassDetail = (id) => {
        this.props.navigation.push('OneClassDetail',{
            type : 'twoClass',
            TwoClassId : id,
            User : this.state.User,
        })
    }

    componentWillMount() {
        this._navListener = this.props.navigation.addListener("didFocus", () => {
            this._readData()
            StatusBar.setBarStyle("dark-content"); //状态栏文字颜色
            StatusBar.setBackgroundColor("#ffffff"); //状态栏背景色
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    componentDidMount() {
        this.getLeftClass()
        this.getRightClass()
    }

    render() {
        return (
            <View style={{flex: 1,flexDirection: 'row'}}>
                <Loading/>
                <ScrollView  showsVerticalScrollIndicator = {false}>
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

