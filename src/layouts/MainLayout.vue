<template>
  <q-layout view="hHh Lpr lFf">

    <!-- Верхняя панель -->
    <q-header>
      <q-toolbar>

        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Car Rental
        </q-toolbar-title>

        <q-btn
          flat
          round
          icon="notifications_none"
        />

        <ThemeToggle />

        <q-avatar size="36px">
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>

      </q-toolbar>
    </q-header>


    <!-- Боковая панель -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="220"
    >

      <q-list padding>

        <!-- Логотип -->
        <q-item class="q-mb-md">

          <q-item-section avatar>
            <q-avatar
              color="primary"
              text-color="white"
            >
              <q-icon name="directions_car" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-h6">
              CarRental
            </q-item-label>
          </q-item-section>

        </q-item>


        <q-separator />


        <!-- Главная -->
        <q-item
          clickable
          v-ripple
          to="/"
          exact
        >

          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section>
            Главная
          </q-item-section>

        </q-item>


        <!-- Автомобили -->
        <q-item
          clickable
          v-ripple
          to="/cars"
        >

          <q-item-section avatar>
            <q-icon name="directions_car" />
          </q-item-section>

          <q-item-section>
            Автомобили
          </q-item-section>

        </q-item>


        <!-- Бронирования -->
        <q-item
          clickable
          v-ripple
          to="/bookings"
        >

          <q-item-section avatar>
            <q-icon name="event" />
          </q-item-section>

          <q-item-section>
            Бронирования
          </q-item-section>

        </q-item>


        <!-- Избранное -->
          <q-item
            clickable
            v-ripple
            to="/favorites"
          >
            <q-item-section avatar>
              <q-icon name="favorite_border" />
            </q-item-section>

            <q-item-section>
              Избранное
            </q-item-section>

            <q-item-section
              v-if="favoritesCount > 0"
              side
            >
              <q-badge
                color="red"
                :label="favoritesCount"
              />
            </q-item-section>
          </q-item>


        <q-separator class="q-my-md" />


        <!-- Личный кабинет -->
        <q-item
          clickable
          v-ripple
          to="/profile"
        >

          <q-item-section avatar>
            <q-icon name="person_outline" />
          </q-item-section>

          <q-item-section>
            Личный кабинет
          </q-item-section>

        </q-item>


        <!-- Отчёты -->
        <q-item
          clickable
          v-ripple
          to="/reports"
        >

          <q-item-section avatar>
            <q-icon name="bar_chart" />
          </q-item-section>

          <q-item-section>
            Отчёты
          </q-item-section>

        </q-item>


        <!-- Настройки -->
        <q-item
          clickable
          v-ripple
          to="/settings"
        >

          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

          <q-item-section>
            Настройки
          </q-item-section>

        </q-item>

      </q-list>

    </q-drawer>


    <!-- Содержимое текущей страницы -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>


<script setup>
import { ref, computed } from 'vue'
import ThemeToggle from 'src/components/ThemeToggle.vue'
import { useFavorites } from 'src/composables/useFavorites.js'

const leftDrawerOpen = ref(true)

const { favoriteCars } = useFavorites()

const favoritesCount = computed(() => {
  return favoriteCars.value.length
})

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>