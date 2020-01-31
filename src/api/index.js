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
