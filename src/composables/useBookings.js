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

      console.log('BOOKINGS FROM BACKEND:', response.data)
      console.log('FIRST BOOKING:', response.data.content[0])

      bookings.value = response.data.content
    } catch (error) {
      console.error('Failed to load bookings:', error)
    }
  }
  
async function addBooking(booking) {
  try {
    const response = await createBooking(booking)

    await loadBookings()

    return response.data
  } catch (error) {
    console.error(
      'Failed to create booking:',
      error
    )

    throw error
  }
}

async function removeBooking(id) {
  try {
    const response = await cancelBooking(id)

    const updatedBooking = response.data

    const index = bookings.value.findIndex(
      booking => booking.id === id
    )

    if (index !== -1) {
      bookings.value[index] = updatedBooking
    }

    return updatedBooking
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

