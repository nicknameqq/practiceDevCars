import { computed } from 'vue'
import cars from 'src/data/cars'
import { useBookings } from './useBookings'

const CURRENT_USER_ID = 1

export function useProfile() {
  const { bookings } = useBookings()

  const today = new Date().toISOString().split('T')[0]

  function getStatus(startDate, endDate) {
    if (today < startDate) {
      return {
        label: 'Предстоит',
        color: 'info'
      }
    }

    if (today >= endDate) {
      return {
        label: 'Завершено',
        color: 'grey-7'
      }
    }

    return {
      label: 'Активно',
      color: 'positive'
    }
  }

  const userBookings = computed(() => {
    return bookings.value
      .filter(booking => booking.userId === CURRENT_USER_ID)
      .map(booking => {
        const car = cars.find(c => c.id === booking.carId)

        const start = new Date(booking.startDate)
        const end = new Date(booking.endDate)

        const days = Math.round(
          (end - start) / (1000 * 60 * 60 * 24)
        )

        return {
          ...booking,
          car,
          days,
          totalPrice: days * car.price,
          status: getStatus(
            booking.startDate,
            booking.endDate
          )
        }
      })
  })

  const totalSpent = computed(() =>
    userBookings.value.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    )
  )

  const activeBookings = computed(() =>
    userBookings.value.filter(
      booking => booking.status.label === 'Активно'
    ).length
  )

  const user = {
    id: 1,
    name: 'Artem',
    email: 'artem@email.com'
  }

  return {
    user,
    userBookings,
    totalSpent,
    activeBookings
  }
}