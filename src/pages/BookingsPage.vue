<template>
  <q-page class="bookings-page">

    <div class="page-content">

      <h1>Бронирование автомобиля</h1>

      <p class="subtitle">
        Выберите автомобиль и даты аренды
      </p>


      <!-- =========================
           ИЗОБРАЖЕНИЕ АВТОМОБИЛЯ
           ========================= -->

      <q-img
        v-if="selectedCar"
        :src="selectedCar.image"
        :ratio="16 / 6"
        class="booking-car-image"
      />


      <!-- =========================
           ФОРМА БРОНИРОВАНИЯ
           ========================= -->

      <div class="booking-card">


        <!-- =========================
             АВТОМОБИЛЬ
             ========================= -->

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


        <!-- =========================
             ДАТЫ
             ========================= -->

        <div class="booking-dates">


          <!-- ДАТА НАЧАЛА -->

          <div class="booking-section">

            <div class="section-title">
              Дата начала
            </div>

            <q-input
              outlined
              v-model="startDate"
              readonly
              label="Выберите дату"
            >

              <template v-slot:append>

                <q-icon
                  name="event"
                  class="cursor-pointer"
                >

                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >

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


          <!-- ДАТА ОКОНЧАНИЯ -->

          <div class="booking-section">

            <div class="section-title">
              Дата окончания
            </div>

            <q-input
              outlined
              v-model="endDate"
              readonly
              label="Выберите дату"
            >

              <template v-slot:append>

                <q-icon
                  name="event"
                  class="cursor-pointer"
                >

                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >

                    <q-date
                      v-model="endDate"
                      mask="YYYY-MM-DD"
                      :options="isEndDateAvailable"
                      :events="occupiedDates"
                      event-color="red-4"
                      :default-year-month="endDateDefaultMonth"
                    />

                  </q-popup-proxy>

                </q-icon>

              </template>

            </q-input>

          </div>

        </div>


        <!-- =========================
             ОШИБКА ДАТ
             ========================= -->

        <div
          v-if="startDate && endDate && !datesValid"
          class="date-error"
        >
          Дата окончания должна быть позже даты начала
        </div>


        <!-- =========================
             ИТОГИ
             ========================= -->

        <div
          v-if="selectedCar"
          class="booking-summary"
        >

          <div class="summary-row">

            <span>
              Автомобиль
            </span>

            <strong>
              {{ selectedCar.brand }}
              {{ selectedCar.model }}
            </strong>

          </div>


          <div class="summary-row">

            <span>
              Цена за день
            </span>

            <strong>
              {{ selectedCar.price }} ₴
            </strong>

          </div>


          <div class="summary-row">

            <span>
              Количество дней
            </span>

            <strong>
              {{ rentalDays }}
            </strong>

          </div>


          <q-separator />


          <div class="total-row">

            <span>
              Итого
            </span>

            <strong>
              {{ totalPrice }} ₴
            </strong>

          </div>

        </div>


        <!-- =========================
             КНОПКА БРОНИРОВАНИЯ
             ========================= -->

        <q-btn
          class="booking-button"
          label="Подтвердить бронирование"
          unelevated
          :disable="!canBook"
          @click="createBooking"
        />

      </div>


      <!-- =========================
           МОИ БРОНИРОВАНИЯ
           ========================= -->

      <div class="my-bookings">

        <h2>
          Мои бронирования
        </h2>


        <!-- =========================
             НЕТ БРОНИРОВАНИЙ
             ========================= -->

        <div
          v-if="bookings.length === 0"
          class="empty-bookings"
        >

          <q-icon
            name="event_busy"
            size="60px"
          />

          <h3>
            Бронирований пока нет
          </h3>

          <p>
            Здесь будут отображаться ваши активные бронирования.
          </p>

        </div>


        <!-- =========================
             СПИСОК БРОНИРОВАНИЙ
             ========================= -->

        <div
          v-else
          class="bookings-list"
        >

          <div
            v-for="booking in bookings"
            :key="booking.id"
            class="booking-item"
          >

            <div class="booking-info">


              <div class="booking-car">

                {{ getCarById(booking.carId)?.brand }}
                {{ getCarById(booking.carId)?.model }}

              </div>


              <div class="booking-dates-info">

                {{ booking.startDate }}
                →
                {{ booking.endDate }}

              </div>


              <div class="booking-days">

                {{ booking.days }} дн.

              </div>


              <div class="booking-price">

                {{ booking.totalPrice }} ₴

              </div>

            </div>


            <q-btn
              flat
              color="negative"
              label="Отменить"
              @click="cancelBooking(booking.id)"
            />

          </div>

        </div>

      </div>

    </div>

  </q-page>
</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from 'vue'

import { useRoute } from 'vue-router'

import {
  useBookingCancel
} from 'src/composables/useBookingCancel.js'

