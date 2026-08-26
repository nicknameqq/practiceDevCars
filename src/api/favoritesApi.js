import { api } from 'src/boot/axios'

export function getFavorites() {
  return api.get('/favorites')
}

export function addFavorite(carId) {
  return api.post(`/favorites/${carId}`)
}

export function removeFavorite(carId) {
  return api.delete(`/favorites/${carId}`)
}