import api from './api'

export default {
  getAll() {
    return api.get('/api/configuration')
  },

  create(data) {
    return api.post('/api/configuration', data)
  }
}
