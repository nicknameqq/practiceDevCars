<template>
  <q-page class="admin-cars-page">

    <div class="page-content">

      <div class="page-header">
        <div>
          <h1>Управление автомобилями</h1>

          <p class="subtitle">
            Добавление, редактирование и управление автомобилями
          </p>
        </div>

        <q-btn
          label="Добавить автомобиль"
          icon="add"
          unelevated
          @click="openCreateDialog"
        />
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
                :color="getStatusColor(car.status)"
                :label="car.status"
              />

            </div>

          </div>


          <div class="car-actions">

            <q-btn
              flat
              icon="edit"
              label="Редактировать"
              @click="openEditDialog(car)"
            />

            <q-btn
              flat
              color="negative"
              icon="delete"
              label="Удалить"
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
          Автомобилей пока нет
        </h2>
      </div>

    </div>


    <!-- =========================
         ДИАЛОГ СОЗДАНИЯ / РЕДАКТИРОВАНИЯ
         ========================= -->

    <q-dialog v-model="dialogVisible">

      <q-card class="car-dialog">

        <q-card-section>

          <div class="text-h6">
            {{ editingCar
              ? 'Редактировать автомобиль'
              : 'Добавить автомобиль'
            }}
          </div>

        </q-card-section>


        <q-card-section>

          <q-form
            @submit.prevent="saveCar"
            class="form"
          >

            <q-input
              v-model="form.brand"
              label="Марка"
              outlined
              :rules="[val => !!val || 'Введите марку']"
            />

            <q-input
              v-model="form.model"
              label="Модель"
              outlined
              :rules="[val => !!val || 'Введите модель']"
            />

            <q-input
              v-model.number="form.year"
              label="Год"
              type="number"
              outlined
              :rules="[val => !!val || 'Введите год']"
            />

            <q-input
              v-model="form.bodyType"
              label="Тип кузова"
              outlined
            />

            <q-input
              v-model.number="form.price"
              label="Цена за день"
              type="number"
              outlined
              :rules="[val => val > 0 || 'Цена должна быть больше 0']"
            />

            <q-input
              v-model="form.image"
              label="URL изображения"
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
              label="Количество мест"
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
                label="Отмена"
                flat
                v-close-popup
              />

              <q-btn
                label="Сохранить"
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
    label: 'Доступен',
    value: 'AVAILABLE'
  },
  {
    label: 'Недоступен',
    value: 'UNAVAILABLE'
  }
]


async function loadCars() {

  loading.value = true

  try {

    const response = await getCars({
      size: 100
    })

    cars.value = response.data.content

  } catch (error) {

    console.error(
      'Failed to load cars:',
      error
    )

  } finally {

    loading.value = false

  }

}


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
        cars.value[index] = response.data
      }

    } else {

      const response =
        await createCar(form.value)

      cars.value.push(response.data)

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


async function handleDelete(car) {

  const confirmed =
    window.confirm(
      `Удалить ${car.brand} ${car.model}?`
    )

  if (!confirmed) {
    return
  }

  try {

    const response =
      await deleteCar(car.id)

    const index =
      cars.value.findIndex(
        item => item.id === car.id
      )

    if (index !== -1) {
      cars.value[index] = response.data
    }

  } catch (error) {

    console.error(
      'Failed to delete car:',
      error
    )

  }

}


function getStatusColor(status) {

  if (status === 'AVAILABLE') {
    return 'positive'
  }

  if (status === 'BOOKED') {
    return 'warning'
  }

  return 'negative'

}


onMounted(loadCars)

</script>


<style scoped>

.admin-cars-page {
  min-height: 100%;
  background: var(--q-background);
}


.page-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
}


.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}


h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
}


.subtitle {
  margin: 8px 0 0;
  opacity: .65;
}


.loading-container {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}


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

  background: var(--q-card);
  color: var(--q-text);

  border: 1px solid var(--q-border);
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


.car-actions {
  display: flex;
  gap: 5px;
}


.empty-state {
  text-align: center;
  padding: 80px 20px;
  opacity: .6;
}


.empty-state h2 {
  margin-top: 15px;
}


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


@media (max-width: 700px) {

  .page-header {
    flex-direction: column;
    align-items: stretch;
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
