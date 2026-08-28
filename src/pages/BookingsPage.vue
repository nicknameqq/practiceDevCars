<template>

  <q-page class="bookings-page">

    <div class="page-content">

      <!-- =========================
           ЗАГОЛОВОК
           ========================= -->

      <h1>
        Бронирование автомобиля
      </h1>

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
          v-if="
            startDate &&
            endDate &&
            !datesValid
          "
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
          @click="handleCreateBooking"
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
          v-if="visibleBookings.length === 0"
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
            v-for="booking in visibleBookings"
            :key="booking.id"
            class="booking-item"
          >

            <div class="booking-info">


              <!-- АВТОМОБИЛЬ -->

              <div class="booking-car">

                {{ findCar(booking.carId)?.brand }}
                {{ findCar(booking.carId)?.model }}

              </div>


              <!-- ДАТЫ -->

              <div class="booking-dates-info">

                {{ booking.startDate }}

                →

                {{ booking.endDate }}

              </div>


              <!-- ДНИ -->

              <div class="booking-days">

                {{ booking.days }} дн.

              </div>


              <!-- ЦЕНА -->

              <div class="booking-price">

                {{ booking.totalPrice }} ₴

              </div>

            </div>


            <!-- ОТМЕНА -->

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


    <!-- ==================================================
         ДИАЛОГ ОПЛАТЫ
         ================================================== -->

    <q-dialog
      v-model="paymentDialog"
    >

      <q-card
        class="payment-dialog"
      >


        <!-- =========================
             ЗАГОЛОВОК
             ========================= -->

        <q-card-section>

          <div class="text-h6">

            {{
              paymentSuccess
                ? 'Оплата прошла успешно'
                : 'Бронирование создано'
            }}

          </div>

        </q-card-section>


        <!-- =========================
             ИНФОРМАЦИЯ
             ========================= -->

        <q-card-section
          v-if="createdBooking"
          class="q-pt-none"
        >


          <!-- =========================
               ДО ОПЛАТЫ
               ========================= -->

          <template
            v-if="!paymentSuccess"
          >

            <p class="payment-text">

              Бронирование автомобиля создано.

            </p>

            <p class="payment-text">

              Хотите оплатить бронирование сейчас?

            </p>


            <!-- ИНФОРМАЦИЯ О БРОНИ -->

            <div class="payment-booking-info">

              <strong>

                {{ findCar(createdBooking.carId)?.brand }}

                {{ findCar(createdBooking.carId)?.model }}

              </strong>


              <span>

                {{ createdBooking.startDate }}

                →

                {{ createdBooking.endDate }}

              </span>


              <span>

                {{ createdBooking.days }} дн.

              </span>


              <strong>

                {{ createdBooking.totalPrice }} ₴

              </strong>

            </div>

          </template>


          <!-- =========================
               ПОСЛЕ УСПЕШНОЙ ОПЛАТЫ
               ========================= -->

          <template
            v-else
          >

            <div class="payment-success">

              <q-icon
                name="check_circle"
                size="60px"
                color="positive"
              />


              <div class="payment-success-title">

                Оплата успешно выполнена

              </div>


              <strong>

                {{ createdBooking.totalPrice }} ₴

              </strong>

            </div>

          </template>

        </q-card-section>


        <!-- =========================
             КНОПКИ
             ========================= -->

        <q-card-actions
          align="right"
        >

          <!-- ДО ОПЛАТЫ -->

          <template
            v-if="!paymentSuccess"
          >

            <q-btn
              flat
              label="Позже"
              v-close-popup
            />


            <q-btn
              unelevated
              label="Оплатить"
              :loading="paymentLoading"
              @click="payForBooking"
            />

          </template>


          <!-- ПОСЛЕ ОПЛАТЫ -->

          <q-btn
            v-else
            unelevated
            label="Закрыть"
            v-close-popup
          />

        </q-card-actions>

      </q-card>

    </q-dialog>

  </q-page>
</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from 'vue'

import { useRoute } from 'vue-router'


