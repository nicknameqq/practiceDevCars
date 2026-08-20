const FAVORITES_KEY = 'favoriteCars'

export function getFavorites() {
  const favorites = localStorage.getItem(FAVORITES_KEY)

  return favorites ? JSON.parse(favorites) : []
}

export function isFavorite(carId) {
  const favorites = getFavorites()

  return favorites.includes(carId)
}

export function toggleFavorite(carId) {
  const favorites = getFavorites()

  if (favorites.includes(carId)) {
    const updatedFavorites = favorites.filter(id => id !== carId)

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updatedFavorites)
    )

    return false
  }

  favorites.push(carId)

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites)
  )

  return true
}