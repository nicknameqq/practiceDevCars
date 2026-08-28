export function getCarStatus(car) {
  if (car.status === 'unavailable') {
    return 'unavailable'
  }

  return 'available'
}