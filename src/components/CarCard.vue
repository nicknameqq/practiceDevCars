<template>
  <q-card class="car-card">

    <div class="car-image-wrapper">

      <q-img
        :src="car.image"
        :ratio="16 / 9"
      />

      <q-btn
        round
        flat
        class="favorite-button"
        :icon="isFavorite(car.id) ? 'favorite' : 'favorite_border'"
        :class="{ 'favorite-active': isFavorite(car.id) }"
        @click="toggleFavorite(car.id)"
      />

    </div>


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
        label="Більше"
        unelevated
        rounded
        :to="`/cars/${car.id}`"
      />

    </q-card-section>

  </q-card>
</template>


<script setup>
import CarStatus from 'src/components/CarStatus.vue'
import { getCarStatus } from 'src/utils/carStatus.js'
import { useFavorites } from 'src/composables/useFavorites.js'


defineProps({
  car: {
    type: Object,
    required: true
  }
})


const {
  toggleFavorite,
  isFavorite
} = useFavorites()
</script>


<style scoped>

.car-card {
  border-radius: 16px;
  overflow: hidden;

  background: var(--q-card);
  color: var(--q-text);
}

.car-image-wrapper {
  position: relative;
}

.favorite-button {
  position: absolute;
  top: 12px;
  right: 12px;

  background: var(--q-card);

  color: var(--q-text) !important;

  z-index: 2;
}

.favorite-button:hover {
  background: var(--q-card);
}

.favorite-active {
  color: #e53935 !important;
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

</style>