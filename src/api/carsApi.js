import { api } from 'boot/axios'

export function getCars(params = {}) {
  return api.get('/cars', { params })
}

export function getCarById(id) {
  return api.get(`/cars/${id}`)
}