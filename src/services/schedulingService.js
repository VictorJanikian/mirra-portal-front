import api from './api'

function basePath(configId) {
  return `/api/configuration/${configId}/schedulings`
}

export default {
  getAll(configId) {
    return api.get(basePath(configId))
  },

  get(configId, schedulingId) {
    return api.get(`${basePath(configId)}/${schedulingId}`)
  },

  create(configId, data) {
    return api.post(basePath(configId), data)
  },

  update(configId, schedulingId, data) {
    return api.put(`${basePath(configId)}/${schedulingId}`, data)
  },

  delete(configId, schedulingId) {
    return api.delete(`${basePath(configId)}/${schedulingId}`)
  }
}
