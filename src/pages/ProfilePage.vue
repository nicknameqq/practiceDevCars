<template>
  <q-page class="profile-page">
    <div class="page-content">

      <h1>Личный кабинет</h1>
      <p class="subtitle">
        Ваш профиль и история бронирований
      </p>

      <!-- Профиль -->
      <q-card
          v-if="user"
          class="profile-card"
          flat
        >
        
        <div class="profile-info">
          <q-avatar
            size="90px"
            color="primary"
            text-color="white"
            icon="person"
          />

          <div>
            <div class="user-name">{{ user.username }}</div>
            <div class="user-email">{{ user.email }}</div>
          </div>
        </div>
      </q-card>

      <q-card
        v-else
        class="profile-card"
        flat
      >
        Загрузка профиля...
      </q-card>

        <div class="profile-stats">

          <q-card
            class="stat-card"
            flat
          >
            <div class="stat-value">
              {{ userBookings.length }}
            </div>

            <div class="stat-label">
              Всего бронирований
            </div>
          </q-card>


          <q-card
            class="stat-card"
            flat
          >
            <div class="stat-value">
              {{ activeBookings }}
            </div>

            <div class="stat-label">
              Активных бронирований
            </div>
          </q-card>


          <q-card
            class="stat-card"
            flat
          >
            <div class="stat-value">
              {{ totalSpent }} ₴
            </div>

            <div class="stat-label">
              Потрачено всего
            </div>
          </q-card>

        </div>

          <div class="quick-actions">

            <q-btn
              unelevated
              color="primary"
              icon="directions_car"
              label="Забронировать автомобиль"
              class="quick-action-btn"
              to="/bookings"
            />

            <q-btn
              outline
              color="primary"
              icon="favorite"
              label="Избранное"
              class="quick-action-btn"
              to="/favorites"
            />

          </div>


      <h2 class="section-title">Мои бронирования</h2>

      <div
        v-if="userBookings.length"
        class="bookings-list"
      >
        <q-card
          v-for="booking in userBookings"
          :key="booking.id"
          class="booking-card"
          flat
        >
          <div class="booking-content">

            <!-- Фото -->
            <q-img
              :src="booking.car.image"
              class="car-image"
              :ratio="5/4"
            />

            <!-- Информация -->
            <div class="booking-info">

              <div class="booking-header">
                <div>
                  <div class="car-title">
                    {{ booking.car.brand }} {{ booking.car.model }}
                  </div>
                  <div class="car-year">
                    {{ booking.car.year }}
                  </div>
                </div>

                <q-chip
                  :color="getBookingStatus(booking.status).color"
                  text-color="white"
                >
                  {{ getBookingStatus(booking.status).label }}
                </q-chip>
              </div>

              <q-separator />

              <div class="booking-grid">

                <div>
                  <div class="label">Дата начала</div>
                  <div>{{ formatDate(booking.startDate) }}</div>
                </div>

                <div>
                  <div class="label">Дата окончания</div>
                  <div>{{ formatDate(booking.endDate) }}</div>
                </div>

                <div>
                  <div class="label">Дней</div>
                  <div>{{ getBookingDays(booking.startDate, booking.endDate) }}</div>                </div>

                <div>
                  <div class="label">Стоимость</div>
                  <div class="price">
                    {{ booking.totalPrice }} ₴
                  </div>
                </div>

              </div>

           <q-btn
              outline
              color="negative"
              label="Отменить бронирование"
              class="cancel-btn"
              :disable="
                booking.status === 'CANCELLED' ||
                booking.status === 'COMPLETED'
              "
              @click="cancelBooking(booking.id)"
            />

            </div>

          </div>
        </q-card>
      </div>

      <q-card
        v-else
        class="empty-card"
        flat
      >
        У вас пока нет бронирований
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'

import { useProfile } from 'src/composables/useProfile'
import { useBookings } from 'src/composables/useBookings'
import { useNotifications } from 'src/composables/useNotifications'
import { useBookingCancel } from 'src/composables/useBookingCancel'



const {
  user,
  userBookings,
  totalSpent,
  activeBookings,
  loadProfile
} = useProfile()

const {
  bookings,
  loadBookings,
  removeBooking
} = useBookings()

const {
  addNotification
} = useNotifications()

const {
  cancelBooking
} = useBookingCancel({
  bookings,
  removeBooking,
  addNotification
})

function formatDate(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date))
}

function getBookingStatus(status) {
  const statuses = {
    PENDING: {
      label: 'Ожидает подтверждения',
      color: 'orange'
    },
    ACTIVE: {
      label: 'Активно',
      color: 'positive'
    },
    COMPLETED: {
      label: 'Завершено',
      color: 'grey'
    },
    CANCELLED: {
      label: 'Отменено',
      color: 'negative'
    }
  }

  return statuses[status] || {
    label: status,
    color: 'grey'
  }
}

function getBookingDays(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return Math.round(
    (end - start) / (1000 * 60 * 60 * 24)
  )
}


onMounted(async () => {
  await loadProfile()
  await loadBookings()
})



</script>

<style scoped>
.profile-page {
  min-height: 100%;
  background: var(--q-background);
}

.page-content {
  max-width: 1050px;
  margin: 0 auto;
  padding: 40px 24px;
}


.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 34px;
}

.stat-card {
  padding: 24px;
  text-align: center;

  background: var(--q-card);
  border: 1px solid var(--q-border);
  border-radius: 18px;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
}

.stat-label {
  margin-top: 6px;
  opacity: .65;
  font-size: 14px;
}

h1 {
  margin: 0;
  text-align: center;
  font-size: 34px;
}

.subtitle {
  text-align: center;
  margin: 10px 0 30px;
  opacity: .7;
}

.profile-card,
.booking-card,
.empty-card {
  background: var(--q-card);
  border: 1px solid var(--q-border);
  border-radius: 18px;
}

.profile-card {
  padding: 24px;
  margin-bottom: 34px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 22px;
}

.user-name {
  font-size: 24px;
  font-weight: 800;
}

.user-email {
  opacity: .7;
  margin-top: 4px;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 20px;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.booking-card {
  padding: 20px;
}

.booking-content {
  display: flex;
  gap: 22px;
}

.car-image {
  width: 230px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
}

.booking-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.car-title {
  font-size: 22px;
  font-weight: 700;
}

.car-year {
  opacity: .65;
  margin-top: 2px;
}

.booking-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin: 18px 0 20px;
}

.label {
  font-size: 13px;
  color: var(--q-text-secondary);
  margin-bottom: 4px;
}

.price {
  color: var(--q-accent);
  font-weight: 700;
  font-size: 18px;
}

.cancel-btn {
  width: 100%;
  margin-top: auto;
}

.empty-card {
  padding: 32px;
  text-align: center;
}


.quick-actions {
  display: flex;
  gap: 14px;
  margin-bottom: 34px;
}

.quick-action-btn {
  min-height: 46px;
  border-radius: 12px;
  padding: 0 22px;
}

@media (max-width: 850px) {
  .booking-content {
    flex-direction: column;
  }

  .car-image {
    width: 100%;
  }

  .booking-grid {
    grid-template-columns: 1fr;
  }

  .booking-header {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 600px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
  }

  .profile-stats {
  grid-template-columns: 1fr;
}

  .page-content {
    padding: 24px 16px;
  }

 .quick-action-btn {
    width: 100%;
  }

}
</style>