import cars from 'src/data/cars.js'

export function useBookingNotifications(
  bookings,
  notifications,
  addNotification
) {

  // =========================
  // УВЕДОМЛЕНИЕ О ПРЕДСТОЯЩЕЙ АРЕНДЕ
  // =========================

  function addFutureBookingNotification({
    carId,
    carName,
    startDate,
    endDate
  }) {

    const alreadyExists =
      notifications.value.some(
        notification =>
          notification.type ===
            'booking_upcoming' &&

          notification.bookingStart ===
            startDate &&

          notification.bookingEnd ===
            endDate &&

          notification.carId ===
            carId
      )

    if (alreadyExists) {
      return
    }

    addNotification({

      type:
        'booking_upcoming',

      title:
        'Майбутнє бронювання',

      message:
        `${carName} — ` +
        `Початок аренди ${startDate}. ` +
        `Кінець аренди: ${endDate}`,

      icon:
        'event',

      carId,

      bookingStart:
        startDate,

      bookingEnd:
        endDate

    })
  }


  // =========================
  // ПРОВЕРКА БУДУЩИХ БРОНИРОВАНИЙ
  // =========================

  function checkUpcomingBookings() {

    bookings.value.forEach(
      booking => {

        const car =
          cars.find(
            car =>
              car.id === booking.carId
          )

        if (!car) {
          return
        }

        const start =
          new Date(booking.startDate)

        const now =
          new Date()

        const difference =
          start - now

        const daysUntilStart =
          difference /
          (1000 * 60 * 60 * 24)

        // Бронирование начинается
        // в ближайшие 7 дней

        if (
          daysUntilStart >= 0 &&
          daysUntilStart <= 7
        ) {

          addFutureBookingNotification({

            carId:
              booking.carId,

            carName:
              `${car.brand} ${car.model}`,

            startDate:
              booking.startDate,

            endDate:
              booking.endDate

          })
        }
      }
    )
  }


  return {
    addFutureBookingNotification,
    checkUpcomingBookings
  }
}