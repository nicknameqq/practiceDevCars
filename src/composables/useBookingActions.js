import { Notify } from 'quasar'



export function useBookingActions({
  selectedCar,
  startDate,
  endDate,
  totalPrice,
  canBook,
  addBooking,
  addNotification,
  addFutureBookingNotification
}) {


  // =========================
  // СОЗДАНИЕ БРОНИРОВАНИЯ
  // =========================


async function createBooking() {

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

  const bookingPrice =
    totalPrice.value

  try {

    const booking = await addBooking({

      carId,

      startDate:
        bookingStart,

      endDate:
        bookingEnd,

      totalPrice:
        bookingPrice

    })

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

    startDate.value = ''
    endDate.value = ''

    return booking

  } catch (error) {

    console.error(
      'Failed to create booking:',
      error
    )

    Notify.create({
      type: 'negative',
      message: 'Не удалось создать бронирование',
      position: 'top-right',
      timeout: 3000
    })

  }
}




  // =========================
  // ОТМЕНА БРОНИРОВАНИЯ
  // =========================


  return {
    createBooking
  }

}