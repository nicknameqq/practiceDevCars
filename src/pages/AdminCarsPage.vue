<template>

  <q-page class="admin-cars-page">

    <div class="page-content">

      <!-- HEADER -->

      <div class="page-header">

        <div>

          <h1>
            Управління авто
          </h1>

          <p class="subtitle">
            Додавання, редагування та управління авто
          </p>

        </div>


        <div class="header-actions">

          <q-btn
            label="Додати авто"
            icon="add"
            unelevated
            @click="openCreateDialog"
          />

          <q-btn
            flat
            icon="arrow_back"
            label="Назад"
            class="back-btn"
            @click="$router.push('/admin')"
          />

        </div>

      </div>


      <!-- Загрузка -->

      <div
        v-if="loading"
        class="loading-container"
      >

        <q-spinner
          size="50px"
          color="primary"
        />

      </div>


      <!-- Автомобили -->

      <div
        v-else
        class="cars-list"
      >

        <q-card
          v-for="car in cars"
          :key="car.id"
          class="car-item"
          flat
        >

          <div class="car-info">

            <q-img
              :src="car.image"
              :ratio="16 / 9"
              class="car-image"
            />

            <div class="car-details">

              <div class="car-title">
                {{ car.brand }} {{ car.model }}
              </div>

              <div class="car-data">
                {{ car.year }} ·
                {{ car.bodyType }} ·
                {{ car.transmission }}
              </div>

              <div class="car-price">
                {{ car.price }} ₴ / день
              </div>

              <q-badge
                class="status-badge"
                :color="getStatusColor(car.status)"
                :label="getStatusLabel(car.status)"
              />

            </div>

          </div>


          <!-- ACTIONS -->

          <div class="car-actions">

            <q-btn
              flat
              dense
              icon="edit"
              label="Редагувати"
              class="action-btn"
              @click="openEditDialog(car)"
            />

            <q-btn
              flat
              dense
              color="negative"
              icon="delete"
              label="Видалити"
              class="action-btn delete-btn"
              @click="handleDelete(car)"
            />

          </div>

        </q-card>

      </div>


      <!-- Нет автомобилей -->

      <div
        v-if="!loading && cars.length === 0"
        class="empty-state"
      >

        <q-icon
          name="directions_car"
          size="60px"
        />

        <h2>
          Авто ще немає
        </h2>

      </div>


      <!-- PAGINATION -->

      <div
        v-if="totalPages > 1 && !loading"
        class="pagination-wrapper"
      >

        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="7"
          direction-links
          boundary-links
          @update:model-value="loadCars"
        />

      </div>


      <!-- PAGINATION INFO -->

      <div
        v-if="totalElements > 0 && !loading"
        class="pagination-info"
      >

        Показано

        {{ (currentPage - 1) * pageSize + 1 }}

        —

        {{
          Math.min(
            currentPage * pageSize,
            totalElements
          )
        }}

        из

        {{ totalElements }}

      </div>

    </div>


    <!-- =========================
         ДИАЛОГ
         ========================= -->

    <q-dialog v-model="dialogVisible">

      <q-card class="car-dialog">

        <q-card-section>

          <div class="text-h6">

            {{
              editingCar
                ? 'Редагувати авто'
                : 'Додати авто'
            }}

          </div>

        </q-card-section>


        <q-card-section>

          <q-form
            class="form"
            @submit.prevent="saveCar"
          >

            <q-input
              v-model="form.brand"
              label="Марка"
              outlined
              :rules="[
                val => !!val || 'Уведіть марку'
              ]"
            />

            <q-input
              v-model="form.model"
              label="Модель"
              outlined
              :rules="[
                val => !!val || 'Уведіть модель'
              ]"
            />

            <q-input
              v-model.number="form.year"
              label="Год"
              type="number"
              outlined
              :rules="[
                val => !!val || 'Уведіть рік'
              ]"
            />

            <q-input
              v-model="form.bodyType"
              label="Тип кузова"
              outlined
            />

            <q-input
              v-model.number="form.price"
              label="Ціна за день"
              type="number"
              outlined
              :rules="[
                val => val > 0 ||
                'Ціна має бути більше 0'
              ]"
            />

            <q-input
              v-model="form.image"
              label="URL зображення"
              outlined
            />

            <q-select
              v-model="form.transmission"
              :options="transmissionOptions"
              label="Коробка передач"
              outlined
              emit-value
              map-options
            />

            <q-select
              v-model="form.fuel"
              :options="fuelOptions"
              label="Тип топлива"
              outlined
              emit-value
              map-options
            />

            <q-input
              v-model.number="form.seats"
              label="Кількість місць"
              type="number"
              outlined
            />

            <q-select
              v-model="form.status"
              :options="statusOptions"
              label="Статус"
              outlined
              emit-value
              map-options
            />

            <div class="dialog-actions">

              <q-btn
                label="Відмінити"
                flat
                v-close-popup
              />

              <q-btn
                label="Зберегти"
                type="submit"
                unelevated
                :loading="saving"
              />

            </div>

          </q-form>

        </q-card-section>

      </q-card>

    </q-dialog>

  </q-page>

