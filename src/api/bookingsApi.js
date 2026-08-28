import { api } from 'src/boot/axios'

export function getBookings(page = 0, size = 12) {
  return api.get('/bookings', {
    params: {
      page,
      size
    }
  })
}

export function createBooking(data) {
  return api.post('/bookings', data)
}

export function cancelBooking(id) {
  return api.put(`/bookings/${id}/cancel`)
}

export function cancelBookingByAdmin(id) {
  return api.put(`/admin/bookings/${id}/cancel`)
}

export function updateBookingStatus(id, status) {
  return api.put(`/admin/bookings/${id}/status`, status, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}