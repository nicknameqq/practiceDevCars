import { ref, computed } from 'vue'

const STORAGE_KEY = 'notifications'


// =========================
// ЗАГРУЗКА УВЕДОМЛЕНИЙ
// =========================

const notifications = ref(
  JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '[]'
  )
)


// =========================
// СОХРАНЕНИЕ
// =========================

function saveNotifications() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notifications.value)
  )

}


// =========================
// COMPOSABLE
// =========================

export function useNotifications() {


  // =========================
  // ДОБАВИТЬ УВЕДОМЛЕНИЕ
  // =========================

  function addNotification({

    type = 'info',

    title,

    message,

    icon = 'notifications',

    carId = null,

    bookingStart = null,

    bookingEnd = null

  }) {

    const notification = {

      id: crypto.randomUUID(),

      type,

      title,

      message,

      icon,

      read: false,

      createdAt:
        new Date().toISOString(),

      carId,

      bookingStart,

      bookingEnd

    }


    notifications.value.unshift(
      notification
    )


    saveNotifications()

  }


  // =========================
  // ПРОЧИТАТЬ
  // =========================

  function markAsRead(id) {

    const notification =
      notifications.value.find(
        notification =>
          notification.id === id
      )


    if (!notification) {
      return
    }


    notification.read = true


    saveNotifications()

  }


  // =========================
  // ПРОЧИТАТЬ ВСЕ
  // =========================

  function markAllAsRead() {

    notifications.value.forEach(
      notification => {

        notification.read = true

      }
    )


    saveNotifications()

  }


  // =========================
  // УДАЛИТЬ ОДНО
  // =========================

  function removeNotification(id) {

    notifications.value =
      notifications.value.filter(
        notification =>
          notification.id !== id
      )


    saveNotifications()

  }


  // =========================
  // УДАЛИТЬ ВСЕ
  // =========================

  function removeAllNotifications() {

    notifications.value = []

    saveNotifications()

  }


  // =========================
  // КОЛИЧЕСТВО НЕПРОЧИТАННЫХ
  // =========================

  const unreadCount = computed(() => {

    return notifications.value.filter(
      notification =>
        !notification.read
    ).length

  })


  // =========================
  // RETURN
  // =========================

  return {

    notifications,

    unreadCount,

    addNotification,

    markAsRead,

    markAllAsRead,

    removeNotification,

    removeAllNotifications

  }

}