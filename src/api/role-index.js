
// 这是一个获取数据的方法
import axios from '../utuli/axios.js'
export const getAllRole = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
// 这是实现获取数据
export const getAllUserRole = () => {
  return axios({
    url: `/roles`
  })
}
// 实现删除用户权限
export const deleteUserp = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
