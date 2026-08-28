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
                Трансмиссия
              </div>

              <q-select
                outlined
                v-model="transmission"
                :options="transmissions"
                label="Все трансмиссии"
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
              Найдено автомобилей: {{ totalElements }}
            </div>

            <h2>Доступные автомобили</h2>

            <div class="cars-grid">

              <CarCard
                v-for="car in filteredCars"
                :key="car.id"
                :car="car"
              />

            </div>

            <q-pagination
              v-if="totalPages > 1"
              v-model="currentPage"
              :max="totalPages"
              :max-pages="6"
              direction-links
              @update:model-value="changePage"
            />

          </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCars } from 'src/api/carsApi'
import CarCard from 'src/components/CarCard.vue'

const cars = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalElements = ref(0)
const filteredCars = cars
const transmission = ref(null)
const appliedTransmission = ref(null)

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
const transmissions = [
  'AUTOMATIC',
  'MANUAL'
]

const bodyTypes = [
  'Седан',
  'Кроссовер',
  'Хэтчбек',
  'Универсал',
  'Купе'
]

async function loadCars() {
  loading.value = true

  try {
    const params = {
      brand: appliedBrand.value || undefined,
      bodyType: appliedBodyType.value || undefined,
      transmission: appliedTransmission.value || undefined,
      maxPrice: appliedMaxPrice.value || undefined,
      page: currentPage.value - 1,
      size: 12
    }

    const response = await getCars(params)

    cars.value = response.data.content
    totalPages.value = response.data.totalPages
    totalElements.value = response.data.totalElements
  } catch (error) {
    console.error('Failed to load cars:', error)
  } finally {
    loading.value = false
  }
}

async function changePage(page) {
  currentPage.value = page
  await loadCars()
}

onMounted(loadCars)

async function applyFilters() {
  appliedBrand.value = brand.value
  appliedBodyType.value = bodyType.value
  appliedMaxPrice.value = maxPrice.value
  appliedTransmission.value = transmission.value

  currentPage.value = 1
  await loadCars()
}


async function resetFilters() {
  brand.value = null
  bodyType.value = null
  maxPrice.value = null
  transmission.value = null

  appliedBrand.value = null
  appliedBodyType.value = null
  appliedMaxPrice.value = null
  appliedTransmission.value = null

  currentPage.value = 1

  await loadCars()
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

.results-count {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--q-text);
  opacity: 0.7;
}

.q-pagination {
  margin-top: 30px;
  justify-content: center;
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