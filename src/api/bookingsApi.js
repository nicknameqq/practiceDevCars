import { api } from 'src/boot/axios'

export function getBookings() {
  return api.get('/bookings')
}

export function createBooking(data) {
  return api.post('/bookings', data)
}

export function cancelBooking(id) {
  return api.delete(`/bookings/${id}`)
}