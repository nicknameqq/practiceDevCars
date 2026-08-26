<template>
  <q-layout view="hHh Lpr lFf">

    <!-- =========================
         ВЕРХНЯЯ ПАНЕЛЬ
         ========================= -->

    <q-header>

      <q-toolbar>

        <!-- Кнопка меню -->

        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="toggleLeftDrawer"
        />


        <!-- Логотип + название -->

        <div
          class="app-brand"
          @click="$router.push('/')"
        >

          <q-avatar
            color="primary"
            text-color="white"
            size="36px"
          >
            <q-icon name="directions_car" />
          </q-avatar>


          <q-toolbar-title class="app-title">
            Car Rental
          </q-toolbar-title>

        </div>


        <!-- Свободное пространство -->

        <q-space />


        <!-- =========================
             ДЕЙСТВИЯ СПРАВА
             ========================= -->

        <div class="header-actions">


          <!-- =========================
               УВЕДОМЛЕНИЯ
               ========================= -->

          <q-btn
            flat
            round
            icon="notifications_none"
          >

            <!-- Количество непрочитанных -->

            <q-badge
              v-if="unreadCount > 0"
              color="red"
              floating
              rounded
              :label="unreadCount"
            />


            <!-- =========================
                 ОКНО УВЕДОМЛЕНИЙ
                 ========================= -->

            <q-menu
              anchor="bottom right"
              self="top right"
              :offset="[0, 10]"
              class="notifications-menu"
            >

              <div class="notifications-container">


                <!-- =========================
                     ЗАГОЛОВОК
                     ========================= -->

                <div class="notifications-header">

                  <div class="notifications-title">
                    Уведомления
                  </div>


                  <div class="notifications-header-actions">


                    <!-- Прочитать все -->

                    <q-btn
                      v-if="unreadCount > 0"
                      flat
                      dense
                      size="sm"
                      label="Прочитать все"
                      @click.stop="markAllAsRead"
                    />


                    <!-- Удалить все -->

                    <q-btn
                      v-if="notifications.length > 0"
                      flat
                      round
                      dense
                      icon="delete_outline"
                      class="delete-all-button"
                      @click.stop="removeAllNotifications"
                    >

                      <q-tooltip>
                        Удалить все уведомления
                      </q-tooltip>

                    </q-btn>

                  </div>

                </div>


                <q-separator />


                <!-- =========================
                     НЕТ УВЕДОМЛЕНИЙ
                     ========================= -->

                <div
                  v-if="notifications.length === 0"
                  class="notifications-empty"
                >

                  <q-icon
                    name="notifications_none"
                    size="40px"
                  />

                  <div>
                    Уведомлений пока нет
                  </div>

                </div>


                <!-- =========================
                     СПИСОК УВЕДОМЛЕНИЙ
                     ========================= -->

                <div
                  v-else
                  class="notifications-list"
                >

                  <!-- Одно уведомление -->

                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="notification-item"
                    :class="{
                      'notification-unread':
                        !notification.read
                    }"
                    @click="
                      handleNotificationClick(
                        notification.id
                      )
                    "
                  >

                    <!-- Иконка -->

                    <q-icon
                      :name="notification.icon"
                      size="28px"
                      class="notification-icon"
                    />


                    <!-- Текст -->

                    <div class="notification-content">

                      <div class="notification-title">
                        {{ notification.title }}
                      </div>


                      <div class="notification-message">
                        {{ notification.message }}
                      </div>


                      <div class="notification-time">
                        {{
                          formatNotificationDate(
                            notification.createdAt
                          )
                        }}
                      </div>

                    </div>


                    <!-- Индикатор непрочитанного -->

                    <div
                      v-if="!notification.read"
                      class="unread-dot"
                    ></div>

                  </div>

                </div>

              </div>

            </q-menu>

          </q-btn>


          <!-- =========================
               ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
               ========================= -->

     
            <ThemeToggle />

            <!-- =========================
                АВТОРИЗАЦИЯ
                ========================= -->

            <q-btn
              v-if="!isAuthenticated"
              flat
              label="Войти"
              icon="login"
              @click="router.push('/login')"
            />

            <template v-else>

              <q-avatar size="36px">
                <img
                  src="https://cdn.quasar.dev/img/avatar.png"
                >
              </q-avatar>

              <q-btn
                flat
                label="Выйти"
                icon="logout"
                @click="handleLogout"
              />

            </template>




          <!-- =========================
               ПРОФИЛЬ
               ========================= -->

        </div>

      </q-toolbar>

    </q-header>


    <!-- =========================
         БОКОВАЯ ПАНЕЛЬ
         ========================= -->

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="220"
    >

      <q-list padding>


        <!-- Главная -->

        <q-item
          clickable
          v-ripple
          to="/"
          exact
        >

          <q-item-section avatar>

            <q-icon name="home" />

          </q-item-section>


          <q-item-section>
            Главная
          </q-item-section>

        </q-item>


        <!-- Автомобили -->

        <q-item
          clickable
          v-ripple
          to="/cars"
        >

          <q-item-section avatar>

            <q-icon name="directions_car" />

          </q-item-section>


          <q-item-section>
            Автомобили
          </q-item-section>

        </q-item>


        <!-- Бронирования -->

        <q-item
          clickable
          v-ripple
          to="/bookings"
        >

          <q-item-section avatar>

            <q-icon name="event" />

          </q-item-section>


          <q-item-section>
            Бронирования
          </q-item-section>

        </q-item>


        <!-- Избранное -->

        <q-item
          clickable
          v-ripple
          to="/favorites"
        >

          <q-item-section avatar>

            <q-icon name="favorite_border" />

          </q-item-section>


          <q-item-section>
            Избранное
          </q-item-section>


          <q-item-section
            v-if="favoritesCount > 0"
            side
          >

            <q-badge
              color="red"
              :label="favoritesCount"
            />

          </q-item-section>

        </q-item>


        <q-separator class="q-my-md" />


        <!-- Личный кабинет -->

        <q-item
          clickable
          v-ripple
          to="/profile"
        >

          <q-item-section avatar>

            <q-icon name="person_outline" />

          </q-item-section>


          <q-item-section>
            Личный кабинет
          </q-item-section>

        </q-item>


        <!-- Отчёты -->

        <q-item
          clickable
          v-ripple
          to="/reports"
        >

          <q-item-section avatar>

            <q-icon name="bar_chart" />

          </q-item-section>


          <q-item-section>
            Отчёты
          </q-item-section>

        </q-item>


        <!-- Настройки -->

        <q-item
          clickable
          v-ripple
          to="/settings"
        >

          <q-item-section avatar>

            <q-icon name="settings" />

          </q-item-section>


          <q-item-section>
            Настройки
          </q-item-section>

        </q-item>

      </q-list>

    </q-drawer>


    <!-- =========================
         СОДЕРЖИМОЕ
         ========================= -->

    <q-page-container>

      <router-view />

    </q-page-container>

  </q-layout>
