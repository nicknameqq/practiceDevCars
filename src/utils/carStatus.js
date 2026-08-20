import { isDateBooked } from 'src/utils/bookingUtils'

export function getCarStatus(car) {

  // Автомобиль вручную отключён
  if (car.status === 'unavailable') {
    return 'unavailable'
  }

  const today = new Date().toISOString().split('T')[0]

  // Проверяем бронь через общую функцию
  if (isDateBooked(car.id, today)) {
    return 'booked'
  }

  return 'available'
}