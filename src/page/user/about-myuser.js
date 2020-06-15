import React, {Component} from 'react'
import {
    View,
    FlatList,
    Image,
    Text,
    TouchableOpacity
} from 'react-native'
import {Icon} from '@ant-design/react-native'
import {connect} from 'react-redux'
import {reqAboutMyUser} from '../../api'

class AboutMyUser extends Component {

    state = {
        AboutMyUser: [],
        waiting:false
    }

    getAboutMyUser = async () => {
        const User = this.props.User
        const result = await reqAboutMyUser(User.token, User.user.id)
        const AboutMyUser = result.data
        this.setState({
            AboutMyUser
        })
    }

    _renderItem = (item) => {
        let type
        const user = item.item.user
        if (!item.item.images) {
            type = 'attention'
        } else {
            type = item.item.name ? 'comment' : 'like'
        }
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => this.goMyUser(item)}>
                        <Image source={{uri: user.img}} style={{width: 43, height: 43, borderRadius: 20, margin: 15}}/>
                    </TouchableOpacity>
                    {
                        type === 'attention' ?
                            <Text style={{width: 250}} numberOfLines={1}>{user.nickname}&nbsp;&nbsp;<Text
                                style={{fontWeight: 'bold'}}>关注</Text>&nbsp;&nbsp;了我</Text> :
                            type === 'comment' ?
                                <Text style={{width: 250}} numberOfLines={1} onPress={() => this.goProduct(item)}>{user.nickname}&nbsp;&nbsp;<Text
                                    style={{fontWeight: 'bold'}}>评论</Text>&nbsp;&nbsp;{item.item.content}</Text> :
                                <Text style={{width: 250}} numberOfLines={1} onPress={() => this.goProduct(item)}>
                                    {user.nickname}&nbsp;&nbsp;
                                    <Text style={{fontWeight: 'bold'}}>
                                        赞
                                    </Text>&nbsp;&nbsp; <Icon name='heart' style={{color: 'red'}}/> 了我
                                </Text>
                    }
                    <View style={{flex: 1}}/>
                    <Image source={{uri: item.item.images}}
                           style={{width: 50, height: 50, borderRadius: 5, margin: 15,marginRight:25}}
                    />
                </View>
            </View>
        )
    }


    goMyUser = (item) => {
        this.props.navigation.push('MyUser', {
            type: 'productDetail',
            id: item.item.user.id,
        })
    }

    goProduct = (product) => {
        const goodsid =  product.item.goodsid
        this.props.navigation.push('ProductDetail', {
            ProductId:goodsid
        })
        this.setState({waiting: true});
        setTimeout(() => {
            this.setState({waiting: false})
        }, 1000)
    }

    componentDidMount() {
        this.getAboutMyUser()
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <FlatList
                    data={this.state.AboutMyUser}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                    numColumns={1}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    User: state.receiveUserData.User
})

export default connect(
    mapStateToProps
)(AboutMyUser)
