/*
用来根据老的state和指定的action生成并返回新的state的函数
 */
import {combineReducers} from 'redux'
import {RECEIVE_CLASSIFICATION} from './action-types'


function OneClassiFication(state = [] ,action) {
    switch (action.type) {
        case RECEIVE_CLASSIFICATION :
            return action.One
        default :
            return state
    }
}


export default combineReducers({
    OneClassiFication
})
