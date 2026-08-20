<template>
  <q-page class="index-page">

    <div class="page-content">

      <h1>Аренда автомобилей</h1>

      <p class="subtitle">
        Выберите автомобиль для вашей поездки
      </p>

      <div class="filter-card">

        <div class="filter-item">
          <div class="filter-label">
            Марка автомобиля
          </div>

          <q-select
            outlined
            v-model="brand"
            :options="brands"
            label="Все марки"
          />
        </div>

        <div class="filter-item">
          <div class="filter-label">
            Тип кузова
          </div>

          <q-select
            outlined
            v-model="bodyType"
            :options="bodyTypes"
            label="Все типы"
          />
        </div>

        <div class="filter-item">
          <div class="filter-label">
            Максимальная цена
          </div>

          <q-input
            outlined
            v-model="maxPrice"
            type="number"
            label="Цена за день"
            suffix="₴"
          />
        </div>

        <div class="filter-actions">

          <q-btn
            class="search-button"
            label="Найти"
            unelevated
            @click="applyFilters"
          />

          <q-btn
            class="reset-button"
            flat
            label="Сбросить"
            @click="resetFilters"
          />

        </div>

      </div>
        <div class="cars-section">

          <div class="results-count">
            Найдено автомобилей: {{ filteredCars.length }}
          </div>

          <h2>Доступные автомобили</h2>

          <div class="cars-grid">

    <q-card
      v-for="car in filteredCars"
      :key="car.id"
      class="car-card"
    >

      <q-img
        :src="car.image"
        :ratio="16 / 9"
      />

      <q-card-section>

        <div class="car-title">
          {{ car.brand }} {{ car.model }}
        </div>

        <div class="car-info-row">
          <div class="car-body-type">
            {{ car.bodyType }}
          </div>
          <CarStatus :status="getCarStatus(car)" />
        </div>

      </q-card-section>
      <q-card-section class="car-bottom">

        <div class="car-price">
          {{ car.price }} ₴
          <span>/ день</span>
        </div>

      <q-btn
        label="Подробнее"
        unelevated
        rounded
        :to="`/cars/${car.id}`"
      />

      </q-card-section>

    </q-card>

  </div>

</div>

    </div>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCarStatus } from 'src/utils/carStatus.js'
import cars from 'src/data/cars.js'
import CarStatus from 'src/components/CarStatus.vue'


const brand = ref(null)
const bodyType = ref(null)
const maxPrice = ref(null)

const appliedBrand = ref(null)
const appliedBodyType = ref(null)
const appliedMaxPrice = ref(null)

const brands = [
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Toyota',
  'Volkswagen'
]

const bodyTypes = [
  'Седан',
  'Кроссовер',
  'Хэтчбек',
  'Универсал',
  'Купе'
]

const filteredCars = computed(() => {
  return cars.filter(car => {

    const matchesBrand =
      !appliedBrand.value || car.brand === appliedBrand.value

    const matchesBodyType =
      !appliedBodyType.value || car.bodyType === appliedBodyType.value

    const matchesPrice =
      !appliedMaxPrice.value ||
      car.price <= Number(appliedMaxPrice.value)

    return matchesBrand && matchesBodyType && matchesPrice
  })
})

function applyFilters() {
  appliedBrand.value = brand.value
  appliedBodyType.value = bodyType.value
  appliedMaxPrice.value = maxPrice.value
}


function resetFilters() {
  brand.value = null
  bodyType.value = null
  maxPrice.value = null

  appliedBrand.value = null
  appliedBodyType.value = null
  appliedMaxPrice.value = null
}
</script>

<style scoped>
/* =========================
   ОСНОВНАЯ СТРАНИЦА
   ========================= */

.index-page {
  min-height: 100%;
  background: var(--q-background);
}

.page-content {
  padding: 40px;
  background: var(--q-background);
  color: var(--q-text);
}


/* =========================
   ЗАГОЛОВОК
   ========================= */

h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  color: var(--q-text);
}

.subtitle {
  margin-top: 10px;
  font-size: 18px;
  color: var(--q-text);
  opacity: 0.65;
}


/* =========================
   ФИЛЬТРЫ
   ========================= */

.filter-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-card {
  margin-top: 35px;
  padding: 25px;

  display: flex;
  align-items: flex-end;
  gap: 16px;

  background: var(--q-card);
  color: var(--q-text);

  border-radius: 16px;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.filter-item {
  flex: 1;
}

.filter-label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--q-text);
  opacity: 0.8;
}

.search-button,
.reset-button {
  height: 56px;
  border-radius: 10px;
}
.search-button {
  min-width: 110px;
  padding: 0 25px;
}
.reset-button {
  min-width: 110px;
  padding: 0 20px;
}

/* =========================
   Q-SELECT / Q-INPUT
   ========================= */

.filter-card :deep(.q-field) {
  color: var(--q-text);
}

.filter-card :deep(.q-field__control) {
  color: var(--q-text);
}

.filter-card :deep(.q-field__native) {
  color: var(--q-text);
}

.filter-card :deep(.q-field__input) {
  color: var(--q-text);
}

.filter-card :deep(.q-field__label) {
  color: var(--q-text);
  opacity: 0.6;
}

.filter-card :deep(.q-field__marginal) {
  color: var(--q-text);
  opacity: 0.7;
}


/* =========================
   АВТОМОБИЛИ
   ========================= */

.cars-section {
  margin-top: 25px;
}

.cars-section h2 {
  margin: 0 0 20px;
  font-size: 26px;
  font-weight: 700;
  color: var(--q-text);
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.car-card {
  border-radius: 16px;
  overflow: hidden;

  background: var(--q-card);
  color: var(--q-text);
}

.car-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--q-text);
}

.car-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.car-body-type {
  margin-top: 5px;
  color: var(--q-text);
  opacity: 0.65;
}

.car-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.car-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--q-text);
}

.car-price span {
  font-size: 14px;
  font-weight: 400;
  color: var(--q-text);
  opacity: 0.65;
}

.results-count {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--q-text);
  opacity: 0.7;
}


/* =========================
   ВЫПАДАЮЩЕЕ МЕНЮ
   ========================= */

:global(.q-menu) {
  background: var(--q-card);
  color: var(--q-text);
}

:global(.q-menu .q-item) {
  color: var(--q-text);
}

:global(.q-menu .q-item:hover) {
  background: rgba(127, 127, 127, 0.15);
}

:global(.q-menu .q-item--active) {
  color: var(--q-text);
}


/* =========================
   АДАПТИВНОСТЬ
   ========================= */

@media (max-width: 900px) {
  .cars-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-card {
    flex-wrap: wrap;
  }

  .filter-item {
    min-width: 45%;
  }

  .search-button {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .page-content {
    padding: 20px;
  }

  h1 {
    font-size: 28px;
  }

  .cars-grid {
    grid-template-columns: 1fr;
  }

  .filter-card {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-item {
    width: 100%;
  }

  .search-button {
    width: 100%;
  }
}
</style>