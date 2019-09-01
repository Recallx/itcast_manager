import axios from '@/utuli/axios.js'

export const getlist = (type) => {
  return axios({
    url: `reports/type/${type}`
  })
}
