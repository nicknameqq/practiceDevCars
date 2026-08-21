const STORAGE_KEY = 'bookings'

// Получить все бронирования из localStorage
function getBookings() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

// Приводит дату Quasar:
// 2026/08/20 -> 2026-08-20
export function normalizeDate(date) {
  return date.replace(/\//g, '-')
}

// Проверяет, занята ли конкретная дата
export function isDateBooked(carId, date) {
  return getBookings().some(booking => {
    if (booking.carId !== carId) {
      return false
    }

    return (
      date >= booking.startDate &&
      date < booking.endDate
    )
  })
}

// Проверяет пересечение диапазона дат
export function isDateRangeBooked(
  carId,
  startDate,
  endDate
) {
  return getBookings().some(booking => {
    if (booking.carId !== carId) {
      return false
    }

    return (
      startDate < booking.endDate &&
      endDate > booking.startDate
    )
  })
}

// Возвращает список занятых дат для q-date
export function getOccupiedDates(carId) {
  const dates = []

  getBookings().forEach(booking => {
    if (booking.carId !== carId) {
      return
    }

    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)
    const current = new Date(start)

    while (current < end) {
      const year = current.getFullYear()
      const month = String(current.getMonth() + 1).padStart(2, '0')
      const day = String(current.getDate()).padStart(2, '0')

      dates.push(`${year}/${month}/${day}`)

      current.setDate(current.getDate() + 1)
    }
  })

  return dates
}