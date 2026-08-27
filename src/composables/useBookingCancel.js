import { Notify } from 'quasar'

import {
  getCarById
} from 'src/data/cars.js'


export function useBookingCancel({
  bookings,
  removeBooking,
  addNotification
}) {

 async function cancelBooking(id) {

  const booking =
    bookings.value.find(
      booking =>
        booking.id === id
    )

  if (!booking) {
    return
  }

  const car =
    getCarById(
      booking.carId
    )

  const carName =
    car
      ? `${car.brand} ${car.model}`
      : 'Автомобиль'


  await removeBooking(id)


  addNotification({
    type: 'booking_cancelled',
    title: 'Бронирование отменено',
    message:
      `${carName} — ` +
      `${booking.startDate} → ` +
      `${booking.endDate}`,
    icon: 'event_busy',
    carId: booking.carId,
    bookingStart: booking.startDate,
    bookingEnd: booking.endDate
  })


  Notify.create({
    type: 'warning',
    message: 'Бронирование отменено',
    caption: carName,
    icon: 'event_busy',
    position: 'top-right',
    timeout: 3000
  })
}


  return {
    cancelBooking
  }

}