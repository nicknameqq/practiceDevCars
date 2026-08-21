<template>
  <q-page class="bookings-page">

    <div class="page-content">

      <h1>Бронирование автомобиля</h1>

      <p class="subtitle">
        Выберите автомобиль и даты аренды
      </p>

      <!-- Изображение выбранного автомобиля -->

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

        <!-- Автомобиль -->

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


        <!-- Даты -->

        <div class="booking-dates">

          <!-- Начало -->

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


          <!-- Конец -->

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


        <!-- Ошибка дат -->

        <div
          v-if="startDate && endDate && !datesValid"
          class="date-error"
        >
          Дата окончания должна быть позже даты начала
        </div>


        <!-- Итоги -->

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


        <!-- Кнопка бронирования -->

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


        <!-- Если броней нет -->

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


        <!-- Если бронирования есть -->

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

                {{ getCarName(booking.carId) }}

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

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Notify } from 'quasar'

import { useBookings } from 'src/composables/useBookings.js'
import { useNotifications } from 'src/composables/useNotifications.js'

import cars from 'src/data/cars.js'

import {
  isDateBooked,
  isDateRangeBooked,
  getOccupiedDates,
  normalizeDate
} from 'src/utils/bookingUtils'


const route = useRoute()


// =========================
// БРОНИРОВАНИЯ
// =========================

