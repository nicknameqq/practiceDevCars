<template>
  <q-page class="bookings-page">
    <div class="page-content">
      <h1>Бронирование автомобиля</h1>

      <p class="subtitle">
        Выберите автомобиль и даты аренды
      </p>

      <q-img
        v-if="selectedCar"
        :src="selectedCar.image"
        :ratio="16 / 6"
        class="booking-car-image"
      />

      <div class="booking-card">
        <!-- Автомобиль -->
        <div class="booking-section">
          <div class="section-title">Автомобиль</div>

          <q-select
            outlined
            v-model="selectedCarId"
            :options="carOptions"
            emit-value
            map-options
            label="Выберите автомобиль"
          />
        </div>

        <!-- Даты -->
        <div class="booking-dates">
          <!-- Начало -->
          <div class="booking-section">
            <div class="section-title">Дата начала</div>

            <q-input
              outlined
              v-model="startDate"
              readonly
              label="Выберите дату"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                   <q-date
                     v-model="startDate"
                      mask="YYYY-MM-DD"
                      :options="isStartDateAvailable"
                      :events="occupiedDates"
                      event-color="red-4"

                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- Конец -->
          <div class="booking-section">
            <div class="section-title">Дата окончания</div>

            <q-input
              outlined
              v-model="endDate"
              readonly
              label="Выберите дату"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="endDate"
                      mask="YYYY-MM-DD"
                      :options="isEndDateAvailable"
                      :events="occupiedDates"
                      event-color="red-4"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <div v-if="startDate && endDate && !datesValid" class="date-error">
          Дата окончания должна быть позже даты начала
        </div>

        <!-- Итоги -->
        <div v-if="selectedCar" class="booking-summary">
          <div class="summary-row">
            <span>Автомобиль</span>
            <strong>{{ selectedCar.brand }} {{ selectedCar.model }}</strong>
          </div>

          <div class="summary-row">
            <span>Цена за день</span>
            <strong>{{ selectedCar.price }} ₴</strong>
          </div>

          <div class="summary-row">
            <span>Количество дней</span>
            <strong>{{ rentalDays }}</strong>
          </div>

          <q-separator />

          <div class="total-row">
            <span>Итого</span>
            <strong>{{ totalPrice }} ₴</strong>
          </div>
        </div>

        <q-btn
          class="booking-button"
          label="Подтвердить бронирование"
          unelevated
          :disable="!canBook"
          @click="createBooking"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import cars from 'src/data/cars.js'
import bookings from 'src/data/bookings.js'

const route = useRoute()

const selectedCarId = ref(
  route.query.carId ? Number(route.query.carId) : null
)

const startDate = ref('')
const endDate = ref('')

const today = new Date().toISOString().split('T')[0]

const occupiedDates = computed(() => {

  if (!selectedCar.value) {
    return []
  }

  const dates = []

  bookings.forEach(booking => {

    if (booking.carId !== selectedCar.value.id) {
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
})


const carOptions = cars.map(car => ({
  label: `${car.brand} ${car.model} — ${car.price} ₴ / день`,
  value: car.id
}))

const selectedCar = computed(() =>
  cars.find(car => car.id === selectedCarId.value)
)

// ===== Доступные даты =====

function normalizeDate(date) {
  return date.replace(/\//g, '-')
}

function isStartDateAvailable(date) {
  const current = normalizeDate(date)

  if (current < today) return false

  if (!selectedCar.value) return true

  return !bookings.some(booking => {
    if (booking.carId !== selectedCar.value.id) return false

    return (
      current >= booking.startDate &&
      current < booking.endDate
    )
  })
}

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

  return !bookings.some(booking => {
    if (booking.carId !== selectedCar.value.id) {
      return false
    }

    // Проверяем, пересекается ли весь диапазон
    return (
      startDate.value < booking.endDate &&
      current > booking.startDate
    )
  })
}

// ===== Проверки =====

const datesValid = computed(() => {
  if (!startDate.value || !endDate.value) return false

  return new Date(endDate.value) > new Date(startDate.value)
})

const rentalDays = computed(() => {
  if (!datesValid.value) return 0

  const start = new Date(startDate.value)
  const end = new Date(endDate.value)

  return (end - start) / (1000 * 60 * 60 * 24)
})

const totalPrice = computed(() => {
  if (!selectedCar.value) return 0

  return rentalDays.value * selectedCar.value.price
})

const canBook = computed(() => {
  return (
    selectedCar.value &&
    datesValid.value &&
    rentalDays.value > 0
  )
})

// ===== Бронирование =====

function createBooking() {
  if (!canBook.value) return

  console.log({
    carId: selectedCar.value.id,
    startDate: startDate.value,
    endDate: endDate.value,
    days: rentalDays.value,
    totalPrice: totalPrice.value
  })

  alert('Бронирование успешно создано!')
}
</script>

<style scoped>



.bookings-page {
  min-height: 100%;
  background: var(--q-background);
}

.page-content {
  padding: 40px;
}

h1 {
  text-align: center;
  margin: 0;
  font-size: 36px;
  font-weight: 700;
}

.subtitle {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 25px;
  font-size: 18px;
  opacity: 0.65;
}

.booking-car-image {
  display: block;
  width: 450px;
  max-width: 100%;
  margin: 0 auto 25px;
  border-radius: 16px;
}

.booking-card {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 35px;

  background: var(--q-card);
  color: var(--q-text);

  border-radius: 18px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.booking-section {
  flex: 1;
}

.section-title {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.8;
}

.booking-dates {
  display: flex;
  gap: 20px;
  margin-top: 25px;
}

.date-error {
  margin-top: 12px;
  color: #d32f2f;
  font-size: 14px;
  font-weight: 500;
}

.booking-summary {
  margin-top: 30px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(128, 128, 128, 0.08);
}

.summary-row,
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-row {
  margin-bottom: 14px;
}

.total-row {
  margin-top: 18px;
  font-size: 22px;
  font-weight: 700;
}

.booking-button {
  width: 100%;
  height: 55px;
  margin-top: 30px;
  border-radius: 10px;
}

@media (max-width: 700px) {
  .page-content {
    padding: 20px;
  }

  h1 {
    font-size: 28px;
  }

  .booking-dates {
    flex-direction: column;
  }

  .booking-card {
    padding: 24px;
  }
}


/* =========================
   ЗАНЯТЫЕ ДАТЫ В КАЛЕНДАРЕ
   ========================= */



</style>