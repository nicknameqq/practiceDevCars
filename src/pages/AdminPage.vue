<template>
  <q-page class="admin-page">

    <div class="page-content">

      <h1>Админ-панель</h1>

      <p class="subtitle">
        Управление системой аренды автомобилей
      </p>

      <div class="admin-grid">

        <q-card
          class="admin-card"
          flat
          clickable
          @click="$router.push('/admin/cars')"
        >
          <q-icon
            name="directions_car"
            size="42px"
            color="primary"
          />

          <div class="card-title">
            Автомобили
          </div>

          <div class="card-description">
            Добавление, редактирование и удаление автомобилей
          </div>
        </q-card>


        <q-card
          class="admin-card"
          flat
          clickable
          @click="$router.push('/admin/bookings')"
        >
          <q-icon
            name="event"
            size="42px"
            color="primary"
          />

          <div class="card-title">
            Бронирования
          </div>

          <div class="card-description">
            Просмотр и управление бронированиями
          </div>
        </q-card>


        <q-card
          class="admin-card"
          flat
          clickable
          @click="$router.push('/admin/reports')"
        >
          <q-icon
            name="assessment"
            size="42px"
            color="primary"
          />

          <div class="card-title">
            Отчёты
          </div>

          <div class="card-description">
            Статистика и отчёты системы
          </div>
        </q-card>

      </div>

    </div>

  </q-page>
</template>

<script setup>
</script>

<style scoped>

.admin-page {
  min-height: 100%;
  background: var(--q-background);
}

.page-content {
  max-width: 1050px;
  margin: 0 auto;
  padding: 40px 24px;
}

h1 {
  margin: 0;
  text-align: center;
  font-size: 34px;
  font-weight: 800;
}

.subtitle {
  text-align: center;
  margin: 10px 0 35px;
  opacity: .7;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.admin-card {
  padding: 28px;
  background: var(--q-card);
  border: 1px solid var(--q-border);
  border-radius: 18px;

  cursor: pointer;

  transition:
    transform .2s ease,
    box-shadow .2s ease,
    border-color .2s ease;
}

.admin-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, .10);
  border-color: var(--q-primary);
}

.card-title {
  margin-top: 18px;
  font-size: 21px;
  font-weight: 800;
}

.card-description {
  margin-top: 8px;
  opacity: .65;
  line-height: 1.5;
}

@media (max-width: 800px) {

  .admin-grid {
    grid-template-columns: 1fr;
  }

}

</style>