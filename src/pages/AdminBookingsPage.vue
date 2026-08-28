<template>

  <q-page class="admin-bookings-page">

    <div class="page-content">

      <!-- HEADER -->

      <div class="page-header">

        <div>

          <h1>
            Бронирования
          </h1>

          <p class="subtitle">
            Управление бронированиями пользователей
          </p>

        </div>


        <div class="header-actions">

          <q-btn
            flat
            icon="refresh"
            label="Обновить"
            :loading="loading"
            @click="loadAdminBookings"
          />

          <q-btn
            flat
            icon="arrow_back"
            label="Назад"
            @click="$router.push('/admin')"
          />

        </div>

      </div>


      <!-- ЗАГРУЗКА -->

      <div
        v-if="loading"
        class="loading"
      >

        <q-spinner
          size="40px"
          color="primary"
        />

      </div>


      <!-- ОШИБКА -->

      <div
        v-else-if="error"
        class="error-block"
      >

        <q-icon
          name="error_outline"
          size="50px"
        />

        <div>
          Не удалось загрузить бронирования
        </div>

        <q-btn
          label="Повторить"
          unelevated
          @click="loadAdminBookings"
        />

      </div>


      <!-- НЕТ БРОНИРОВАНИЙ -->

      <div
        v-else-if="bookings.length === 0"
        class="empty-block"
      >

        <q-icon
          name="event_busy"
          size="60px"
        />

        <h2>
          Бронирований пока нет
        </h2>

      </div>


      <!-- ТАБЛИЦА -->

      <div
        v-else
        class="table-wrapper"
      >

        <table class="bookings-table">

          <thead>

            <tr>

              <th>
                №
              </th>

              <th>
                ID
              </th>

              <th>
                Пользователь
              </th>

              <th>
                Автомобиль
              </th>

              <th>
                Период аренды
              </th>

              <th>
                Сумма
              </th>

              <th>
                Статус
              </th>

              <th>
              </th>

            </tr>

          </thead>


          <tbody>

            <tr
              v-for="(booking, index) in bookings"
              :key="booking.id"
            >

              <!-- НОМЕР -->

              <td class="booking-number">

                {{
                  (currentPage - 1) * pageSize +
                  index +
                  1
                }}

              </td>


              <!-- ID -->

              <td class="booking-id">

                #{{ booking.id }}

              </td>


              <!-- USER -->

              <td>

                <div class="booking-user">

                  <strong>
                    {{ booking.user?.username }}
                  </strong>

                  <span>
                    {{ booking.user?.email }}
                  </span>

                </div>

              </td>


              <!-- CAR -->

              <td>

                <div class="booking-car">

                  <strong>

                    {{ booking.car?.brand }}
                    {{ booking.car?.model }}

                  </strong>

                  <span>
                    {{ booking.car?.year }}
                  </span>

                </div>

              </td>


              <!-- DATES -->

              <td>

                <div class="booking-dates">

                  <span>
                    {{ booking.startDate }}
                  </span>

                  <q-icon
                    name="arrow_forward"
                  />

                  <span>
                    {{ booking.endDate }}
                  </span>

                </div>

              </td>


              <!-- PRICE -->

              <td>

                <strong class="booking-price">

                  {{ booking.totalPrice }} ₴

                </strong>

              </td>


              <!-- STATUS -->

              <td class="status-cell">

                <q-select
                  :model-value="booking.status"
                  :options="getStatusOptions(booking.status)"
                  outlined
                  dense
                  emit-value
                  map-options
                  :loading="
                    changingStatusId === booking.id
                  "
                  :disable="
                    booking.status === 'CANCELLED' ||
                    booking.status === 'COMPLETED'
                  "
                  @update:model-value="
                    handleStatusChange(
                      booking,
                      $event
                    )
                  "
                  class="status-select"
                />

              </td>


              <!-- ACTION -->

              <td class="booking-actions">

                <q-btn
                  v-if="
                    booking.status !== 'CANCELLED' &&
                    booking.status !== 'COMPLETED'
                  "
                  flat
                  dense
                  color="negative"
                  icon="cancel"
                  :loading="
                    cancellingId === booking.id
                  "
                  @click="
                    handleCancel(booking.id)
                  "
                >

                  <q-tooltip>
                    Отменить бронирование
                  </q-tooltip>

                </q-btn>


                <span
                  v-else
                  class="no-action"
                >
                  —
                </span>

              </td>

            </tr>

          </tbody>

        </table>

      </div>


      <!-- PAGINATION -->

      <div
        v-if="totalPages > 1"
        class="pagination-wrapper"
      >

        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="7"
          direction-links
          boundary-links
          @update:model-value="
            loadAdminBookings
          "
        />

      </div>


      <!-- INFO -->

      <div
        v-if="totalElements > 0"
        class="pagination-info"
      >

        Показано

        {{ (currentPage - 1) * pageSize + 1 }}

        —

        {{
          Math.min(
            currentPage * pageSize,
            totalElements
          )
        }}

        из

        {{ totalElements }}

      </div>

    </div>

  </q-page>

