import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native'

import {List, Toast} from '@ant-design/react-native'
import {reqUpdateUser,reqUpdateHeaderImg} from '../../api'
import ImagePicker from 'react-native-image-crop-picker';
import CustomAlertDialog from '../../utils/CustomAlertDialog'
import {readUser} from "../../utils/ReadUserData";
import {receiveUserData} from "../../redux/actions";
import {connect} from 'react-redux'

const typeArr = ["打开相机", "打开相册"];
const sexArr = ["男", "女"];

 class UpdateUser extends Component {

    state = {
        ImageVisible: false,
        SexVisible : false,
        imageUrl: '',
    }


    Modal = () => {
        this.setState({
            ImageVisible : true
        })
    }

    selectImage = () => {
        ImagePicker.openPicker({
            cropperActiveWidgetColor: '#36B7AB', //裁剪图像时，确定工具栏和其他UX元素的颜色。
            cropperStatusBarColor: '#36B7AB', //裁剪图像时，决定状态栏StatusBar颜色。
            cropperToolbarColor: '#36B7AB',  //裁剪图像时，决定状态栏Toolbar颜色.
            cropperCircleOverlay: true,
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this._UploadImage(image);
        });
    }

    _UploadImage = async (image) => {
        let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
        let file = {uri: image.path, type: 'multipart/form-data', name: 'image.jpg'};   //这里的key(uri和type和name)不能改变,
        formData.append("file", file);   //这里的files就是后台需要的key
        const site = '/deal/user'
        formData.append("site",site)
        fetch('http://47.93.240.205:8800/api/upload/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    imageUrl: responseData.data.thumbnailUrl
                }, () => {
                    this.updateHeadImage()
                })
            })
            .catch((error) => {
                console.error('error', error)
            });
    }


    updateHeadImage = async () => {
        const id = this.props.User.user.id
        const img = this.state.imageUrl
        const result = await reqUpdateHeaderImg(id,img)
        readUser._saveData(result.data)
        this.props.dispatch(receiveUserData(result.data))
        Toast.success('修改成功', 1)
    }

    Camera = () => {
        ImagePicker.openCamera({
            cropperActiveWidgetColor: '#36B7AB', //裁剪图像时，确定工具栏和其他UX元素的颜色。
            cropperStatusBarColor: '#36B7AB', //裁剪图像时，决定状态栏StatusBar颜色。
            cropperToolbarColor: '#36B7AB',  //裁剪图像时，决定状态栏Toolbar颜色.
            cropperCircleOverlay: true,
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this._UploadImage(image);
        });
    }

    selectSex = async (i) => {
        const user = {}
        user.id = this.props.User.user.id
        user.email = this.props.User.user.email
        user.sex = sexArr[i]
        const result = await reqUpdateUser(user)
        readUser._saveData(result.data)
        this.props.dispatch(receiveUserData(result.data))
        Toast.success('修改成功', 1)
    }



    render() {
        const UserData = this.props.User.user
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <List style={{marginTop: 10, width: '95%'}}>
                    <List.Item
                        disabled
                        arrow="horizontal"
                        onPress={() => this.Modal()}
                        extra={
                            <Image
                                source={{uri: UserData.img}}
                                style={{width: 50, height: 50}}
                            />
                        }
                    >
                        <Text style={{margin: 7, fontSize: 15}}>头像</Text>
                    </List.Item>
                    <List.Item disabled extra={UserData.username} arrow="horizontal" onPress={() => UserData.flag === null ? this.props.navigation.push("Nickname",{
                        defaultValue : UserData.username,
                        type : '会员名只可修改一次，请慎重',
                    }) : Toast.fail('会员名只可修改一次',1)}>
                        <Text style={{margin: 7, fontSize: 15}}>会员名</Text>
                    </List.Item>
                    <List.Item disabled arrow="horizontal" onPress={() => this.props.navigation.push("Nickname",{
                        defaultValue : UserData.nickname,
                        type : '修改昵称',
                    })} extra={UserData.nickname}>
                        <Text style={{margin: 7, fontSize: 15}}>昵称</Text>
                    </List.Item>
                    <List.Item disabled arrow="horizontal" extra={UserData.phone} onPress={() => this.props.navigation.push("Nickname",{
                        defaultValue : UserData.phone,
                        type : '修改手机号',
                    })}>
                        <Text style={{margin: 7, fontSize: 15}}>手机号</Text>
                    </List.Item>
                    <List.Item disabled arrow="horizontal" extra={UserData.email} onPress={() => this.props.navigation.push("Nickname",{
                        defaultValue : UserData.email,
                        type : '修改邮箱',
                    })}>
                        <Text style={{margin: 7, fontSize: 15}}>邮箱</Text>
                    </List.Item>
                    <List.Item disabled arrow="horizontal" onPress={() => this.setState({SexVisible:true})} extra={UserData.sex}>
                        <Text style={{margin: 7, fontSize: 15}}>性别</Text>
                    </List.Item>
                    <List.Item disabled arrow="horizontal" extra={UserData.intro} onPress={() => this.props.navigation.push("Nickname",{
                        defaultValue : UserData.intro,
                        type : '修改简介',
                    })}>
                        <Text style={{margin: 7, fontSize: 15}}>简介</Text>
                    </List.Item>
                </List>
                <CustomAlertDialog entityList={typeArr} callback={(i) => {
                    i === 0 ? this.Camera() : this.selectImage()
                }} show={this.state.ImageVisible} closeModal={(show) => {
                    this.setState({
                        ImageVisible: show
                    })
                }}/>
                <CustomAlertDialog entityList={sexArr} callback={(i) => {
                    this.selectSex(i)
                }} show={this.state.SexVisible} closeModal={(show) => {
                    this.setState({
                        SexVisible: show
                    })
                }}/>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    alertBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    alertBox: {
        width: 200,
        height: 175,
        backgroundColor: 'white',
        alignItems: 'center',
    },
})
const mapStateToProps = state => ({
    User: state.receiveUserData.User
})

export default connect(
    mapStateToProps
)(UpdateUser)
