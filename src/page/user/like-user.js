import React, {Component} from 'react'
import {
    View,
    Text,
    FlatList,
    ScrollView,
    Image,
    TouchableOpacity
} from 'react-native'

import {reqLikeUser, reqLikeUserList} from '../../api'
import {WingBlank, WhiteSpace} from '@ant-design/react-native'
import {connect} from 'react-redux'
import {readUser} from "../../utils/ReadUserData";
import {receiveUserData} from "../../redux/actions";

class LikeUser extends Component {

    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.title,
    });

    state = {
        UserList: []
    }

    LikeUser = async () => {
        const User = this.props.User
        const condition = {}
        const type = this.props.navigation.getParam('type')
        if (type === 'attention') {
            condition.fansId = User.user.id
        } else {
            condition.userId = User.user.id
        }
        condition.token = User.token
        const result = await reqLikeUserList(condition)
        this.setState({
            UserList: result.data
        })
    }

    _renderItem = (item) => {
        const id = this.props.User.user.id
        const title = this.props.navigation.getParam('title')
        return <WingBlank>
            <WhiteSpace/>
            <TouchableOpacity
                activeOpacity={0.6}
                style={{backgroundColor: '#FFFFFF', flexDirection: 'row', borderRadius: 10}}
                onPress={() => this.goMyUser(item)}
            >
                <Image source={{uri: item.item.user.img}} style={{width: 50, height: 50, margin: 10}}/>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 14}}>{item.item.user.nickname}</Text>
                    <Text style={{fontSize: 12, marginTop: 5}}>{item.item.user.intro}</Text>
                </View>
                <View style={{flex: 1}}/>
                {
                    title === '我的关注' ? <TouchableOpacity
                        style={{marginRight: 15, justifyContent: 'center'}}
                        onPress={() => this.LikeUserType(item)}
                    >
                        <View style={{backgroundColor: '#36B7AB', borderRadius: 12}}>
                            <Text style={{color: '#FFFFFF', padding: 5}}>
                                {item.item.fansId === id ? '已关注' : '关注'}
                            </Text>
                        </View>
                    </TouchableOpacity> : <View/>
                }

            </TouchableOpacity>
        </WingBlank>
    }

    LikeUserType = async (item) => {
        const index = item.index
        const User = this.props.User
        const userId = item.item.user.id
        const UserList = [...this.state.UserList] //复制数组
        const fansId = this.props.User.user.id
        const result = await reqLikeUser(userId, fansId, this.props.User.token)
        if (result.msg === '收藏成功') {
            this.setState({
                UserList: UserList.map((item, idx) => idx === index ? {...item, fansId} : item)
            })
        } else {
            this.setState({
                UserList: UserList.map((item, idx) => idx === index ? {...item, fansId: ""} : item)
            })
        }
    }

    goMyUser = (item) => {
        this.props.navigation.push('MyUser', {
            id: item.item.user.id,
            type: 'productDetail'
        })
    }

    componentDidMount() {
        this.LikeUser()
    }

    render() {
        return (
            <ScrollView>
                <FlatList
                    data={this.state.UserList}
                    renderItem={(item) => this._renderItem(item)}
                    numColumns={1}
                    keyExtractor={(item, index) => index.toString()}
                />
            </ScrollView>
        )
    }
}

const mapStateToProps = state => ({
    User: state.receiveUserData.User
})

export default connect(
    mapStateToProps
)(LikeUser)
