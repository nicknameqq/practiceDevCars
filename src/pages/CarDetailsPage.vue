<template>
  <q-page class="car-details-page">

    <div class="page-content">

      <q-btn
        flat
        label="← Назад к автомобилям"
        :to="'/'"
        class="back-button"
      />

        <div v-if="loading">
          Загрузка...
        </div>
        
      <div  v-if="car" 
      class="car-details-card">

        <div class="car-image">
          <img
            :src="car.image"
            :alt="`${car.brand} ${car.model}`"
          />
        </div>

        <div class="car-info">

          <div class="car-brand">
            {{ car.brand }}
          </div>

          <h1>{{ car.model }}</h1>

          <div class="car-type">
            {{ car.bodyType }}
          </div>

          <div class="divider"></div>

            <div class="characteristics">

            <div class="characteristic">
                <span>Тип кузова</span>
                <strong>{{ car.bodyType }}</strong>
            </div>

            <div class="characteristic">
                <span>Год выпуска</span>
                <strong>{{ car.year }}</strong>
            </div>

            <div class="characteristic">
                <span>Коробка передач</span>
                <strong>{{ car.transmission }}</strong>
            </div>

            <div class="characteristic">
                <span>Топливо</span>
                <strong>{{ car.fuel }}</strong>
            </div>

            <div class="characteristic">
                <span>Количество мест</span>
                <strong>{{ car.seats }}</strong>
            </div>

            <div class="characteristic">
                <span>Стоимость</span>
                <strong>{{ car.price }} ₴ / день</strong>
            </div>

            <div class="characteristic">
                <span>Статус</span>
                  <CarStatus :status="getCarStatus(car)" />
            </div>

            </div>

          <q-btn
              :label="getCarStatus(car) === 'available'
                ? 'Забронировать'
                : getCarStatus(car) === 'booked'
                  ? 'Автомобиль забронирован'
                  : 'Автомобиль недоступен'"
              unelevated
              class="booking-button"
              :disable="getCarStatus(car) !== 'available'"
              :to="`/bookings?carId=${car.id}`"
            />

        </div>

      </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCarById } from 'src/api/carsApi'
import { getCarStatus } from 'src/utils/carStatus.js'
import CarStatus from 'src/components/CarStatus.vue'

const route = useRoute()

const car = ref(null)
const loading = ref(false)

async function loadCar() {
  loading.value = true

  try {
    const response = await getCarById(route.params.id)
    car.value = response.data
  } catch (error) {
    console.error('Failed to load car:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadCar)


</script>

<style scoped>


.car-details-card {
  background: var(--q-card);
  border: 1px solid var(--q-border);
  box-shadow: 0 4px 20px var(--q-shadow);
}

.page-content {
  padding: 40px;
}

.back-button {
  margin-bottom: 25px;
}

.car-details-card {
  display: grid;
  grid-template-columns: 1.3fr 1fr;

  background: var(--q-background);
  border: 1px solid rgba(128, 128, 128, 0.2);
  border-radius: 20px;
  overflow: hidden;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.car-image {
  min-height: 500px;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-info {
  padding: 45px;
}

.car-brand {
  font-size: 18px;
  font-weight: 600;
}

.car-info h1 {
  margin: 5px 0;
  font-size: 38px;
  font-weight: 700;
}

.car-type {
  font-size: 18px;
  opacity: 0.7;
}

.divider {
  height: 1px;
  margin: 30px 0;
  background: rgba(128, 128, 128, 0.25);
}

.characteristic {
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.15);
}

.characteristics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.characteristic {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.characteristic span {
  opacity: 0.7;
}

.characteristic strong {
  font-weight: 600;
}

.booking-button {
  width: 100%;
  height: 55px;
  margin-top: 40px;
  border-radius: 10px;
}

@media (max-width: 900px) {
  .page-content {
    padding: 25px;
  }

  .car-details-card {
    grid-template-columns: 1fr;
  }

  .car-image {
    min-height: 350px;
  }

  .car-info {
    padding: 30px;
  }
}
</style>