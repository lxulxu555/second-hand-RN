import {ajax} from "./ajax";
const BASE = 'http://47.93.240.205:8800/api'
//请求一级分类
export const reqClassiFication = () => ajax(BASE + '/classify1/findClassify1')
//根据一级分类ID查询二级分类
export const reqFindChildClass = (id) => ajax(BASE + '/classify1/findChildById',{id})
//根据商品名字查询商品
export const reqFindProduct = (goodsName,orderBy) => ajax(BASE + '/goods/findByLike',{goodsName,orderBy})
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
//查询所有分类
export const reqAllClass = () => ajax(BASE + '/classify1/findAll')
//添加商品
export const reqAddProduct = (product) => ajax(BASE + '/goods/add',product,'POST')
//根据特定条件查找商品
export const reqConditionFindProduct = (condition) => ajax(BASE + '/goods/findByPage',condition)
//获取求购列表
export const reqGetWantBuy = (token,page,rows,buyName) => ajax(BASE + '/token/buy/findByPage',{token,page,rows,buyName})
//根据商品ID删除商品
export const reqDeleteProduct = (id) => ajax(BASE + '/goods/deleteGoods',{id})
//根据照片名称删除图片
export const reqDeleteImage = (name) => ajax(BASE + '/goods/deleteFile',{name},'POST')
//更新一个商品
export const reqUpdateProduct = (product) => ajax(BASE + '/goods/update',product,'PUT')
//通过userid查询用户信息
export const findByUserId = (id) => ajax(BASE + '/user/findById',{id})
//关注用户
export const reqLikeUser = (userId,fansId) => ajax(BASE + '/token/fans/save',{userId,fansId},'POST')
//判断是否关注该用户
export const reqJudgeLikeUser = (userId,toUserId) => ajax(BASE + '/token/fans/checkFans',{userId,toUserId})
//获取自己关注用户列表
export const reqLikeUserList = (condition) => ajax(BASE + '/token/fans/findFansToUser',condition)