</template>



<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import ThemeToggle from 'src/components/ThemeToggle.vue'
import { useFavorites } from 'src/composables/useFavorites.js'
import { useNotifications } from 'src/composables/useNotifications.js'
import { useAuth } from 'src/composables/useAuth.js'

const router = useRouter()

const { isAuthenticated, logout } = useAuth()

function handleLogout() {
  logout()
  router.push('/login')
}

// =========================
// DRAWER
// =========================

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// =========================
// ИЗБРАННОЕ
// =========================

const { favoriteCars } = useFavorites()

const favoritesCount = computed(() => {
  return favoriteCars.value.length
})

// =========================
// УВЕДОМЛЕНИЯ
// =========================

const {
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  removeAllNotifications
} = useNotifications()

// =========================
// КЛИК ПО УВЕДОМЛЕНИЮ
// =========================

function handleNotificationClick(id) {
  markAsRead(id)
}

// =========================
// ФОРМАТИРОВАНИЕ ДАТЫ
// =========================

function formatNotificationDate(date) {
  return new Date(date).toLocaleString(
    'ru-RU',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  )
}
</script>




<style scoped>

/* =========================
   ЛОГОТИП
   ========================= */

.app-brand {

  display: flex;

  align-items: center;

  gap: 4px;

  margin-left: 15px;

  cursor: pointer;

  transition:
    opacity 0.2s ease;

}


