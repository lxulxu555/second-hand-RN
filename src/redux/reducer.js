/*
用来根据老的state和指定的action生成并返回新的state的函数
 */
import {combineReducers} from 'redux'
import {RECEIVE_USERDATA,RECEIVE_GETMESSAGE} from './action-types'



function receiveUserData(state = [], action) {
    switch (action.type) {
        case RECEIVE_USERDATA :
            return {...state,User:action.User}
        default :
            return state
    }
}

function receiveGetMessage(state = [], action) {
    switch (action.type) {
        case RECEIVE_GETMESSAGE :
            return {...state,message:action.message}
        default :
            return state
    }
}


export default combineReducers({
    receiveUserData,
    receiveGetMessage
})
