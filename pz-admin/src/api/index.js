import request from '../utils/request'

export const getCode = (data) => {
  return request({
    url: '/get/code',
    method: 'post',
    data: data
  })
}

export const register = (data) => {
  return request({
    url: '/user/authentication',
    method: 'post',
    data: data
  })
}

export const login = (data) => {
  return request.post('/login', data)
}