import api from './api'

export default {
  login(email, password) {
    return api.post('/api/account/login', { Email: email, Password: password })
  },

  register(name, email, password) {
    return api.post('/api/account/register', { Name: name, Email: email, Password: password })
  },

  activate(email, code) {
    return api.post('/api/account/activate', { Email: email, Code: code })
  }
}
