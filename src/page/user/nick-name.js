import React, {Component} from 'react'
import {
    View,
    TextInput,
    TouchableOpacity,
    Text
} from 'react-native'
import {reqUpdateUser,reqUpdateUsername} from '../../api'
import { Toast} from '@ant-design/react-native'
import {connect} from 'react-redux'
import {readUser} from '../../utils/ReadUserData'
import {receiveUserData} from '../../redux/actions'


class Nickname extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.type,
    });

    state = {
        nickname : '',
        username : '',
        phone : '',
        email: '',
        placeholder:'',
        intro : ''
    }

    saveNickName = async () => {
        const user = {}
        const data = this.props.User.user
        const type = this.props.navigation.getParam('type')
        const reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
        user.id = data.id
        user.email = type === '修改邮箱' ? this.state.email : data.email
        user.nickname = type === '修改昵称' ? this.state.nickname : data.nickname
        user.phone = type === '修改手机号' ? this.state.phone : data.phone
        user.intro = type === '修改简介' ? this.state.intro : data.intro
        if(type === '修改手机号'){
            if(!(/^1[3456789]\d{9}$/.test(this.state.phone))){
                Toast.fail("手机号码有误，请重填",1);
                return false;
            }
        }
        if(type === '修改邮箱'){
            if(!reg.test(this.state.email)){
                Toast.fail("邮箱错误，请重填",1);
                return false;
            }
        }
        const result = await reqUpdateUser(user)
        readUser._saveData(result.data)
        this.props.dispatch(receiveUserData(result.data))
        this.props.navigation.goBack()
        Toast.success('更新成功',1)
    }

    saveUsername = async  () => {
        const data = this.props.User.user
        const id = data.id
        const username = this.state.username
        const result = await reqUpdateUsername(id,username)
        readUser._saveData(result.data)
        this.props.dispatch(receiveUserData(result.data))
        this.props.navigation.goBack()
        Toast.success('更新成功',1)
    }

    ChangeText = (text) => {
        const type = this.props.navigation.getParam('type')
        if(type === '会员名只可修改一次，请慎重'){
            this.setState({
                username : text
            })
        }else if (type === '修改昵称'){
            this.setState({
                nickname : text
            })
        }else if (type === '修改手机号'){
            this.setState({
                phone : text
            })
        }else if (type === '修改邮箱'){
            this.setState({
                email : text
            })
        }else if (type === '修改简介'){
            this.setState({
                intro : text
            })
        }
    }

    componentWillMount(){
        const type = this.props.navigation.getParam('type')
        if(type === '会员名只可修改一次，请慎重'){
            this.setState({
                placeholder : '会员名只可修改一次，Eurasia会员请慎重~~',
                username : this.props.navigation.getParam('defaultValue')
            })
        }else if (type === '修改昵称'){
            this.setState({
                placeholder : '想一个朗朗上口的昵称吧~~',
                nickname : this.props.navigation.getParam('defaultValue')
            })
        }else if (type === '修改手机号'){
            this.setState({
                placeholder : '写上你的手机号，方便别人联系你~~',
                phone : this.props.navigation.getParam('defaultValue')
            })
        }else if (type === '修改邮箱'){
            this.setState({
                placeholder : '更改你的邮箱~~',
                email : this.props.navigation.getParam('defaultValue')
            })
        }
        else if (type === '修改简介'){
            this.setState({
                placeholder : '让别人更加了解你~~',
                intro : this.props.navigation.getParam('defaultValue')
            })
        }
    }


    render() {
        const type = this.props.navigation.getParam('type')
        return (
            <View style={{flex: 1}}>
                <TextInput
                    multiline={true}
                    style={{
                        height: 130,
                        backgroundColor:'#FFFFFF',
                        textAlignVertical: 'top',
                        paddingLeft:10,
                        fontSize:17
                    }}
                    defaultValue={this.props.navigation.getParam('defaultValue')}
                    onChangeText={(text) => this.ChangeText(text)}
                    placeholder={this.state.placeholder}
                />
                <View style={{alignItems:'center',marginTop:17}}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#36B7AB',
                        alignItems: 'center',
                        borderRadius: 20,
                        width: '90%',
                        height: 45,
                        justifyContent: 'center',
                    }}
                    onPress={() => type === '会员名只可修改一次，请慎重' ? this.saveUsername() : this.saveNickName()}
                >
                    <Text style={{color: '#FFFFFF', textAlign: 'center', fontSize: 15}}>保存</Text>
                </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    User: state.receiveUserData.User
})

export default connect(
    mapStateToProps
)(Nickname)
