import { ref } from 'vue'
import {
  getBookings,
  createBooking,
  cancelBooking
} from 'src/api/bookingsApi'

const bookings = ref([])

export function useBookings() {

  async function loadBookings() {
    try {
      const response = await getBookings()

      bookings.value = response.data.content
    } catch (error) {
      console.error('Failed to load bookings:', error)
    }
  }

  async function addBooking(booking) {
    try {
      const response = await createBooking(booking)

      bookings.value.push(response.data)

      return response.data
    } catch (error) {
      console.error('Failed to create booking:', error)
      throw error
    }
  }

  async function removeBooking(id) {
    try {
      await cancelBooking(id)

      bookings.value =
        bookings.value.filter(
          booking => booking.id !== id
        )
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      throw error
    }
  }

  return {
    bookings,
    loadBookings,
    addBooking,
    removeBooking
  }
}

