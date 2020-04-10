import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    ScrollView,
    ImageBackground,
    StatusBar,
    TouchableOpacity,
} from 'react-native'
import {readUser} from "../../utils/ReadUserData";


export default class User extends Component {

    state = {
        UserData: {},
    }


    _readData = async () => {
        const data = await readUser._readData('user',this.props)
        this.setState({UserData:data})
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this._readData()
            StatusBar.setTranslucent(true)
            StatusBar.setBarStyle('light-content'); //状态栏文字颜色
            StatusBar.setBackgroundColor('#36B7AB'); //状态栏背景色
        });
    }



    componentWillUnmount() {
        this._navListener.remove();
    }



    render() {
        const UserData = this.state.UserData.user || {}
        const fans = this.state.UserData.fans || {}
        return (
            <View style={{flex: 1, marginTop: 15}}>
                <ScrollView>
                    <ImageBackground style={{width: '100%', height: 150, backgroundColor: '#36B7AB'}}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('MyUser',{
                                id: UserData.id,
                                UserToken : this.state.UserData.token,
                            })} activeOpacity={0.6}>
                            <Image
                                source={{uri: UserData.img === '' ? 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4147505531,1886811031&fm=26&gp=0.jpg' : UserData.img}}
                                style={{width: 100, height: 100, borderRadius: 10, margin: 20}}
                            />
                            </TouchableOpacity>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={{fontSize: 20, marginTop: 18}}>{UserData.username}</Text>
                                <Text style={{marginTop: 10}}>昵称:<Text>{UserData.nickname}</Text></Text>
                                <TouchableOpacity style={{backgroundColor:'#F5F5F5',marginTop:10,borderRadius:10,alignItems:'center',padding:2}} onPress={() => this.props.navigation.push('MyUser',{
                                    id: UserData.id,
                                    UserToken : this.state.UserData.token,
                                })} activeOpacity={0.6}>
                                <Text style={{fontSize:12}}>个人主页></Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        marginTop: -15,
                        marginLeft: 20,
                        borderRadius: 18,
                        height: 55,
                        width: '90%',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity style={{fontSize: 15, borderRightWidth: 0.5, flex: 1}}
                                          onPress={() => alert('s')}>
                            <Text style={{textAlign: 'center'}}>1与我相关</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{fontSize: 15, borderRightWidth: 0.5, flex: 1}}
                                          onPress={() => this.props.navigation.push('LikeUser',{
                                              title : '我的关注',
                                              type : 'attention',
                                              id : UserData.id,
                                              Token : this.state.UserData.token
                                          })}>
                            <Text style={{textAlign: 'center'}}>{fans.attention + '关注'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{fontSize: 15, flex: 1}} onPress={() => this.props.navigation.push('LikeUser',{
                            title : '我的粉丝',
                            type:'fans',
                            id : UserData.id,
                            Token : this.state.UserData.token
                        })}>
                            <Text style={{textAlign: 'center'}}>{fans.fans + '粉丝'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'center'}}>
                    <View style={{
                        backgroundColor:'#FFFFFF',
                        flexDirection: 'row',
                        width:'95%',
                        borderRadius:18,
                        marginTop:30,
                        paddingTop:20,
                        paddingBottom:20,
                    }}>
                        <TouchableOpacity style={{flex:1,alignItems: 'center'}} onPress={() => this.props.navigation.push('Mycollect',{
                            UserToken: this.state.UserData.token,
                            UserData: this.state.UserData,
                        })}>
                            <Image
                                source={require('../../../android/app/src/main/res/drawable-hdpi/mycollect.png')}
                                style={{height:35,width:35}}
                            />
                            <Text style={{marginTop:8}}>我收藏的</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,alignItems: 'center'}} onPress={() =>  this.props.navigation.push('SendProduct',{
                            UserId: UserData.id,
                            type : 'send'
                        })}>
                            <Image
                                source={require('../../../android/app/src/main/res/drawable-hdpi/sendproduct.png')}
                                style={{height:35,width:35,tintColor:'blue'}}
                            />
                            <Text style={{marginTop:8}}>发布商品</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,alignItems: 'center'}}  onPress={() =>  this.props.navigation.push('SendWantBuy',{
                            UserId: UserData.id,
                            UserToken : this.state.UserData.token
                        })}>
                            <Image
                                source={require('../../../android/app/src/main/res/drawable-hdpi/sendwantbuy.png')}
                                style={{height:35,width:35,tintColor:'green'}}
                            />
                            <Text style={{marginTop:8}}>发布求购</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