</template>


<script setup>

import {
  ref,
  onMounted
} from 'vue'

import {
  getCars,
  createCar,
  updateCar,
  deleteCar
} from 'src/api/carsApi'


const cars = ref([])

const loading = ref(false)
const saving = ref(false)

const dialogVisible = ref(false)

const editingCar = ref(null)


/*
 * PAGINATION
 */

const currentPage = ref(1)

const pageSize = 12

const totalPages = ref(0)

const totalElements = ref(0)


/*
 * FORM
 */

const form = ref({
  brand: '',
  model: '',
  year: null,
  bodyType: '',
  price: null,
  image: '',
  transmission: null,
  fuel: null,
  seats: null,
  status: 'AVAILABLE'
})


/*
 * OPTIONS
 */

const transmissionOptions = [

  {
    label: 'Автомат',
    value: 'AUTOMATIC'
  },

  {
    label: 'Механика',
    value: 'MANUAL'
  }

]


const fuelOptions = [

  {
    label: 'Бензин',
    value: 'PETROL'
  },

  {
    label: 'Дизель',
    value: 'DIESEL'
  },

  {
    label: 'Электро',
    value: 'ELECTRIC'
  },

  {
    label: 'Гибрид',
    value: 'HYBRID'
  }

]


const statusOptions = [

  {
    label: 'Доступне',
    value: 'AVAILABLE'
  },

  {
    label: 'Недоступне',
    value: 'UNAVAILABLE'
  }

]


/*
 * LOAD CARS
 */

async function loadCars() {

  loading.value = true

  try {

    /*
     * UI pages start from 1.
     *
     * Spring Pageable pages start from 0.
     *
     * Therefore:
     *
     * UI 1 -> backend 0
     * UI 2 -> backend 1
     * UI 3 -> backend 2
     */

    const response =
      await getCars({

        page: currentPage.value - 1,

        size: pageSize

      })


    const data =
      response.data


    cars.value =
      data.content


    totalPages.value =
      data.totalPages


    totalElements.value =
      data.totalElements

  } catch (error) {

    console.error(
      'Failed to load cars:',
      error
    )

  } finally {

    loading.value = false

  }

}


/*
 * CREATE
 */

function openCreateDialog() {

  editingCar.value = null

  form.value = {

    brand: '',
    model: '',
    year: null,
    bodyType: '',
    price: null,
    image: '',
    transmission: null,
    fuel: null,
    seats: null,
    status: 'AVAILABLE'

  }

  dialogVisible.value = true

}


/*
 * EDIT
 */

function openEditDialog(car) {

  editingCar.value = car

  form.value = {

    brand: car.brand,
    model: car.model,
    year: car.year,
    bodyType: car.bodyType,
    price: car.price,
    image: car.image,
    transmission: car.transmission,
    fuel: car.fuel,
    seats: car.seats,
    status: car.status

  }

  dialogVisible.value = true

}


/*
 * SAVE
 */

async function saveCar() {

  saving.value = true

  try {

    if (editingCar.value) {

      const response =
        await updateCar(
          editingCar.value.id,
          form.value
        )


      const index =
        cars.value.findIndex(
          car =>
            car.id === editingCar.value.id
        )


      if (index !== -1) {

        cars.value[index] =
          response.data

      }

    } else {

      await createCar(form.value)

      /*
       * После создания автомобиля
       * перезагружаем текущую страницу.
       *
       * Это важно для правильной
       * работы pagination.
       */

      await loadCars()

    }


    dialogVisible.value = false

  } catch (error) {

    console.error(
      'Failed to save car:',
      error
    )

  } finally {

    saving.value = false

  }

}


