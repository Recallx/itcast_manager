
import axios from '../utuli/axios.js'
export const getAllUsers = (params) => {
  return axios({
    url: '/users',
    params
  })
}
