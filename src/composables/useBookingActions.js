import { Notify } from 'quasar'

import {
  getCarById
} from 'src/data/cars.js'


export function useBookingActions({

  selectedCar,

  startDate,

  endDate,

  rentalDays,

  totalPrice,

  canBook,

  addBooking,

  removeBooking,

  addNotification,

  addFutureBookingNotification,

  bookings

}) {


  // =========================
  // СОЗДАНИЕ БРОНИРОВАНИЯ
  // =========================

  function createBooking() {

    if (!canBook.value) {
      return
    }


    const carId =
      selectedCar.value.id


    const carName =
      `${selectedCar.value.brand} ` +
      `${selectedCar.value.model}`


    const bookingStart =
      startDate.value


    const bookingEnd =
      endDate.value


    const bookingDays =
      rentalDays.value


    const bookingPrice =
      totalPrice.value


    // =========================
    // СОХРАНЯЕМ БРОНИРОВАНИЕ
    // =========================

    addBooking({

      carId,

      startDate:
        bookingStart,

      endDate:
        bookingEnd,

      days:
        bookingDays,

      totalPrice:
        bookingPrice

    })


    // =========================
    // УВЕДОМЛЕНИЕ О СОЗДАНИИ
    // =========================

    addNotification({

      type:
        'booking',

      title:
        'Бронирование создано',

      message:
        `${carName} — ` +
        `${bookingStart} → ${bookingEnd}`,

      icon:
        'event_available'

    })


    // =========================
    // УВЕДОМЛЕНИЕ О БУДУЩЕЙ АРЕНДЕ
    // =========================

    addFutureBookingNotification({

      carId,

      carName,

      startDate:
        bookingStart,

      endDate:
        bookingEnd

    })


    // =========================
    // ОЧИЩАЕМ ФОРМУ
    // =========================

    startDate.value = ''

    endDate.value = ''

  }


  // =========================
  // ОТМЕНА БРОНИРОВАНИЯ
  // =========================

  function cancelBooking(id) {

    // =========================
    // НАХОДИМ БРОНИРОВАНИЕ
    // =========================

    const booking =
      bookings.value.find(

        booking =>
          booking.id === id

      )


    if (!booking) {
      return
    }


    // =========================
    // НАХОДИМ АВТОМОБИЛЬ
    // =========================

    const car =
      getCarById(
        booking.carId
      )


    // =========================
    // НАЗВАНИЕ АВТОМОБИЛЯ
    // =========================

    const carName =
      car
        ? `${car.brand} ${car.model}`
        : 'Автомобиль'


    // =========================
    // УДАЛЯЕМ БРОНИРОВАНИЕ
    // =========================

    removeBooking(id)


    // =========================
    // СОЗДАЁМ УВЕДОМЛЕНИЕ
    // =========================

    addNotification({

      type:
        'booking_cancelled',

      title:
        'Бронирование отменено',

      message:
        `${carName} — ` +
        `${booking.startDate} → ` +
        `${booking.endDate}`,

      icon:
        'event_busy',

      carId:
        booking.carId,

      bookingStart:
        booking.startDate,

      bookingEnd:
        booking.endDate

    })


    // =========================
    // ВСПЛЫВАЮЩЕЕ УВЕДОМЛЕНИЕ
    // =========================

    Notify.create({

      type:
        'warning',

      message:
        'Бронирование отменено',

      caption:
        carName,

      icon:
        'event_busy',

      position:
        'top-right',

      timeout:
        3000

    })

  }


  return {

    createBooking,

    cancelBooking

  }

}