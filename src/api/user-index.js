
import axios from '../utuli/axios.js'
export const getAllUsers = (params) => {
  return axios({
    url: '/users',
    params
  })
}
// 添加用户方法
export const getAddUser = (data) => {
  return axios({
    url: '/users',
    method: 'post',
    data
  })
}
// 编辑用户方法
export const editUser = (data) => {
  return axios({
    url: `/users/${data.id}`,
    method: 'put',
    data
  })
}
// 分配角色的方法
export const grantUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}
// 删除数据的方法
export const deleteUser = (id) => {
  return axios({
    url: `/users/${id}`,
    method: 'delete'
  })
}
// 修改登录状态的方法
export const updateUserState = (uId, type) => {
  return axios({
    url: `/users/${uId}/state/${type}`,
    method: 'put'
  })
}
