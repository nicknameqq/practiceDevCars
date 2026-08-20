<template>
  <q-page class="cars-page">

    <div class="page-content">

      <h1>Автомобили</h1>

      <p class="subtitle">
        Все доступные автомобили для аренды
      </p>

      <div class="cars-grid">

        <CarCard
          v-for="car in cars"
          :key="car.id"
          :car="car"
        />

      </div>

    </div>

  </q-page>
</template>


<script setup>
import cars from 'src/data/cars.js'
import CarCard from 'src/components/CarCard.vue'
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