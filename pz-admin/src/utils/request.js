import axios from 'axios'

// 创建实例对象
const instance = axios.create({
  baseURL: 'https://v3pz.itndedu.com/v3pz',
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('TOKEN')
  // 不需要token的api
  const whiteUrl = ['/get/code', '/user/authentication', '/login']
  if(token && !whiteUrl.includes(config.url)) {
    // 需要token验证的，在请求头中设置token
    config.headers['x-token'] = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(response => {
  if(response.data.code === -1) {
    // console.log(response)
    ElMessage.warning(response.data.msg || response.data.message?.msg || response.data.message)
  } else if(response.data.code === -2) {
    // token 过期
    localStorage.removeItem('TOKEN')
    localStorage.removeItem('USERINFO')
    localStorage.removeItem('menu')
    // 跳转到同源的根目录：http://localhost:5173/
    window.location.href = window.location.origin
    ElMessage.error('token过期，请重新登录')
  }
  // 直接返回data，调用层少一层 .data
  return response.data
}, error => {
  // 超出 2xx 范围的状态码都会触发该函数
  return Promise.reject(error)
})
export default instance