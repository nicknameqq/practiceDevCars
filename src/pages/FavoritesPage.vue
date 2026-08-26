<template>
  <q-page class="favorites-page">

    <div class="page-content">

      <h1>Избранное</h1>

      <p class="subtitle">
        Автомобили, которые вы добавили в избранное
      </p>


      <!-- Избранное пустое -->
      <div
        v-if="favoriteCars.length === 0"
        class="empty-favorites"
      >

        <div class="empty-icon">
          <q-icon
            name="favorite_border"
            size="64px"
          />
        </div>

        <h2>
          Избранное пока пусто
        </h2>

        <p>
          Добавьте автомобили в избранное,
          чтобы быстро найти их позже.
        </p>

        <q-btn
          label="Перейти к автомобилям"
          unelevated
          rounded
          to="/"
        />

      </div>


      <!-- Список избранных автомобилей -->
      <div
        v-else
        class="cars-grid"
      >

        <CarCard
          v-for="car in favoriteCars"
          :key="car.id"
          :car="car"
        />

      </div>

    </div>

  </q-page>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { getCarById } from 'src/api/carsApi'
import CarCard from 'src/components/CarCard.vue'
import { useFavorites } from 'src/composables/useFavorites.js'

const favoriteCars = ref([])

const {
  favoriteCars: favorites,
  loadFavorites
} = useFavorites()

async function loadFavoriteCars() {
  await loadFavorites()

  const cars = await Promise.all(
    favorites.value.map(favorite =>
      getCarById(favorite.carId)
    )
  )

  favoriteCars.value = cars.map(
    response => response.data
  )
}

onMounted(loadFavoriteCars)
</script>


<style scoped>

.favorites-page {
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
   ПУСТОЕ ИЗБРАННОЕ
   ========================= */

.empty-favorites {
  margin-top: 40px;
  padding: 60px 20px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  background: var(--q-card);
  color: var(--q-text);

  border-radius: 16px;
}

.empty-icon {
  color: var(--q-text);
  opacity: 0.5;
}

.empty-favorites h2 {
  margin: 20px 0 8px;

  color: var(--q-text);
}

.empty-favorites p {
  margin: 0 0 25px;

  color: var(--q-text);
  opacity: 0.65;
}


/* =========================
   СЕТКА АВТОМОБИЛЕЙ
   ========================= */

.cars-grid {
  margin-top: 30px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 24px;
}


/* =========================
   АДАПТИВНОСТЬ
   ========================= */

@media (max-width: 900px) {

  .cars-grid {
    grid-template-columns: repeat(2, 1fr);
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

}

</style>