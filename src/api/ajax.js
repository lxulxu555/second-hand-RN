import axios from 'axios'
import {Toast} from '@ant-design/react-native'

export  function ajax(url,data={},type='GET',head={}) {

    return new Promise((resolve,reject) => {
        let promise
        if(type==='GET'){
            promise = axios.get(url,{
                params : data
            })
        }else if(type === 'POST'){
            promise = axios.post(url,data)
        }else if(type === 'PUT'){
            promise = axios.put(url,data)
        } else if(type === 'DELETE'){
            promise = axios.delete(url,{
                params : data
            })
        }else if(type === 'POSTHEADER'){
            promise = axios.post(url,data,{
                params : head
            })
        }else if(type === 'PUTHEADER'){
            promise = axios.put(url,data,{
                params : head
            })
        }
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            Toast.fail('请求出错了' + error.message)
        })
    })
}