// =========================
// COMPOSABLES
// =========================

import {
  useBookings
} from 'src/composables/useBookings.js'

import {
  useNotifications
} from 'src/composables/useNotifications.js'

import {
  useBookingActions
} from 'src/composables/useBookingActions.js'

import {
  useBookingNotifications
} from 'src/composables/useBookingNotifications.js'


import {
  useBookingCalendar
} from 'src/composables/useBookingsCalendar.js'


// =========================
// DATA
// =========================

import cars, {
  getCarById
} from 'src/data/cars.js'


// =========================
// UTILS
// =========================

import {
  isDateRangeBooked
} from 'src/utils/bookingUtils'


const route = useRoute()


// =========================
// БРОНИРОВАНИЯ
// =========================

const {
  bookings,
  addBooking,
  removeBooking
} = useBookings()


// =========================
// УВЕДОМЛЕНИЯ
// =========================

const {
  addNotification,
  notifications
} = useNotifications()


// =========================
// СОСТОЯНИЕ ФОРМЫ
// =========================

const selectedCarId = ref(
  route.query.carId
    ? Number(route.query.carId)
    : null
)

const startDate = ref('')

const endDate = ref('')


// =========================
// МЕСЯЦ КАЛЕНДАРЯ END DATE
// =========================

const endDateDefaultMonth = computed(() => {

  if (!startDate.value) {
    return undefined
  }


  const start =
    new Date(startDate.value)


  const nextDay =
    new Date(start)


  nextDay.setDate(
    start.getDate() + 1
  )


  const year =
    nextDay.getFullYear()


  const month =
    String(
      nextDay.getMonth() + 1
    ).padStart(2, '0')


  return `${year}/${month}`

})


// =========================
// АВТОМОБИЛИ
// =========================

const selectedCar = computed(() => {

  return cars.find(
    car =>
      car.id === selectedCarId.value
  )

})


const carOptions =
  cars.map(car => ({

    label:
      `${car.brand} ${car.model} — ` +
      `${car.price} ₴ / день`,

    value:
      car.id

  }))


// =========================
// КАЛЕНДАРЬ
// =========================

const {
  occupiedDates,
  isStartDateAvailable,
  isEndDateAvailable
} = useBookingCalendar(
  selectedCar,
  startDate
)


// =========================
// ПРОВЕРКА ДАТ
// =========================

const datesValid = computed(() => {

  if (
    !startDate.value ||
    !endDate.value
  ) {
    return false
  }


  return (
    new Date(endDate.value) >
    new Date(startDate.value)
  )

})


const hasDateConflict = computed(() => {

  if (
    !selectedCar.value ||
    !datesValid.value
  ) {
    return false
  }


  return isDateRangeBooked(
    selectedCar.value.id,
    startDate.value,
    endDate.value
  )

})


// =========================
// РАСЧЁТ СТОИМОСТИ
// =========================

const rentalDays = computed(() => {

  if (!datesValid.value) {
    return 0
  }


  const start =
    new Date(startDate.value)


  const end =
    new Date(endDate.value)


  return (
    end - start
  ) /
  (1000 * 60 * 60 * 24)

})


const totalPrice = computed(() => {

  if (!selectedCar.value) {
    return 0
  }


  return (
    rentalDays.value *
    selectedCar.value.price
  )

})


const canBook = computed(() => {

  return (

    selectedCar.value &&

    datesValid.value &&

    rentalDays.value > 0 &&

    !hasDateConflict.value

  )

})


// =========================
// ДЕЙСТВИЯ БРОНИРОВАНИЯ
// =========================
//
// Здесь теперь только:
// createBooking
//
// Уведомления о предстоящей аренде
// находятся в useBookingNotifications.



// =========================
// УВЕДОМЛЕНИЯ О ПРЕДСТОЯЩИХ БРОНИРОВАНИЯХ
// =========================

const {
  addFutureBookingNotification,
  checkUpcomingBookings
} = useBookingNotifications(

  bookings,

  notifications,

  addNotification

)


const {
  createBooking
} = useBookingActions({
  selectedCar,
  startDate,
  endDate,
  rentalDays,
  totalPrice,
  canBook,
  addBooking,
  addNotification,
  addFutureBookingNotification
})

const {
  cancelBooking
} = useBookingCancel({

  bookings,

  removeBooking,

  addNotification

})

// =========================
// ОТМЕНА БРОНИРОВАНИЯ
// =========================



// =========================
// ПРОВЕРКА БУДУЩИХ БРОНИРОВАНИЙ
// ПРИ ОТКРЫТИИ СТРАНИЦЫ
// =========================

onMounted(() => {

  checkUpcomingBookings()

})

</script>


<style scoped>

/* =========================
   ПОЛЯ ФОРМЫ
   ========================= */

