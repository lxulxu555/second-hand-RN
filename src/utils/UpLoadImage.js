import ImagePicker from "react-native-image-crop-picker";
import {EasyLoading, Loading} from "./Loading";
import {Icon, Toast} from "@ant-design/react-native";
import {Image, TouchableOpacity, View} from 'react-native'
import React from "react";
import CustomAlertDialog from "./CustomAlertDialog";
const typeArr = ["打开相机", "打开相册"];
const DeleteArr = ["删除照片"];

export default class ImageWall extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ImageUrl: [],
            deleteShow: false,
            imageIndex: '',
            ImageVisible: false,
            One: false,
        }
    }

    selectImage = () => {
        ImagePicker.openPicker({
            multiple: true,
            width: 300,
            height: 400,
        }).then(image => {
            EasyLoading.show('上传中')
            if (image.length > 6) {
                Toast.fail('商品图片最多为6张', 5)
            } else {
                this.uploadArrImg(image);
            }
        });
    }

    Camera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
        }).then(image => {
            EasyLoading.show('上传中')
            if (image.length > 6) {
                Toast.fail('商品图片最多为6张', 5)
            } else {
                let data = []
                data.push(image)
                this.uploadArrImg(data)
            }
        });
    }


    uploadArrImg = (imgAry) => {
        let formData = new FormData();
        for (var i = 0; i < imgAry.length; i++) {
            let file = {uri: imgAry[i].path, type: 'multipart/form-data', name: 'image.jpg'};
            formData.append("file", file);
        }
        const site = this.props.site
        formData.append("site",site)
        console.log(formData)
        fetch('http://47.93.240.205:8800/api/upload/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                let newData = []
                const url = responseData.data.thumbnailUrl.split(',')
                url.map((item, index) => {
                    newData.push(item)
                })
                this.setState({
                    ImageUrl: [...this.state.ImageUrl, ...newData],
                }, () => {
                    EasyLoading.dismiss()
                })
            })
            .catch((error) => {
                console.log('error', error)
            });
    }

    ShowImg = () => {
        const url = this.state.ImageUrl || []
        return url.map((item, index) => {
            return (
                <TouchableOpacity key={index}
                                  onLongPress={() => this.setState({
                                      deleteShow: true,
                                      imageIndex: index,
                                  })}>
                    <Image
                        key={index}
                        source={{uri: item}}
                        style={{width: 120, height: 120, marginLeft: 10, marginTop: 8}}
                    />
                </TouchableOpacity>
            )
        })
    }

    Modal = () => {
        this.setState({
            ImageVisible: true
        })
    }

    //长按删除图片
    deleteImage = async () => {
        const {imageIndex, ImageUrl} = this.state
        ImageUrl.splice(imageIndex, 1)
    }

    componentDidMount() {
        this.setState({
            ImageUrl: this.props.ImageUrl
        })
    }

    render() {
        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Loading/>
                {this.ShowImg()}
                {
                    this.state.ImageUrl.length > 5 ? <View/> : <TouchableOpacity
                        onPress={() => this.Modal()}
                        activeOpacity={0.5}
                        style={{
                            backgroundColor: '#F5F5F5',
                            width: 120,
                            height: 120,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 10,
                            marginTop: 8
                        }}
                    >
                        <Icon
                            name='plus'
                            size={60}
                        />
                    </TouchableOpacity>
                }
                <CustomAlertDialog entityList={typeArr} callback={(i) => { //此处i是数组的下标，0也就是打开相机，1打开相册
                    i === 0 ? this.Camera() : this.selectImage()
                }} show={this.state.ImageVisible} closeModal={(show) => {
                    this.setState({
                        ImageVisible: false
                    })
                }}/>
                <CustomAlertDialog entityList={DeleteArr} callback={(i) => { //此处i是数组的下标，0也就是打开相机，1打开相册
                    this.deleteImage()
                }} show={this.state.deleteShow} closeModal={(show) => {
                    this.setState({
                        deleteShow: false
                    })
                }}/>
            </View>
        )
    }
}