const {
  bookings,
  createBooking: saveBooking,
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

  const start = new Date(startDate.value)

  const nextDay = new Date(start)

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
// СЕГОДНЯШНЯЯ ДАТА
// =========================

const today = new Date()
  .toISOString()
  .split('T')[0]


// =========================
// АВТОМОБИЛИ
// =========================

const selectedCar = computed(() => {

  return cars.find(
    car =>
      car.id === selectedCarId.value
  )

})


const carOptions = cars.map(car => ({

  label:
    `${car.brand} ${car.model} — ` +
    `${car.price} ₴ / день`,

  value: car.id

}))


// =========================
// ЗАНЯТЫЕ ДАТЫ
// =========================

const occupiedDates = computed(() => {

  if (!selectedCar.value) {
    return []
  }

  return getOccupiedDates(
    selectedCar.value.id
  )

})


// =========================
// ДОСТУПНОСТЬ ДАТЫ НАЧАЛА
// =========================

function isStartDateAvailable(date) {

  const current =
    normalizeDate(date)


  // Прошедшие даты запрещены

  if (current < today) {
    return false
  }


  // Если автомобиль не выбран

  if (!selectedCar.value) {
    return true
  }


  // Нельзя начать аренду
  // в занятую дату

  return !isDateBooked(
    selectedCar.value.id,
    current
  )

}


// =========================
// ДОСТУПНОСТЬ ДАТЫ ОКОНЧАНИЯ
// =========================

function isEndDateAvailable(date) {

  const current =
    normalizeDate(date)


  // Сначала выбираем начало

  if (!startDate.value) {
    return false
  }


  // Конец должен быть позже начала

  if (
    current <= startDate.value
  ) {
    return false
  }


  // Если автомобиль не выбран

  if (!selectedCar.value) {
    return true
  }


  // Проверяем весь диапазон

  return !isDateRangeBooked(
    selectedCar.value.id,
    startDate.value,
    current
  )

}


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
// СОЗДАНИЕ БРОНИРОВАНИЯ
// =========================

function createBooking() {

  if (!canBook.value) {
    return
  }


  // Сохраняем данные до очистки формы

  const carId =
    selectedCar.value.id

  const carName =
    `${selectedCar.value.brand} ` +
    `${selectedCar.value.model}`

  const bookingStart =
    startDate.value

  const bookingEnd =
    endDate.value

  const bookingDays =
    rentalDays.value

  const bookingPrice =
    totalPrice.value


  // =========================
  // СОХРАНЯЕМ БРОНИРОВАНИЕ
  // =========================

  saveBooking({

    carId,

    startDate:
      bookingStart,

    endDate:
      bookingEnd,

    days:
      bookingDays,

    totalPrice:
      bookingPrice

  })


  // =========================
  // УВЕДОМЛЕНИЕ О СОЗДАНИИ
  // =========================

  addNotification({

    type: 'booking',

    title:
      'Бронирование создано',

    message:
      `${carName} — ` +
      `${bookingStart} → ${bookingEnd}`,

    icon:
      'event_available'

  })


  // =========================
  // УВЕДОМЛЕНИЕ О БУДУЩЕМ
  // =========================

  addFutureBookingNotification({

    carId,

    carName,

    startDate:
      bookingStart,

    endDate:
      bookingEnd

  })


  // =========================
  // ВСПЛЫВАЮЩЕЕ УВЕДОМЛЕНИЕ
  // =========================

  Notify.create({

    type:
      'positive',

    message:
      'Бронирование успешно создано',

    caption:
      carName,

    icon:
      'check_circle',

    position:
      'top-right',

    timeout:
      3000

  })


  // =========================
  // ОЧИЩАЕМ ФОРМУ
  // =========================

  startDate.value = ''

  endDate.value = ''

}


// =========================
// УВЕДОМЛЕНИЕ О ПРЕДСТОЯЩЕЙ АРЕНДЕ
// =========================

function addFutureBookingNotification({
  carId,
  carName,
  startDate,
  endDate
}) {

  // Проверяем, существует ли
  // уже такое уведомление

  const alreadyExists =
    notifications.value.some(
      notification =>

        notification.type ===
          'booking_upcoming' &&

        notification.bookingStart ===
          startDate &&

        notification.bookingEnd ===
          endDate &&

        notification.carId ===
          carId

    )


  // Если уже есть —
  // второй раз не создаём

  if (alreadyExists) {
    return
  }


  addNotification({

    type:
      'booking_upcoming',

    title:
      'Предстоящее бронирование',

    message:
      `${carName} — ` +
      `начало аренды ${startDate}. ` +
      `Окончание: ${endDate}`,

    icon:
      'event'

  })

}


// =========================
// ПРОВЕРКА БУДУЩИХ БРОНИРОВАНИЙ
// =========================

function checkUpcomingBookings() {

  bookings.value.forEach(
    booking => {

      const car =
        cars.find(
          car =>
            car.id === booking.carId
        )


      if (!car) {
        return
      }


      const start =
        new Date(booking.startDate)

      const now =
        new Date()


      // Разница в миллисекундах

      const difference =
        start - now


      // Переводим в дни

      const daysUntilStart =
        difference /
        (1000 * 60 * 60 * 24)


      // Если бронирование
      // начинается в ближайшие 7 дней

      if (
        daysUntilStart >= 0 &&
        daysUntilStart <= 7
      ) {

        addFutureBookingNotification({

          carId:
            booking.carId,

          carName:
            `${car.brand} ${car.model}`,

          startDate:
            booking.startDate,

          endDate:
            booking.endDate

        })

      }

    }
  )

}


// =========================
// НАЗВАНИЕ АВТОМОБИЛЯ
// =========================

function getCarName(carId) {

  const car =
    cars.find(
      car =>
        car.id === carId
    )


  if (!car) {
    return 'Автомобиль не найден'
  }


  return (
    `${car.brand} ${car.model}`
  )

}


// =========================
// ОТМЕНА БРОНИРОВАНИЯ
// =========================

function cancelBooking(id) {

  const booking =
    bookings.value.find(
      booking =>
        booking.id === id
    )


  // Если бронирование найдено

  if (booking) {

    const carName =
      getCarName(
        booking.carId
      )


    // Удаляем бронирование

    removeBooking(id)


    // =========================
    // УВЕДОМЛЕНИЕ ОБ ОТМЕНЕ
    // =========================

    addNotification({

      type:
        'booking_cancelled',

      title:
        'Бронирование отменено',

      message:
        `${carName} — ` +
        `${booking.startDate} → ` +
        `${booking.endDate}`,

      icon:
        'event_busy'

    })


    // =========================
    // ВСПЛЫВАЮЩЕЕ УВЕДОМЛЕНИЕ
    // =========================

    Notify.create({

      type:
        'warning',

      message:
        'Бронирование отменено',

      caption:
        carName,

      icon:
        'event_busy',

      position:
        'top-right',

      timeout:
        3000

    })

  }

}


// =========================
// ПРОВЕРЯЕМ БУДУЩИЕ БРОНИ
// ПРИ ОТКРЫТИИ СТРАНИЦЫ
// =========================

onMounted(() => {

  checkUpcomingBookings()

})

</script>



<style scoped>

.booking-card :deep(.q-field__control),
.booking-card :deep(.q-field__native),
.booking-card :deep(.q-field__input) {
  color: var(--q-text);
}


.booking-card :deep(.q-field__label) {
  color: var(--q-text);
  opacity: 0.6;
}


.booking-card :deep(.q-field__marginal) {
  color: var(--q-text);
  opacity: 0.7;
}


/* =========================
   СТРАНИЦА
   ========================= */

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


/* =========================
   ИЗОБРАЖЕНИЕ
   ========================= */

.booking-car-image {
  display: block;

  width: 450px;
  max-width: 100%;

  margin: 0 auto 25px;

  border-radius: 16px;
}


/* =========================
   ФОРМА
   ========================= */

.booking-card {
  width: 100%;
  max-width: 900px;

  margin: 0 auto;

  padding: 35px;

  background: var(--q-card);
  color: var(--q-text);

  border-radius: 18px;

  border: 1px solid rgba(128, 128, 128, 0.2);

  box-shadow:
    0 4px 20px
    rgba(0, 0, 0, 0.06);
}


.booking-section {
  flex: 1;
}


:global(.q-date) {
  background: var(--q-card);
  color: var(--q-text);
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


/* =========================
   ИТОГИ
   ========================= */

.booking-summary {
  margin-top: 30px;

  padding: 20px;

  border-radius: 12px;

  background:
    rgba(128, 128, 128, 0.08);
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


/* =========================
   МОИ БРОНИРОВАНИЯ
   ========================= */

.my-bookings {
  width: 100%;
  max-width: 900px;

  margin: 40px auto 0;
}


.my-bookings h2 {
  margin: 0 0 20px;

  font-size: 28px;
  font-weight: 700;
}


.empty-bookings {
  padding: 50px 20px;

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  background: var(--q-card);
  color: var(--q-text);

  border-radius: 18px;

  border: 1px solid
    rgba(128, 128, 128, 0.2);
}


.empty-bookings h3 {
  margin: 15px 0 8px;

  font-size: 22px;
}


.empty-bookings p {
  margin: 0;

  opacity: 0.65;
}


/* =========================
   СПИСОК БРОНИРОВАНИЙ
   ========================= */

.bookings-list {
  display: flex;

  flex-direction: column;

  gap: 15px;
}


.booking-item {
  padding: 20px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  background: var(--q-card);
  color: var(--q-text);

  border-radius: 16px;

  border: 1px solid
    rgba(128, 128, 128, 0.2);
}


.booking-info {
  display: flex;

  align-items: center;

  gap: 25px;

  flex-wrap: wrap;
}


.booking-car {
  font-size: 18px;

  font-weight: 700;
}


.booking-dates-info {
  opacity: 0.75;
}


.booking-days {
  opacity: 0.7;
}


.booking-price {
  font-size: 18px;

  font-weight: 700;
}


/* =========================
   АДАПТИВНОСТЬ
   ========================= */

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


  .booking-item {
    flex-direction: column;

    align-items: stretch;
  }


  .booking-info {
    flex-direction: column;

    align-items: flex-start;

    gap: 8px;
  }

}

</style>