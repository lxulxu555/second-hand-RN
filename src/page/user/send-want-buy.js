import React, {Component} from 'react'
import {
    View,
    Text, TextInput, TouchableOpacity
} from 'react-native'
import {Icon, InputItem, List, Toast} from "@ant-design/react-native";
import Picker from "react-native-picker";
import ImageWall from "../../utils/UpLoadImage";
import {connect} from 'react-redux'
import {reqSaveWantBuy,reqUpdateWantBuy,reqDeleteWantBuy} from '../../api'

class SendWantBuy extends Component {

    static navigationOptions = ({navigation}) => {
        const type = navigation.getParam('type')
        return {
            headerLeft : type === 'MyUser' ? (
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{
                        backgroundColor: 'red',
                        borderRadius: 15,
                        marginLeft: 15,
                        width: 60,
                        textAlign: 'center',
                    }}
                    onPress={() => navigation.state.params.DeletePress()}
                >
                    <Text style={{
                        color: '#FFFFFF',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        height: 30
                    }}>删除</Text>
                </TouchableOpacity>
            ) : null,
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
                    onPress={() => navigation.state.params.navigatePress()}
                >
                    <Text style={{
                        color: '#FFFFFF',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        height: 30
                    }}>发布</Text>
                </TouchableOpacity>
            ),
        }
    };

    state = {
        title: '',
        intro: '',
        weixin: '',
        minPrice: '',
        maxPrice: '',
        ImageUrl: []
    }

    saveProduct = async () => {
        const type = this.props.navigation.getParam('type')
        const detail = this.props.navigation.getParam('WantBuyDetail')
        const token =  this.props.User.token
        const wantBuy = {}
        if(type === 'MyUser'){
            wantBuy.id = detail.id
        }
        wantBuy.userid = this.props.User.user.id
        wantBuy.title = this.state.title
        wantBuy.intro = this.state.intro
        wantBuy.weixin = this.state.weixin
        wantBuy.images = this.ImageWall.state.ImageUrl.toString()
        wantBuy.minPrice = this.state.minPrice
        wantBuy.maxPrice = this.state.maxPrice
        if (wantBuy.title === '' && wantBuy.intro === '' && wantBuy.weixin === '' && wantBuy.minPrice === '' && wantBuy.maxPrice === '') {
            Toast.fail('不能为空', 1)
        }
        const result = type === 'MyUser' ? await reqUpdateWantBuy(wantBuy,token) : await reqSaveWantBuy(wantBuy,token)

        if (result.code === 0) {
            Toast.success('添加成功', 1)
            this.props.navigation.navigate('Main')
        } else {
            Toast.fail(result.msg, 1)
        }
    }

    SettingProduct = () => {
        const detail = this.props.navigation.getParam('WantBuyDetail')
        this.setState({
            ImageUrl: detail.images.split(","),
            maxPrice: detail.maxPrice.toString(),
            minPrice: detail.minPrice.toString(),
            weixin: detail.weixin,
            intro: detail.intro,
            title: detail.title
        })
    }

    DeleteProduct = async () => {
        const detail = this.props.navigation.getParam('WantBuyDetail')
        const id = detail.id
        const result = await reqDeleteWantBuy(id,this.props.User.token)
        if(result.code === 0){
            Toast.success('删除成功',1)
            this.props.navigation.navigate('Main')
        }else{
            Toast.fail(result.msg,1)
        }
    }

    componentWillMount() {
        if (this.props.navigation.getParam('type') === 'MyUser') {
            this.SettingProduct()
        }
    }

    componentDidMount() {
        // 处理数据源
        this.props.navigation.setParams({navigatePress: this.saveProduct})
        this.props.navigation.setParams({DeletePress: this.DeleteProduct})
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <TextInput
                    onSubmitEditing={() => {
                        this.titleTextInput.focus()
                    }} //当软键盘的确定/提交按钮被按下的时候调用此函数
                    multiline={true}
                    returnKeyType='next'
                    value={this.state.intro}
                    placeholder='求购商品详细信息.'
                    style={{
                        paddingLeft: 20,
                        fontSize: 15,
                        height: '22%',
                        textAlignVertical: 'top',
                        backgroundColor: '#FFFFFF'
                    }}
                    onChangeText={(text) => this.setState({
                        intro: text
                    })}
                />
                <ImageWall ref={ref => this.ImageWall = ref} ImageUrl={this.state.ImageUrl} site='/deal/buy'/>
                <List>
                    <InputItem
                        returnKeyType='next'
                        onSubmitEditing={() => {
                            this.weixinTextInput.focus()
                        }} //当软键盘的确定/提交按钮被按下的时候调用此函数
                        ref={(input) => {
                            this.titleTextInput = input
                        }}
                        style={{paddingLeft: 15}}
                        extra={<Text style={{fontSize: 13, color: '#778899'}}>引人注目</Text>}
                        value={this.state.title}
                        onChange={value => {
                            this.setState({
                                title: value,
                            });
                        }}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <Icon name='bulb'/>
                            <Text style={{marginLeft: 15, fontSize: 15}}>标题</Text>
                        </View>
                    </InputItem>
                    <InputItem
                        returnKeyType='next'
                        onSubmitEditing={() => {
                            this.minpriceTextInput.focus()
                        }} //当软键盘的确定/提交按钮被按下的时候调用此函数
                        ref={(input) => {
                            this.weixinTextInput = input
                        }}
                        style={{paddingLeft: 15}}
                        extra={<Text style={{fontSize: 13, color: '#778899'}}>方便联系您</Text>}
                        value={this.state.weixin}
                        onChange={value => {
                            this.setState({
                                weixin: value,
                            });
                        }}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <Icon name='wechat'/>
                            <Text style={{marginLeft: 15, fontSize: 15}}>微信</Text>
                        </View>
                    </InputItem>
                    <InputItem
                        onSubmitEditing={() => {
                            this.maxpriceTextInput.focus()
                        }} //当软键盘的确定/提交按钮被按下的时候调用此函数
                        onFocus={() => Picker.hide()}
                        returnKeyType='next'
                        type='number'
                        ref={(input) => {
                            this.minpriceTextInput = input
                        }}
                        style={{paddingLeft: 30}}
                        extra={<Text style={{fontSize: 13, color: '#778899'}}>开个最低价</Text>}
                        value={this.state.minPrice}
                        onChange={value => {
                            const newText = value.replace(/[^\d]+/, '');
                            this.setState({
                                minPrice: newText,
                            });
                        }}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <Icon name='dollar'/>
                            <Text style={{marginLeft: 15, fontSize: 15}}>最低价</Text>
                        </View>
                    </InputItem>
                    <InputItem
                        ref={(input) => {
                            this.maxpriceTextInput = input
                        }}
                        onFocus={() => Picker.hide()}
                        type='number'
                        style={{paddingLeft: 30}}
                        extra={<Text style={{fontSize: 13, color: '#778899'}}>开个最高价</Text>}
                        value={this.state.maxPrice}
                        onChange={value => {
                            const newText = value.replace(/[^\d]+/, '');
                            this.setState({
                                maxPrice: newText,
                            });
                        }}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <Icon name='dollar'/>
                            <Text style={{marginLeft: 15, fontSize: 15}}>最高价</Text>
                        </View>
                    </InputItem>
                </List>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    User: state.receiveUserData.User
})

export default connect(
    mapStateToProps
)(SendWantBuy)

