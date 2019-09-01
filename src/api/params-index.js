
// 引入刚才封装好的axios
import axios from '../utuli/axios.js'
// 获取所有分类参数
export const getAllParamsList = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}
