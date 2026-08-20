import { ref } from 'vue'
import {
  getFavorites,
  toggleFavorite as toggleFavoriteStorage
} from 'src/utils/favoritesUtils.js'

const favoriteCars = ref(getFavorites())

export function useFavorites() {

  function toggleFavorite(carId) {
    toggleFavoriteStorage(carId)

    favoriteCars.value = getFavorites()
  }

  function isFavorite(carId) {
    return favoriteCars.value.includes(carId)
  }

  return {
    favoriteCars,
    toggleFavorite,
    isFavorite
  }
}