/*
 * DELETE
 */

async function handleDelete(car) {

  const confirmed =
    window.confirm(
      `Удалить ${car.brand} ${car.model}?`
    )


  if (!confirmed) {
    return
  }


  try {

    await deleteCar(car.id)

    /*
     * Если после удаления
     * текущая страница стала пустой,
     * переходим на предыдущую страницу.
     */

    if (
      cars.value.length === 1 &&
      currentPage.value > 1
    ) {

      currentPage.value--

    }


    await loadCars()

  } catch (error) {

    console.error(
      'Failed to delete car:',
      error
    )

  }

}


/*
 * STATUS COLOR
 */

function getStatusColor(status) {

  if (status === 'AVAILABLE') {
    return 'positive'
  }

  if (status === 'BOOKED') {
    return 'warning'
  }

  return 'negative'

}


/*
 * STATUS LABEL
 */

function getStatusLabel(status) {

  if (status === 'AVAILABLE') {
    return 'Доступен'
  }

  if (status === 'BOOKED') {
    return 'Забронирован'
  }

  if (status === 'UNAVAILABLE') {
    return 'Недоступен'
  }

  return status

}


onMounted(
  loadCars
)

</script>


<style scoped>

.admin-cars-page {

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


.back-btn {

  font-weight: 600;

}


/* =========================
   TITLE
   ========================= */

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
   LOADING
   ========================= */

.loading-container {

  display: flex;

  justify-content: center;

  padding: 80px 0;

}


/* =========================
   CARS
   ========================= */

.cars-list {

  display: flex;

  flex-direction: column;

  gap: 15px;

}


.car-item {

  padding: 20px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  background:
    var(--q-card);

  color:
    var(--q-text);

  border:
    1px solid
    var(--q-border);

  border-radius: 16px;

}


.car-info {

  display: flex;

  align-items: center;

  gap: 20px;

}


.car-image {

  width: 180px;

  border-radius: 12px;

}


.car-details {

  display: flex;

  flex-direction: column;

  align-items: flex-start;

  gap: 7px;

}


.car-title {

  font-size: 21px;

  font-weight: 800;

}


.car-data {

  opacity: .65;

}


.car-price {

  font-size: 18px;

  font-weight: 700;

}


/* =========================
   STATUS
   ========================= */

.status-badge {

  padding: 5px 10px;

  border-radius: 7px;

  font-size: 12px;

  font-weight: 700;

  line-height: 1.2;

}


/* =========================
   ACTIONS
   ========================= */

.car-actions {

  display: flex;

  align-items: center;

  gap: 4px;

}


.action-btn {

  min-height: 32px;

  padding: 4px 9px;

  font-size: 13px;

  font-weight: 900;

}


.delete-btn {

  font-weight: 900;

}


/* =========================
   PAGINATION
   ========================= */

.pagination-wrapper {

  display: flex;

  justify-content: center;

  margin-top: 25px;

}


.pagination-info {

  margin-top: 12px;

  text-align: center;

  font-size: 13px;

  opacity: .55;

}


/* =========================
   EMPTY
   ========================= */

.empty-state {

  text-align: center;

  padding: 80px 20px;

  opacity: .6;

}


.empty-state h2 {

  margin-top: 15px;

}


/* =========================
   DIALOG
   ========================= */

.car-dialog {

  width: 550px;

  max-width: 90vw;

}


.form {

  display: flex;

  flex-direction: column;

  gap: 15px;

}


.dialog-actions {

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 10px;

}


/* =========================
   MOBILE
   ========================= */

@media (max-width: 700px) {

  .page-header {

    flex-direction: column;

    align-items: stretch;

  }


  .header-actions {

    justify-content: space-between;

  }


  .car-item {

    flex-direction: column;

    align-items: stretch;

  }


  .car-info {

    flex-direction: column;

    align-items: stretch;

  }


  .car-image {

    width: 100%;

  }


  .car-actions {

    justify-content: flex-end;

  }

}

</style>