.app-brand:hover {

  opacity: 0.7;

}


.app-title {

  margin: 0;

  cursor: pointer;

}


/* =========================
   ПРАВАЯ ЧАСТЬ HEADER
   ========================= */

.header-actions {

  display: flex;

  align-items: center;

  gap: 15px;

  margin-right: 5px;

}


/* =========================
   МЕНЮ УВЕДОМЛЕНИЙ
   ========================= */

.notifications-menu {

  border-radius: 14px;

}


.notifications-container {

  width: 380px;

  max-width: 90vw;

  background:
    var(--q-card);

  color:
    var(--q-text);

}


/* =========================
   ЗАГОЛОВОК
   ========================= */

.notifications-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 15px 18px;

}

.q-header .q-toolbar {
  min-height: 64px;
}

.notifications-title {

  font-size: 18px;

  font-weight: 700;

  color:
    var(--q-text);

}


.notifications-header-actions {

  display: flex;

  align-items: center;

  gap: 4px;

}


.notifications-header-actions
:deep(.q-btn) {

  color:
    var(--q-primary);

}


/* =========================
   КОРЗИНА "УДАЛИТЬ ВСЕ"
   ========================= */

.delete-all-button {

  color:
    #e57373 !important;

  opacity: 0.85;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

}


.delete-all-button:hover {

  color:
    #ef5350 !important;

  opacity: 1;

  transform:
    scale(1.08);

}


/* =========================
   НЕТ УВЕДОМЛЕНИЙ
   ========================= */

.notifications-empty {

  min-height: 180px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 10px;

  color:
    var(--q-text);

  opacity: 0.6;

}


/* =========================
   СПИСОК
   ========================= */

.notifications-list {

  max-height: 400px;

  overflow-y: auto;

}


/* =========================
   ОДНО УВЕДОМЛЕНИЕ
   ========================= */

.notification-item {

  position: relative;

  display: flex;

  align-items: flex-start;

  gap: 12px;

  padding: 15px 18px;

  cursor: pointer;

  color:
    var(--q-text);

  transition:
    background 0.2s ease;

}


/* =========================
   HOVER
   ========================= */

.notification-item:hover {

  background:
    rgba(128, 128, 128, 0.08);

}


/* =========================
   НЕПРОЧИТАННОЕ
   ========================= */

.notification-unread {

  background:
    rgba(25, 118, 210, 0.08);

}


.notification-unread:hover {

  background:
    rgba(25, 118, 210, 0.14);

}


/* =========================
   ИКОНКА
   ========================= */

.notification-icon {

  margin-top: 2px;

  color:
    var(--q-primary);

  flex-shrink: 0;

}


/* =========================
   ТЕКСТ
   ========================= */

.notification-content {

  flex: 1;

  min-width: 0;

}


.notification-title {

  font-weight: 600;

  margin-bottom: 4px;

  color:
    var(--q-text);

}


.notification-message {

  font-size: 14px;

  line-height: 1.4;

  color:
    var(--q-text);

  opacity: 0.8;

  word-break: break-word;

}


.notification-time {

  margin-top: 5px;

  font-size: 12px;

  color:
    var(--q-text);

  opacity: 0.5;

}


/* =========================
   ТОЧКА НЕПРОЧИТАННОГО
   ========================= */

.unread-dot {

  width: 8px;

  height: 8px;

  margin-top: 7px;

  border-radius: 50%;

  background:
    var(--q-primary);

  flex-shrink: 0;

}


/* =========================
   АДАПТИВНОСТЬ
   ========================= */

@media (max-width: 500px) {

  .notifications-container {

    width: 340px;

  }

}

</style>