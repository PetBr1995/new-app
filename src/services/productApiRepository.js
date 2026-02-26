import { apiClient } from './apiClient'

export const productApiRepository = {
  async list() {
    return apiClient.get('/products')
  },

  async create(produto) {
    return apiClient.post('/products', produto)
  },

  async update(id, payload) {
    return apiClient.put(`/products/${id}`, payload)
  },

  async remove(id) {
    return apiClient.delete(`/products/${id}`)
  },

  async clear() {
    return apiClient.delete('/products')
  },
}