</template>


<script setup>

import {
  ref,
  onMounted
} from 'vue'


import {
  getBookings,
  cancelBookingByAdmin,
  updateBookingStatus
} from 'src/api/bookingsApi'


const bookings = ref([])

const loading = ref(false)

const error = ref(false)

const cancellingId = ref(null)

const changingStatusId = ref(null)


/*
 * PAGINATION
 */

const currentPage = ref(1)

const pageSize = 12

const totalPages = ref(0)

const totalElements = ref(0)


async function loadAdminBookings() {

  loading.value = true

  error.value = false


  try {

    /*
     * В интерфейсе страницы начинаются с 1.
     *
     * Spring Pageable начинает страницы с 0.
     *
     * Поэтому:
     *
     * UI 1 -> backend 0
     * UI 2 -> backend 1
     * UI 3 -> backend 2
     */

    const response =
      await getBookings(
        currentPage.value - 1,
        pageSize
      )


    const data =
      response.data


    bookings.value =
      data.content


    totalPages.value =
      data.totalPages


    totalElements.value =
      data.totalElements

  } catch (err) {

    console.error(
      'Failed to load admin bookings:',
      err
    )

    error.value = true

  } finally {

    loading.value = false

  }

}


async function handleCancel(id) {

  cancellingId.value = id


  try {

    const response =
      await cancelBookingByAdmin(id)


    const updatedBooking =
      response.data


    const index =
      bookings.value.findIndex(
        booking =>
          booking.id === id
      )


    if (index !== -1) {

      bookings.value[index] =
        updatedBooking

    }

  } catch (err) {

    console.error(
      'Failed to cancel booking:',
      err
    )

  } finally {

    cancellingId.value = null

  }

}


async function handleStatusChange(booking, newStatus) {

  if (newStatus === booking.status) {
    return
  }

  const oldStatus = booking.status
  changingStatusId.value = booking.id

  try {

    const response =
      await updateBookingStatus(
        booking.id,
        newStatus
      )

    const index =
      bookings.value.findIndex(
        item => item.id === booking.id
      )

    if (index !== -1) {
      bookings.value[index] = response.data
    }

  } catch (err) {

    console.error(
      'Failed to update booking status:',
      err
    )

    booking.status = oldStatus

  } finally {

    changingStatusId.value = null

  }
}


function getStatusLabel(status) {

  switch (status) {

    case 'PENDING':
      return 'Ожидает'

    case 'ACTIVE':
      return 'Активно'

    case 'COMPLETED':
      return 'Завершено'

    case 'CANCELLED':
      return 'Отменено'

    default:
      return status

  }

}


function getStatusOptions(
  currentStatus
) {

  if (
    currentStatus === 'PENDING'
  ) {

    return [

      {
        label: 'Ожидает',
        value: 'PENDING'
      },

      {
        label: 'Активно',
        value: 'ACTIVE'
      },

      {
        label: 'Отменено',
        value: 'CANCELLED'
      }

    ]

  }


  if (
    currentStatus === 'ACTIVE'
  ) {

    return [

      {
        label: 'Активно',
        value: 'ACTIVE'
      },

      {
        label: 'Завершено',
        value: 'COMPLETED'
      },

      {
        label: 'Отменено',
        value: 'CANCELLED'
      }

    ]

  }


  return [

    {
      label:
        getStatusLabel(
          currentStatus
        ),

      value:
        currentStatus

    }

  ]

}


onMounted(
  loadAdminBookings
)

</script>


<style scoped>

.admin-bookings-page {

  min-height: 100%;

  background:
    var(--q-background);

}


.page-content {

  max-width: 1250px;

  margin: 0 auto;

  padding: 40px 24px;

}


