import bookings from 'src/data/bookings.js'


// Приводит дату Quasar:
// 2026/08/20
// к формату:
// 2026-08-20
export function normalizeDate(date) {
  return date.replace(/\//g, '-')
}


// Проверяет, занята ли конкретная дата
export function isDateBooked(carId, date) {

  return bookings.some(booking => {

    if (booking.carId !== carId) {
      return false
    }

    return (
      date >= booking.startDate &&
      date < booking.endDate
    )
  })
}


// Проверяет, пересекается ли диапазон
// с существующей бронью
export function isDateRangeBooked(
  carId,
  startDate,
  endDate
) {

  return bookings.some(booking => {

    if (booking.carId !== carId) {
      return false
    }

    return (
      startDate < booking.endDate &&
      endDate > booking.startDate
    )
  })
}


// Возвращает занятые даты автомобиля
// для отображения в q-date
export function getOccupiedDates(carId) {

  const dates = []

  bookings.forEach(booking => {

    if (booking.carId !== carId) {
      return
    }

    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)

    const current = new Date(start)

    while (current < end) {

      const year = current.getFullYear()

      const month = String(
        current.getMonth() + 1
      ).padStart(2, '0')

      const day = String(
        current.getDate()
      ).padStart(2, '0')

      dates.push(
        `${year}/${month}/${day}`
      )

      current.setDate(
        current.getDate() + 1
      )
    }
  })

  return dates
}