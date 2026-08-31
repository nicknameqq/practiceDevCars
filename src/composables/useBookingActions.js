import { Notify } from 'quasar'


export function useBookingActions({
  selectedCar,
  startDate,
  endDate,
  totalPrice,
  canBook,
  addBooking
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

    const bookingStart =
      startDate.value

    const bookingEnd =
      endDate.value

    const bookingPrice =
      totalPrice.value

    try {

      const booking =
        await addBooking({

          carId,

          startDate:
            bookingStart,

          endDate:
            bookingEnd,

          totalPrice:
            bookingPrice

        })

      /*
       * ВАЖНО:
       *
       * Здесь НЕ создаём notification.
       *
       * Бронь создана, но пользователь
       * ещё не оплатил её.
       *
       * Уведомление "Бронирование создано"
       * будет создано после успешной оплаты
       * в BookingsPage.vue.
       */

      startDate.value = ''
      endDate.value = ''

      return booking

    } catch (error) {

      console.error(
        'Failed to create booking:',
        error
      )

      Notify.create({

        type:
          'negative',

        message:
          'Не вдалось створити бронювання',

        position:
          'top-right',

        timeout:
          3000

      })

      throw error
    }
  }


  // =========================
  // RETURN
  // =========================

  return {
    createBooking
  }

}