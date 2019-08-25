
import axios from '../utuli/axios.js'
export const getAllUsers = (params) => {
  return axios({
    url: '/users',
    params
  })
}
export const getAddUser = (data) => {
  return axios({
    url: '/users',
    method: 'post',
    data
  })
}
