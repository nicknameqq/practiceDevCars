import { computed } from 'vue'

import {
  isDateBooked,
  isDateRangeBooked,
  getOccupiedDates,
  normalizeDate
} from 'src/utils/bookingUtils'

export function useBookingCalendar(
  selectedCar,
  startDate
) {

  // Сегодняшняя дата

  const today = new Date()
    .toISOString()
    .split('T')[0]


  // Занятые даты

  const occupiedDates = computed(() => {

    if (!selectedCar.value) {
      return []
    }

    return getOccupiedDates(
      selectedCar.value.id
    )

  })


  // Доступные даты начала

  function isStartDateAvailable(date) {

    const current = normalizeDate(date)

    if (current < today) {
      return false
    }

    if (!selectedCar.value) {
      return true
    }

    return !isDateBooked(
      selectedCar.value.id,
      current
    )

  }


  // Доступные даты окончания

  function isEndDateAvailable(date) {

    const current = normalizeDate(date)

    if (!startDate.value) {
      return false
    }

    if (current <= startDate.value) {
      return false
    }

    if (!selectedCar.value) {
      return true
    }

    return !isDateRangeBooked(
      selectedCar.value.id,
      startDate.value,
      current
    )

  }


  return {

    occupiedDates,

    isStartDateAvailable,

    isEndDateAvailable

  }

}