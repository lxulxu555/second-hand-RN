/*
包含n个action creator函数的模块
同步action: 对象 {type: 'xxx', data: 数据值}
异步action: 函数  dispatch => {}
 */
import {RECEIVE_USERDATA, RECEIVE_GETMESSAGE} from './action-types'
import {reqGetMessage} from '../api'
import {DeviceEventEmitter} from "react-native";

//获取用户信息的同步action
const receiveUserData = (User) => ({type: RECEIVE_USERDATA, User})
const receiveGetMessage = (message) => ({type: RECEIVE_GETMESSAGE, message})

const reqgetMessage = (id) => {
    return async dispatch => {
        // 1. 执行异步ajax请求
        const result = await reqGetMessage(id)
        // 分发接收用户的同步action
        if(result.code !== -1){
            DeviceEventEmitter.emit('msg', result);
            dispatch(receiveGetMessage(result))
        }
    }
}

export {
    receiveUserData,
    reqgetMessage
}
