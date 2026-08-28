<template>

  <q-page class="admin-reports-page">

    <div class="page-content">

      <!-- HEADER -->

      <div class="page-header">

        <div>

          <h1>
            Отчёты
          </h1>

          <p class="subtitle">
            Статистика и аналитика сервиса
          </p>

        </div>

        <div class="header-actions">

          <q-btn
            flat
            icon="refresh"
            label="Обновить"
            :loading="loading"
            @click="loadReport"
          />

          <q-btn
            flat
            icon="arrow_back"
            label="Назад"
            @click="$router.push('/admin')"
          />

        </div>

      </div>


      <!-- LOADING -->

      <div
        v-if="loading"
        class="loading"
      >

        <q-spinner
          size="50px"
          color="primary"
        />

      </div>


      <!-- ERROR -->

      <div
        v-else-if="error"
        class="error-block"
      >

        <q-icon
          name="error_outline"
          size="50px"
        />

        <div>
          Не удалось загрузить отчёт
        </div>

        <q-btn
          label="Повторить"
          unelevated
          @click="loadReport"
        />

      </div>


      <!-- REPORT -->

      <div
        v-else
        class="report-content"
      >

        <!-- MAIN CARDS -->

        <div class="stats-grid">

          <q-card
            class="stat-card"
            flat
          >

            <div class="stat-icon">
              <q-icon
                name="people"
                size="28px"
              />
            </div>

            <div class="stat-info">

              <span class="stat-label">
                Пользователи
              </span>

              <strong class="stat-value">
                {{ report.totalUsers }}
              </strong>

            </div>

          </q-card>


          <q-card
            class="stat-card"
            flat
          >

            <div class="stat-icon">
              <q-icon
                name="directions_car"
                size="28px"
              />
            </div>

            <div class="stat-info">

              <span class="stat-label">
                Автомобили
              </span>

              <strong class="stat-value">
                {{ report.totalCars }}
              </strong>

            </div>

          </q-card>


          <q-card
            class="stat-card"
            flat
          >

            <div class="stat-icon">
              <q-icon
                name="event"
                size="28px"
              />
            </div>

            <div class="stat-info">

              <span class="stat-label">
                Бронирования
              </span>

              <strong class="stat-value">
                {{ report.totalBookings }}
              </strong>

            </div>

          </q-card>


          <q-card
            class="stat-card revenue-card"
            flat
          >

            <div class="stat-icon">
              <q-icon
                name="payments"
                size="28px"
              />
            </div>

            <div class="stat-info">

              <span class="stat-label">
                Общая выручка
              </span>

              <strong class="stat-value">
                {{ formatPrice(report.totalRevenue) }}
              </strong>

            </div>

          </q-card>

        </div>


        <!-- BOOKINGS -->

        <q-card
          class="bookings-report-card"
          flat
        >

          <div class="section-header">

            <div>

              <h2>
                Бронирования
              </h2>

              <p>
                Распределение бронирований по статусам
              </p>

            </div>

          </div>


          <div class="status-grid">

            <div class="status-item">

              <div class="status-dot pending"></div>

              <div class="status-info">

                <span>
                  Ожидают
                </span>

                <strong>
                  {{ report.pendingBookings }}
                </strong>

              </div>

            </div>


            <div class="status-item">

              <div class="status-dot active"></div>

              <div class="status-info">

                <span>
                  Активные
                </span>

                <strong>
                  {{ report.activeBookings }}
                </strong>

              </div>

            </div>


            <div class="status-item">

              <div class="status-dot completed"></div>

              <div class="status-info">

                <span>
                  Завершённые
                </span>

                <strong>
                  {{ report.completedBookings }}
                </strong>

              </div>

            </div>


            <div class="status-item">

              <div class="status-dot cancelled"></div>

              <div class="status-info">

                <span>
                  Отменённые
                </span>

                <strong>
                  {{ report.cancelledBookings }}
                </strong>

              </div>

            </div>

          </div>

        </q-card>


        <!-- SUMMARY -->

        <q-card
          class="summary-card"
          flat
        >

          <h2>
            Сводка
          </h2>

          <div class="summary-row">

            <span>
              Завершённых бронирований
            </span>

            <strong>
              {{ report.completedBookings }}
            </strong>

          </div>

          <div class="summary-row">

            <span>
              Отменённых бронирований
            </span>

            <strong>
              {{ report.cancelledBookings }}
            </strong>

          </div>

          <div class="summary-row">

            <span>
              Активных бронирований
            </span>

            <strong>
              {{ report.activeBookings }}
            </strong>

          </div>

        </q-card>

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
  getAdminReportSummary
} from 'src/api/reportsApi'


