import { computed } from 'vue'

export function useBookingCalendar(
  selectedCar,
  startDate,
  bookings
) {

  const today = new Date()
    .toLocaleDateString('en-CA')


  // Приводим дату Quasar:
  // 2026/09/01
  //
  // к формату backend:
  // 2026-09-01

  function normalizeDate(date) {

    return date.replace(/\//g, '-')

  }


  // Брони выбранного автомобиля

  const carBookings = computed(() => {

    if (!selectedCar.value) {
      return []
    }

    return bookings.value.filter(booking =>
      Number(booking.carId) === Number(selectedCar.value.id) &&
      booking.status !== 'CANCELLED'
    )

  })


  // Проверяет, занята ли дата
  //
  // endDate существующей брони НЕ считается занятой.
  //
  // Бронь:
  // 01 → 05
  //
  // Заняты:
  // 01, 02, 03, 04
  // 05 доступен для следующей брони.

  function isDateBooked(date) {

    const normalizedDate =
      normalizeDate(date)

    return carBookings.value.some(booking => {

      return (
        normalizedDate >= booking.startDate &&
        normalizedDate < booking.endDate
      )

    })

  }


  // Проверка пересечения двух интервалов
  //
  // Новый диапазон:
  // [newStart, newEnd)
  //
  // Существующая бронь:
  // [bookingStart, bookingEnd)
  //
  // Поэтому:
  //
  // 01 → 05
  // 05 → 08
  //
  // НЕ пересекаются.

  function isDateRangeBooked(
    newStart,
    newEnd
  ) {

    const normalizedStart =
      normalizeDate(newStart)

    const normalizedEnd =
      normalizeDate(newEnd)

    return carBookings.value.some(booking => {

      return (
        normalizedStart < booking.endDate &&
        normalizedEnd > booking.startDate
      )

    })

  }


  // Занятые даты для визуального отображения

  const occupiedDates = computed(() => {

    const dates = []

    for (const booking of carBookings.value) {

      const current =
        new Date(`${booking.startDate}T00:00:00`)

      const end =
        new Date(`${booking.endDate}T00:00:00`)

      // endDate не включаем

      while (current < end) {

        dates.push(
          current.toLocaleDateString('en-CA')
        )

        current.setDate(
          current.getDate() + 1
        )

      }

    }

    return [...new Set(dates)]

  })


  // Доступные даты начала

  function isStartDateAvailable(date) {

    if (date < today.replace(/-/g, '/')) {
      return false
    }

    if (!selectedCar.value) {
      return true
    }

    return !isDateBooked(date)

  }


  // Доступные даты окончания

 function isEndDateAvailable(date) {

  // Прошедшие даты запрещены

  if (date < today.replace(/-/g, '/')) {
    return false
  }

  // Если автомобиль ещё не выбран —
  // разрешаем будущие даты

  if (!selectedCar.value) {
    return true
  }

  // До выбора startDate просто блокируем
  // даты, которые уже заняты

  if (!startDate.value) {
    return !isDateBooked(date)
  }

  // EndDate должна быть позже StartDate

  if (date <= startDate.value) {
    return false
  }

  // Проверяем весь диапазон

  return !isDateRangeBooked(
    startDate.value,
    date
  )
}


  return {

    occupiedDates,

    isStartDateAvailable,

    isEndDateAvailable

  }

}

