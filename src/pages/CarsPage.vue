<template>
  <q-page class="cars-page">

    <div class="page-content">

      <h1>Автомобили</h1>

      <p class="subtitle">
        Все доступные автомобили для аренды
      </p>

      <div class="cars-grid">

        <q-card
          v-for="car in cars"
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

            <div class="car-body-type">
              {{ car.bodyType }}
            </div>

              <CarStatus :status="getCarStatus(car)" />
              
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

  </q-page>
</template>

<script setup>
import { getCarStatus } from 'src/utils/carStatus.js'
import cars from 'src/data/cars.js'
import CarStatus from 'src/components/CarStatus.vue'

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
}

.subtitle {
  margin-top: 10px;
  opacity: 0.7;
  font-size: 18px;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 35px;
}

.car-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, 0.2);
}

.car-title {
  font-size: 20px;
  font-weight: 700;
}

.car-body-type {
  margin-top: 5px;
  opacity: 0.7;
}

.car-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.car-price {
  font-size: 18px;
  font-weight: 700;
}

.car-price span {
  font-size: 14px;
  font-weight: 400;
  opacity: 0.7;
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