/* =========================
   HEADER
   ========================= */

.page-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 30px;

}


.header-actions {

  display: flex;

  align-items: center;

  gap: 8px;

}


h1 {

  margin: 0;

  font-size: 34px;

  font-weight: 800;

}


.subtitle {

  margin: 8px 0 0;

  opacity: .7;

}


/* =========================
   TABLE
   ========================= */

.table-wrapper {

  width: 100%;

  overflow-x: auto;

  background:
    var(--q-card);

  border:
    1px solid
    var(--q-border);

  border-radius: 18px;

}


.bookings-table {

  width: 100%;

  border-collapse: collapse;

  color:
    var(--q-text);

}


/* HEADER */

.bookings-table th {

  padding:
    16px 18px;

  text-align:
    left;

  font-size:
    13px;

  font-weight:
    700;

  opacity:
    .6;

  white-space:
    nowrap;

  border-bottom:
    1px solid
    var(--q-border);

}


/* ROW */

.bookings-table td {

  padding:
    18px;

  vertical-align:
    middle;

  border-bottom:
    1px solid
    var(--q-border);

}


.bookings-table tbody tr:last-child td {

  border-bottom:
    none;

}


.bookings-table tbody tr {

  transition:
    background .15s;

}


.bookings-table tbody tr:hover {

  background:
    rgba(128, 128, 128, .06);

}


/* =========================
   НОМЕР
   ========================= */

.booking-number {

  width:
    45px;

  text-align:
    center;

  font-weight:
    700;

  opacity:
    .5;

}


/* =========================
   ID
   ========================= */

.booking-id {

  width:
    70px;

  font-weight:
    700;

  opacity:
    .6;

  white-space:
    nowrap;

}


/* =========================
   USER
   ========================= */

.booking-user {

  display:
    flex;

  flex-direction:
    column;

  gap:
    5px;

  min-width:
    170px;

}


.booking-user strong {

  font-size:
    14px;

  font-weight:
    700;

}


.booking-user span {

  font-size:
    13px;

  opacity:
    .6;

}


/* =========================
   CAR
   ========================= */

.booking-car {

  display:
    flex;

  flex-direction:
    column;

  gap:
    5px;

  min-width:
    140px;

}


.booking-car strong {

  font-size:
    15px;

  font-weight:
    700;

}


.booking-car span {

  font-size:
    13px;

  opacity:
    .6;

}


/* =========================
   DATES
   ========================= */

.booking-dates {

  display:
    flex;

  align-items:
    center;

  gap:
    7px;

  white-space:
    nowrap;

  font-size:
    14px;

}


.booking-dates .q-icon {

  opacity:
    .5;

}


/* =========================
   PRICE
   ========================= */

.booking-price {

  white-space:
    nowrap;

  font-size:
    15px;

  font-weight:
    800;

}


/* =========================
   STATUS
   ========================= */

.status-cell {

  min-width:
    130px;

}


.status-select {

  width:
    130px;

}


.status-select :deep(.q-field__control) {

  border-radius:
    8px;

}


.status-select :deep(.q-field__native) {

  font-weight:
    600;

}


/* =========================
   ACTION
   ========================= */

.booking-actions {

  width:
    60px;

  text-align:
    center;

}


.no-action {

  opacity:
    .3;

}


/* =========================
   PAGINATION
   ========================= */

.pagination-wrapper {

  display:
    flex;

  justify-content:
    center;

  margin-top:
    25px;

}


.pagination-info {

  margin-top:
    12px;

  text-align:
    center;

  font-size:
    13px;

  opacity:
    .55;

}


/* =========================
   LOADING / ERROR / EMPTY
   ========================= */

.loading,
.error-block,
.empty-block {

  min-height:
    300px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  gap:
    15px;

  text-align:
    center;

}


.error-block {

  color:
    var(--q-negative);

}


.empty-block {

  background:
    var(--q-card);

  border-radius:
    18px;

  padding:
    40px;

}


.empty-block h2 {

  margin:
    0;

}


/* =========================
   MOBILE
   ========================= */

@media (max-width: 800px) {

  .page-header {

    align-items:
      flex-start;

  }


  .page-content {

    padding:
      25px 15px;

  }


  h1 {

    font-size:
      28px;

  }


  .bookings-table {

    min-width:
      1000px;

  }

}

</style>

