import { Notify } from 'quasar'



export function useBookingActions({
  selectedCar,
  startDate,
  endDate,
  rentalDays,
  totalPrice,
  canBook,
  addBooking,
  addNotification,
  addFutureBookingNotification
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

      userId: 1, 
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



          Notify.create({
        type: 'positive',
        message: 'Бронирование создано',
        caption: carName,
        icon: 'event_available',
        position: 'top-right',
        timeout: 3000
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


  return {
    createBooking
  }

}