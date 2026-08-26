import { ref } from 'vue'
import {
  getFavorites as getFavoritesApi,
  addFavorite,
  removeFavorite
} from 'src/api/favoritesApi'

const favoriteCars = ref([])

export function useFavorites() {

  async function loadFavorites() {
    try {
      const response = await getFavoritesApi()

      favoriteCars.value = response.data
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }

  async function toggleFavorite(carId) {
    try {
      if (isFavorite(carId)) {
        await removeFavorite(carId)

        favoriteCars.value =
          favoriteCars.value.filter(
            favorite => favorite.carId !== carId
          )
      } else {
        const response = await addFavorite(carId)

        favoriteCars.value.push(response.data)
      }
    } catch (error) {
      console.error('Failed to update favorite:', error)
    }
  }

  function isFavorite(carId) {
    return favoriteCars.value.some(
      favorite => favorite.carId === carId
    )
  }

  return {
    favoriteCars,
    loadFavorites,
    toggleFavorite,
    isFavorite
  }
}