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

        <div class="booking-section">

          <div class="section-title">
            Автомобиль
          </div>

          <q-select
            outlined
            v-model="selectedCarId"
            :options="carOptions"
            emit-value
            map-options
            label="Выберите автомобиль"
          />

        </div>

        <div class="booking-dates">

          <div class="booking-section">

            <div class="section-title">
              Дата начала
            </div>

            <q-input
                outlined
                v-model="startDate"
                type="date"
                label="Начало аренды"
                :min="today"
            />

          </div>

          <div class="booking-section">

            <div class="section-title">
              Дата окончания
            </div>

            <q-input
                outlined
                v-model="endDate"
                type="date"
                label="Окончание аренды"
                :min="minEndDate"
            />

          </div>

        </div>

            <div
                v-if="startDate && !startDateValid"
                class="date-error"
                >
                Дата начала не может быть раньше сегодняшнего дня
                </div>

                <div
                v-else-if="startDate && endDate && !datesValid"
                class="date-error"
                >
                Дата окончания должна быть позже даты начала
            </div>

        <div
          v-if="selectedCar"
          class="booking-summary"
        >

          <div class="summary-row">
            <span>Автомобиль</span>

            <strong>
              {{ selectedCar.brand }} {{ selectedCar.model }}
            </strong>
          </div>


       

          <div class="summary-row">
            <span>Цена за день</span>

            <strong>
              {{ selectedCar.price }} ₴
            </strong>
          </div>

          <div class="summary-row">
            <span>Количество дней</span>

            <strong>
              {{ rentalDays }}
            </strong>
          </div>

          <q-separator />

          <div class="total-row">
            <span>Итого</span>

            <strong>
              {{ totalPrice }} ₴
            </strong>
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

const route = useRoute()
const selectedCarId = ref(route.query.carId ? Number(route.query.carId) : null)

const startDate = ref('')
const endDate = ref('')
const today = new Date().toISOString().split('T')[0]
const minEndDate = computed(() => {
  return startDate.value || today
})

const carOptions = cars.map(car => ({
  label: `${car.brand} ${car.model} — ${car.price} ₴ / день`,
  value: car.id
}))

const selectedCar = computed(() => {
  return cars.find(car => car.id === selectedCarId.value)
})

const rentalDays = computed(() => {

  if (!startDate.value || !endDate.value) {
    return 0
  }

  const start = new Date(startDate.value)
  const end = new Date(endDate.value)

  const difference = end - start

  const days = difference / (1000 * 60 * 60 * 24)

  return days > 0 ? days : 0
})

const datesValid = computed(() => {

  if (!startDate.value || !endDate.value) {
    return false
  }

  if (startDate.value < today) {
    return false
  }

  const start = new Date(startDate.value)
  const end = new Date(endDate.value)

  return end > start
})


const startDateValid = computed(() => {
  if (!startDate.value) {
    return false
  }

  return startDate.value >= today
})

const totalPrice = computed(() => {

  if (!selectedCar.value || rentalDays.value === 0) {
    return 0
  }

  return selectedCar.value.price * rentalDays.value
})

const canBook = computed(() => {
  return (
    selectedCar.value &&
    datesValid.value &&
    rentalDays.value > 0
  )
})

function createBooking() {

  if (!canBook.value) {
    return
  }

  console.log({
    carId: selectedCar.value.id,
    startDate: startDate.value,
    endDate: endDate.value,
    days: rentalDays.value,
    totalPrice: totalPrice.value
  })
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

.page-content > h1
{
    text-align: center;
    margin-top: 0;
}
.page-content > .subtitle {
  text-align: center;
  margin-top: 10px;
  opacity: 0.65;
  font-size: 18px;
}

.page-content > h1 {
  margin-top: 0;
}

.page-content > .subtitle {
  margin-top: 10px;
}

h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
}

.subtitle {
  margin-top: 10px;
  opacity: 0.65;
  font-size: 18px;
}

.booking-card {
  width: 100%;
  max-width: 900px;

  margin: 35px auto 0;
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

.date-error {
  margin-top: 10px;
  font-size: 14px;
  color: #d32f2f;
}

.booking-car-image {
  display: block;
  width: 350px;
  max-width: 100%;
  height: 200px;
  margin: 25px auto 0;
  border-radius: 16px;
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

.booking-summary {
  margin-top: 30px;
  padding: 20px;

  border-radius: 12px;

  background: rgba(128, 128, 128, 0.08);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.total-row {
  display: flex;
  justify-content: space-between;

  margin-top: 20px;

  font-size: 22px;
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
  

}
</style>