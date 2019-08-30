
// 引入刚才封装好的axios
import axios from '../utuli/axios.js'
// 获取所有商品列表数据
export const getAllmenus = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
// 获取级联列表数据
export const getAllCate = (params) => {
  return axios({
    url: 'categories',
    params
  })
}
