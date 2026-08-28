import { api } from 'src/boot/axios'

export function createPayment(bookingId) {
  return api.post(`/payments/${bookingId}`)
}

export function getPayment(bookingId) {
  return api.get(`/payments/${bookingId}`)
}