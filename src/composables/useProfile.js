import { ref, computed } from 'vue'

import { getProfile } from 'src/api/profileApi'
import { useBookings } from './useBookings'


export function useProfile() {

  const user = ref(null)

  const loading = ref(false)
  const error = ref(null)

  const {
    bookings
  } = useBookings()


  // =========================
  // Загрузка профиля
  // =========================

  async function loadProfile() {

    loading.value = true
    error.value = null

    try {

      const response = await getProfile()

      user.value = response.data

    } catch (err) {

      console.error(
        'Failed to load profile:',
        err
      )

      error.value = err

    } finally {

      loading.value = false

    }

  }


  // =========================
  // Брони пользователя
  // =========================
    const userBookings = computed(() => {

      if (!user.value) {
        return []
      }

      return bookings.value

    })


  // =========================
  // Общая сумма
  // =========================

  const totalSpent = computed(() => {

    return userBookings.value.reduce(
      (sum, booking) =>
        sum + Number(booking.totalPrice || 0),
      0
    )

  })


  // =========================
  // Активные бронирования
  // =========================

  const activeBookings = computed(() => {

    const today =
      new Date()
        .toISOString()
        .split('T')[0]

    return userBookings.value.filter(booking => {

      return (
        booking.status === 'ACTIVE' &&
        today < booking.endDate
      )

    }).length

  })


  return {

    user,

    loading,
    error,

    userBookings,

    totalSpent,
    activeBookings,

    loadProfile

  }

}

