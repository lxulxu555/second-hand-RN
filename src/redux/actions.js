/*
包含n个action creator函数的模块
同步action: 对象 {type: 'xxx', data: 数据值}
异步action: 函数  dispatch => {}
 */
import {reqClassiFication} from '../api'
import {RECEIVE_CLASSIFICATION} from './action-types'

//接收一级分类的同步action
export const receiveClassFication = (One) => ({type:RECEIVE_CLASSIFICATION,One})

//获取首页一级分类的异步action
export const OneClassiFication = () => {
    return async dispatch => {
        const result = await reqClassiFication('')
        dispatch(receiveClassFication(result))
    }
}
