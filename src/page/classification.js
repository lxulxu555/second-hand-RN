import React, {Component} from 'react'
import {
    Text,
    View,
    FlatList,
    ScrollView,
    TouchableHighlight,
    Image, StatusBar,
} from 'react-native'
import {reqFindChildClass, reqClassiFication} from '../api'
import {EasyLoading, Loading} from "../utils/Loading";
import {connect} from 'react-redux'

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


    SendClassDetail = (id) => {
        this.props.navigation.push('OneClassDetail',{
            type : 'twoClass',
            TwoClassId : id,
            User : this.props.User,
        })
    }

    componentWillMount() {
        this._navListener = this.props.navigation.addListener("didFocus", () => {
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

const mapStateToProps = state => ({
    User: state.receiveUserData
})

export default connect(
    mapStateToProps
)(ClassiFication)