.booking-card :deep(.q-field__control),
.booking-card :deep(.q-field__native),
.booking-card :deep(.q-field__input) {

  color:
    var(--q-text);

}


.booking-card :deep(.q-field__label) {

  color:
    var(--q-text);

  opacity:
    0.6;

}


.booking-card :deep(.q-field__marginal) {

  color:
    var(--q-text);

  opacity:
    0.7;

}


/* =========================
   СТРАНИЦА
   ========================= */

.bookings-page {

  min-height:
    100%;

  background:
    var(--q-background);

}


.page-content {

  padding:
    40px;

}


h1 {

  text-align:
    center;

  margin:
    0;

  font-size:
    36px;

  font-weight:
    700;

}


.subtitle {

  text-align:
    center;

  margin-top:
    10px;

  margin-bottom:
    25px;

  font-size:
    18px;

  opacity:
    0.65;

}


/* =========================
   ИЗОБРАЖЕНИЕ
   ========================= */

.booking-car-image {

  display:
    block;

  width:
    450px;

  max-width:
    100%;

  margin:
    0 auto 25px;

  border-radius:
    16px;

}


/* =========================
   ФОРМА
   ========================= */

.booking-card {

  width:
    100%;

  max-width:
    900px;

  margin:
    0 auto;

  padding:
    35px;

  background:
    var(--q-card);

  color:
    var(--q-text);

  border-radius:
    18px;

  border:
    1px solid
    rgba(128, 128, 128, 0.2);

  box-shadow:
    0 4px 20px
    rgba(0, 0, 0, 0.06);

}


.booking-section {

  flex:
    1;

}


:global(.q-date) {

  background:
    var(--q-card);

  color:
    var(--q-text);

}


.section-title {

  margin-bottom:
    8px;

  font-size:
    14px;

  font-weight:
    600;

  opacity:
    0.8;

}


.booking-dates {

  display:
    flex;

  gap:
    20px;

  margin-top:
    25px;

}


.date-error {

  margin-top:
    12px;

  color:
    #d32f2f;

  font-size:
    14px;

  font-weight:
    500;

}


/* =========================
   ИТОГИ
   ========================= */

.booking-summary {

  margin-top:
    30px;

  padding:
    20px;

  border-radius:
    12px;

  background:
    rgba(128, 128, 128, 0.08);

}


.summary-row,
.total-row {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

}


.summary-row {

  margin-bottom:
    14px;

}


.total-row {

  margin-top:
    18px;

  font-size:
    22px;

  font-weight:
    700;

}


.booking-button {

  width:
    100%;

  height:
    55px;

  margin-top:
    30px;

  border-radius:
    10px;

}


/* =========================
   МОИ БРОНИРОВАНИЯ
   ========================= */

.my-bookings {

  width:
    100%;

  max-width:
    900px;

  margin:
    40px auto 0;

}


.my-bookings h2 {

  margin:
    0 0 20px;

  font-size:
    28px;

  font-weight:
    700;

}


.empty-bookings {

  padding:
    50px 20px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  text-align:
    center;

  background:
    var(--q-card);

  color:
    var(--q-text);

  border-radius:
    18px;

  border:
    1px solid
    rgba(128, 128, 128, 0.2);

}


.empty-bookings h3 {

  margin:
    15px 0 8px;

  font-size:
    22px;

}


.empty-bookings p {

  margin:
    0;

  opacity:
    0.65;

}


/* =========================
   СПИСОК БРОНИРОВАНИЙ
   ========================= */

.bookings-list {

  display:
    flex;

  flex-direction:
    column;

  gap:
    15px;

}


.booking-item {

  padding:
    20px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    20px;

  background:
    var(--q-card);

  color:
    var(--q-text);

  border-radius:
    16px;

  border:
    1px solid
    rgba(128, 128, 128, 0.2);

}


.booking-info {

  display:
    flex;

  align-items:
    center;

  gap:
    25px;

  flex-wrap:
    wrap;

}


.booking-car {

  font-size:
    18px;

  font-weight:
    700;

}


.booking-dates-info {

  opacity:
    0.75;

}


.booking-days {

  opacity:
    0.7;

}


.booking-price {

  font-size:
    18px;

  font-weight:
    700;

}


/* =========================
   АДАПТИВНОСТЬ
   ========================= */

@media (max-width: 700px) {

  .page-content {

    padding:
      20px;

  }


  h1 {

    font-size:
      28px;

  }


  .booking-dates {

    flex-direction:
      column;

  }


  .booking-card {

    padding:
      24px;

  }


  .booking-item {

    flex-direction:
      column;

    align-items:
      stretch;

  }


  .booking-info {

    flex-direction:
      column;

    align-items:
      flex-start;

    gap:
      8px;

  }

}

</style>