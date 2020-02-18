import {ajax} from "./ajax";
const BASE = 'http://39.106.188.22:8800/api'
//请求一级分类
export const reqClassiFication = () => ajax(BASE + '/classify1/findClassify1')
//获取所有商品信息
export const reqGetAllProduct = (id,page,rows,orderBy) => ajax(BASE + '/goods/findByPage',{id,page,rows,orderBy})
//根据一级分类ID查询二级分类
export const reqFindChildClass = (id) => ajax(BASE + '/classify1/findChildById',{id})
//根据商品名字查询商品
export const reqFindProduct = (goodsName) => ajax(BASE + '/goods/findByLike',{goodsName})
//根据商品id查询商品详情
export const reqIdDetail = (id,userid) => ajax(BASE + '/goods/findById',{id,userid})
//登录
export const reqLogin = (username,password,code) => ajax(BASE + '/user/login',{username,password,code},'POST')
//查询用户收藏商品列表
export const reqCollectList = (token,id,page,rows) => ajax(BASE + '/token/collect/findByUser',{token,id,page,rows})
//更新用户信息
export const reqUpdateUser = (user) => ajax(BASE + '/user/update',user,'PUT')
//更新用户头像
export const reqUpdateHeaderImg = (id,img) => ajax(BASE + '/user/updateImg',{id,img},'PUT')
//获取验证码
export const reqVerificationCode = (email) => ajax(BASE + '/user/getEmailCode',{email})
//快速注册
export const reqQuicklyRegister = (email,code) => ajax(BASE + '/user/registerAndLogin',{email,code})
//更新用户名
export const reqUpdateUsername = (id,username) => ajax(BASE + '/user/updateName',{id,username},'PUT')
//根据邮箱找回密码
export const reqFindPwd = (password,email,code) => ajax(BASE + '/user/chengePassword',{password,email,code},'POST')
