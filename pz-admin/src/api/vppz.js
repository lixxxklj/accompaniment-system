import request from '../utils/request'

// 获取陪护师分页列表
export const companionList = (params) => {
  return request.get('/companion/list', { params })
}

// 添加陪护师信息
export const companion = (data) => {
  return request.post('/companion', data)
}

// 获取陪护师头像
export const photoList = () => {
  return request.get('/photo/list')
}

// 删除陪护师信息
export const deleteCompanion = (data) => {
  return request.post('/delete/companion', data)
}

// 获取订单列表
export const adminOrder = (params) => {
  return request.get('admin/order', { params })
}

// 更新服务状态
export const updateOrder = (data) => {
  return request.post('/update/order', data)
}