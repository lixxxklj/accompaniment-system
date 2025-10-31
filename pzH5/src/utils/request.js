import axios from 'axios'
import { showNotify } from 'vant'

const instance = axios.create({
  baseURL: 'https://v3pz.itndedu.com/v3pz',
  timeout: 5000,
  headers: { "terminal": "h5" }     // 添加app请求的标识
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('H5_TOKEN')
  const whiteUrl = ['/login']
  if(token && !whiteUrl.includes(config.url)) {
    config.headers['h-token'] = token
  }
  return config
}, err => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  if(response.data.code === -1) {
    showNotify({
      type: 'warning',
      message: response.data.msg || response.data.message?.msg || response.data.message
    })
  } else if(response.data.code === -2) {
    // token 过期
    localStorage.removeItem('H5_TOKEN')
    localStorage.removeItem('H5_USERINFO')
    window.location.href = window.location.origin
    showNotify({
      type: 'warning',
      message: 'token过期，请重新登录'
    })
  }
  return response.data
}, err => {
  return Promise.reject(err)
})

export default instance