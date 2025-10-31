import request from '../utils/request'

export default ({
  login(data) {
    return request.post('/login', data)
  },
  index() {
    return request.get('/Index/index')
  },
  h5Companion() {
    return request.get('/h5/companion')
  }
})