const loading = ref(false)

const error = ref(false)


const report = ref({

  totalUsers: 0,

  totalCars: 0,

  totalBookings: 0,

  totalRevenue: 0,

  pendingBookings: 0,

  activeBookings: 0,

  completedBookings: 0,

  cancelledBookings: 0

})


async function loadReport() {

  loading.value = true

  error.value = false

  try {

    const response =
      await getAdminReportSummary()

    report.value =
      response.data

  } catch (err) {

    console.error(
      'Failed to load admin report:',
      err
    )

    error.value = true

  } finally {

    loading.value = false

  }

}


function formatPrice(price) {

  return Number(price || 0)
    .toLocaleString('uk-UA') + ' ₴'

}


onMounted(loadReport)

</script>


<style scoped>

.admin-reports-page {

  min-height: 100%;

  background:
    var(--q-background);

}


.page-content {

  max-width: 1100px;

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

  opacity: .65;

}


/* =========================
   STATS
   ========================= */

.stats-grid {

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 16px;

}


.stat-card {

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 22px;

  background:
    var(--q-card);

  color:
    var(--q-text);

  border:
    1px solid
    var(--q-border);

  border-radius: 16px;

}


.stat-icon {

  width: 52px;

  height: 52px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background:
    rgba(127, 127, 127, .12);

}


.stat-info {

  display: flex;

  flex-direction: column;

  gap: 5px;

}


.stat-label {

  font-size: 13px;

  opacity: .6;

}


.stat-value {

  font-size: 23px;

  font-weight: 800;

}


/* =========================
   BOOKINGS
   ========================= */

.bookings-report-card {

  margin-top: 20px;

  padding: 25px;

  background:
    var(--q-card);

  color:
    var(--q-text);

  border:
    1px solid
    var(--q-border);

  border-radius: 16px;

}


.section-header h2,
.summary-card h2 {

  margin: 0;

  font-size: 22px;

  font-weight: 800;

}


.section-header p {

  margin: 6px 0 0;

  font-size: 14px;

  opacity: .6;

}


.status-grid {

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 15px;

  margin-top: 25px;

}


.status-item {

  display: flex;

  align-items: center;

  gap: 12px;

}


.status-dot {

  width: 12px;

  height: 12px;

  border-radius: 50%;

}


.status-dot.pending {

  background:
    #f2c94c;

}


.status-dot.active {

  background:
    #219653;

}


.status-dot.completed {

  background:
    #2f80ed;

}


.status-dot.cancelled {

  background:
    #eb5757;

}


.status-info {

  display: flex;

  flex-direction: column;

  gap: 3px;

}


.status-info span {

  font-size: 13px;

  opacity: .6;

}


.status-info strong {

  font-size: 20px;

  font-weight: 800;

}


/* =========================
   SUMMARY
   ========================= */

.summary-card {

  margin-top: 20px;

  padding: 25px;

  background:
    var(--q-card);

  color:
    var(--q-text);

  border:
    1px solid
    var(--q-border);

  border-radius: 16px;

}


.summary-row {

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 15px 0;

  border-bottom:
    1px solid
    var(--q-border);

}


.summary-row:last-child {

  border-bottom: none;

}


.summary-row span {

  opacity: .7;

}


.summary-row strong {

  font-size: 17px;

}


/* =========================
   LOADING
   ========================= */

.loading {

  min-height: 300px;

  display: flex;

  align-items: center;

  justify-content: center;

}


/* =========================
   ERROR
   ========================= */

.error-block {

  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 15px;

  text-align: center;

  color:
    var(--q-negative);

}


/* =========================
   MOBILE
   ========================= */

@media (max-width: 900px) {

  .stats-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

  .status-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

}


@media (max-width: 600px) {

  .page-content {

    padding:
      25px 15px;

  }


  .page-header {

    flex-direction:
      column;

    align-items:
      flex-start;

  }


  .header-actions {

    width:
      100%;

  }


  .stats-grid {

    grid-template-columns:
      1fr;

  }


  .status-grid {

    grid-template-columns:
      1fr;

  }

}

</style>