import { ref } from 'vue'

const STORAGE_KEY = 'bookings'

const bookings = ref(loadBookings())

function loadBookings() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function saveBookings() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(bookings.value)
  )
}

export function useBookings() {

  function createBooking(booking) {
    bookings.value.push({
      id: Date.now(),
      ...booking
    })

    saveBookings()
  }

  function removeBooking(id) {
    bookings.value = bookings.value.filter(
      booking => booking.id !== id
    )

    saveBookings()
  }

  return {
    bookings,
    createBooking,
    removeBooking
  }
}