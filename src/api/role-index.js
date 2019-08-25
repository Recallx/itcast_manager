
// 这是一个获取数据的方法
import axios from '../utuli/axios.js'
export const getAllUserss = () => {
  return axios({
    url: '/roles'
  })
}
