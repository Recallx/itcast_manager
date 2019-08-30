
import axios from '../utuli/axios.js'

// 获取所有权限列表数据
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
// 获取左侧权限列表数据
export const getAllLeftList = () => {
  return axios({
    url: 'menus'
  })
}
