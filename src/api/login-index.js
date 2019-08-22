
// 引入刚才封装好的axios
import axios from '../utuli/axios.js'
export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
