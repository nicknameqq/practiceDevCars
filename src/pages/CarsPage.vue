<template>
  <q-page class="cars-page">

    <div class="page-content">

      <h1>Авто</h1>

      <p class="subtitle">
        Усі доступні авто для аренди
      </p>


      <!-- Загрузка -->

      <div
        v-if="loading"
        class="loading"
      >
        Завантаження авто...
      </div>


      <!-- Автомобили -->

      <div
        v-else
        class="cars-grid"
      >

        <CarCard
          v-for="car in cars"
          :key="car.id"
          :car="car"
        />

      </div>


      <!-- Пагинация -->

      <div
        v-if="totalPages > 1"
        class="pagination"
      >

        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="6"
          boundary-numbers
          direction-links
        />

      </div>


    </div>

  </q-page>
</template>


<script setup>

import { ref, onMounted, watch } from 'vue'

import { getCars } from 'src/api/carsApi'

import CarCard from 'src/components/CarCard.vue'


const cars = ref([])

const loading = ref(false)

const currentPage = ref(1)

const totalPages = ref(1)


async function loadCars() {

  loading.value = true

  try {

    const response = await getCars({
      page: currentPage.value - 1
    })


    cars.value =
      response.data.content


    totalPages.value =
      response.data.totalPages


  } catch (error) {

    console.error(
      'Failed to load cars:',
      error
    )

  } finally {

    loading.value = false

  }

}


onMounted(loadCars)


watch(currentPage, () => {

  loadCars()

})

</script>


<style scoped>

.cars-page {
  background: var(--q-background);
  min-height: 100%;
}

.page-content {
  padding: 40px;
}

h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  color: var(--q-text);
}

.subtitle {
  margin-top: 10px;
  opacity: 0.7;
  font-size: 18px;
  color: var(--q-text);
}


.cars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 35px;
}


.loading {
  margin-top: 35px;
  font-size: 18px;
  color: var(--q-text);
  opacity: 0.7;
}


.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-bottom: 30px;
}


@media (max-width: 1000px) {

  .cars-grid {
    grid-template-columns: repeat(2, 1fr);
  }

}


@media (max-width: 650px) {

  .page-content {
    padding: 20px;
  }

  .cars-grid {
    grid-template-columns: 1fr;
  }

}

</style>

