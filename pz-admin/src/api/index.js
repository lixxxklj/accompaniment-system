import request from '../utils/request'
// 发送验证码
export const getCode = (data) => {
  return request({
    url: '/get/code',
    method: 'post',
    data: data
  })
}
// 注册
export const register = (data) => {
  return request({
    url: '/user/authentication',
    method: 'post',
    data: data
  })
}
// 登录
export const login = (data) => {
  return request.post('/login', data)
}
// 获取菜单管理列表
export const menuList = (params) => {
  return request.get('/menu/list', { params })
}
// 获取菜单
export const userGetMenu = () => {
  return request.get('/user/getmenu')
}
// 设置用户菜单权限
export const userSetMenu = (data) => {
  return request.post('/user/setmenu', data)
}
// 获取账号管理列表
export const authAdmin = (params) => {
  return request.get('auth/admin', { params })
}
// 获取角色下拉列表
export const menuSelectList = () => {
  return request.get('menu/selectlist')
}
// 修改用户权限
export const updateUser = (data) => {
  return request.post('/update/user', data)
}
// 获取用户的菜单
export const menuPermissions = () => {
  return request.get('/menu/permissions')
}