// =========================
// COMPOSABLES
// =========================

import {
  useBookingCancel
} from 'src/composables/useBookingCancel.js'

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
// API
// =========================

import {
  getCars
} from 'src/api/carsApi'

import {
  createPayment
} from 'src/api/paymentsApi'


// =========================
// ROUTE
// =========================

const route =
  useRoute()


// =========================
// БРОНИРОВАНИЯ
// =========================

const {
  bookings,
  addBooking,
  removeBooking,
  loadBookings
} = useBookings()


const visibleBookings =
  computed(() =>

    bookings.value.filter(
      booking =>

        booking.status === 'PENDING' ||

        booking.status === 'ACTIVE'

    )

  )


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

const selectedCarId =
  ref(

    route.query.carId
      ? Number(route.query.carId)
      : null

  )


const startDate =
  ref('')


const endDate =
  ref('')


// =========================
// ОПЛАТА
// =========================

const paymentDialog =
  ref(false)


const paymentLoading =
  ref(false)


const createdBooking =
  ref(null)


const paymentSuccess =
  ref(false)


// =========================
// МЕСЯЦ END DATE
// =========================

const endDateDefaultMonth =
  computed(() => {

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

const cars =
  ref([])


const selectedCar =
  computed(() => {

    return cars.value.find(
      car =>
        car.id === selectedCarId.value
    )

  })


const carOptions =
  computed(() =>

    cars.value.map(car => ({

      label:
        `${car.brand} ${car.model} — ${car.price} ₴ / день`,

      value:
        car.id

    }))

  )


async function loadCars() {

  try {

    const response =
      await getCars({

        size:
          100

      })


    cars.value =
      response.data.content

  } catch (error) {

    console.error(
      'Failed to load cars:',
      error
    )

  }

}


// =========================
// КАЛЕНДАРЬ
// =========================

const {
  occupiedDates,
  isStartDateAvailable,
  isEndDateAvailable
} = useBookingCalendar(

  selectedCar,

  startDate,

  bookings

)


// =========================
// ПРОВЕРКА ДАТ
// =========================

const datesValid =
  computed(() => {

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


const hasDateConflict =
  computed(() => {

    if (
      !selectedCar.value ||
      !datesValid.value
    ) {

      return false

    }


    return bookings.value.some(
      booking => {

        if (

          Number(booking.carId) !==

          Number(selectedCar.value.id)

        ) {

          return false

        }


        if (
          booking.status ===
          'CANCELLED'
        ) {

          return false

        }


        return (

          startDate.value <
          booking.endDate &&

          endDate.value >
          booking.startDate

        )

      }
    )

  })


// =========================
// РАСЧЁТ ДНЕЙ
// =========================

const rentalDays =
  computed(() => {

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


// =========================
// ИТОГОВАЯ ЦЕНА
// =========================

const totalPrice =
  computed(() => {

    if (!selectedCar.value) {
      return 0
    }


    return (

      rentalDays.value *

      selectedCar.value.price

    )

  })


// =========================
// МОЖНО ЛИ СОЗДАВАТЬ БРОНЬ
// =========================

const canBook =
  computed(() => {

    return (

      selectedCar.value &&

      datesValid.value &&

      rentalDays.value > 0 &&

      !hasDateConflict.value

    )

  })


// =========================
// БУДУЩИЕ БРОНИРОВАНИЯ
// =========================

const {
  addFutureBookingNotification,
  checkUpcomingBookings
} = useBookingNotifications(

  bookings,

  notifications,

  addNotification

)


// =========================
// ДЕЙСТВИЯ БРОНИРОВАНИЯ
// =========================

const {
  createBooking
} = useBookingActions({

  selectedCar,

  startDate,

  endDate,

  rentalDays,

  totalPrice,

  canBook,

  addBooking

})


// =========================
// СОЗДАНИЕ БРОНИ
// =========================

async function handleCreateBooking() {

  try {

    const booking =
      await createBooking()


    if (!booking) {
      return
    }


    createdBooking.value =
      booking


    paymentSuccess.value =
      false


    paymentDialog.value =
      true

  } catch (error) {

    console.error(
      'Booking creation failed:',
      error
    )

  }

}


// =========================
// ОПЛАТА
// =========================

async function payForBooking() {

  if (
    !createdBooking.value
  ) {

    return

  }


  paymentLoading.value =
    true


  try {

    const response =
      await createPayment(

        createdBooking.value.id

      )


    console.log(
      'Payment created:',
      response.data
    )


    // ==================================
    // ОПЛАТА УСПЕШНА
    // ==================================

    paymentSuccess.value =
      true


    // ==================================
    // ОБНОВЛЯЕМ БРОНИРОВАНИЯ
    // ==================================

    await loadBookings()


    // ==================================
    // СОЗДАЁМ PUSH-УВЕДОМЛЕНИЕ
    // ==================================

    const car =
      findCar(
        createdBooking.value.carId
      )


    const carName =
      car
        ? `${car.brand} ${car.model}`
        : 'Автомобиль'


    addNotification({

      type:
        'booking',

      title:
        'Бронирование создано',

      message:
        `${carName} — ` +
        `${createdBooking.value.startDate} → ` +
        `${createdBooking.value.endDate}`,

      icon:
        'event_available',

      carId:
        createdBooking.value.carId,

      bookingStart:
        createdBooking.value.startDate,

      bookingEnd:
        createdBooking.value.endDate

    })


    // ==================================
    // УВЕДОМЛЕНИЕ О ПРЕДСТОЯЩЕЙ АРЕНДЕ
    // ==================================

    addFutureBookingNotification({

      carId:
        createdBooking.value.carId,

      carName,

      startDate:
        createdBooking.value.startDate,

      endDate:
        createdBooking.value.endDate

    })


    // ==================================
    // ОДНОВРЕМЕННО ПОКАЗЫВАЕМ QUASAR NOTIFY
    // ==================================

    const { Notify } =
      await import('quasar')


    Notify.create({

      type:
        'positive',

      message:
        'Бронирование создано',

      caption:
        `${carName} — оплачено`,

      icon:
        'event_available',

      position:
        'top-right',

      timeout:
        4000

    })


  } catch (error) {

    console.error(
      'Failed to create payment:',
      error
    )


    // ==================================
    // ОПЛАТА НЕ ПРОШЛА
    // ==================================

    const { Notify } =
      await import('quasar')


    Notify.create({

      type:
        'negative',

      message:
        'Не удалось оплатить бронирование',

      position:
        'top-right',

      timeout:
        4000

    })

  } finally {

    paymentLoading.value =
      false

  }

}


// =========================
// ОТМЕНА БРОНИРОВАНИЯ
// =========================

const {
  cancelBooking
} = useBookingCancel({

  bookings,

  removeBooking,

  addNotification

})


// =========================
// ПОИСК АВТОМОБИЛЯ
// =========================

function findCar(carId) {

  return cars.value.find(
    car =>
      Number(car.id) === Number(carId)
  )

}


// =========================
// ЗАГРУЗКА
// =========================

onMounted(async () => {

  await loadCars()

  await loadBookings()

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
   ДИАЛОГ ОПЛАТЫ
   ========================= */

.payment-dialog {

  width:
    450px;

  max-width:
    90vw;

  background:
    var(--q-card);

  color:
    var(--q-text);

}


.payment-text {

  margin:
    0 0 10px;

}


.payment-booking-info {

  display:
    flex;

  flex-direction:
    column;

  gap:
    10px;

  padding:
    15px;

  margin-top:
    18px;

  border-radius:
    10px;

  background:
    rgba(128, 128, 128, 0.08);

}


.payment-booking-info strong {

  font-size:
    18px;

}


.payment-success {

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  gap:
    12px;

  padding:
    10px 0;

  text-align:
    center;

}


.payment-success-title {

  font-size:
    18px;

  font-weight:
    600;

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