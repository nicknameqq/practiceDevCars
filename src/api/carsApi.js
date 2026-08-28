import { api } from 'boot/axios'

export function getCars(params = {}) {
  return api.get('/cars', { params })
}

export function getCarById(id) {
  return api.get(`/cars/${id}`)
}

export function createCar(data) {
  return api.post('/cars', data)
}

export function updateCar(id, data) {
  return api.put(`/cars/${id}`, data)
}

export function deleteCar(id) {
  return api.delete(`/cars/${id}`)
}