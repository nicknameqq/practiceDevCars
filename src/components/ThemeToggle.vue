<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function toggleDarkMode () {
  $q.dark.toggle()
  localStorage.setItem('theme', $q.dark.isActive ? 'dark' : 'light')
}
</script>

<template>
  <q-btn
    :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
    round
    unelevated
    flat
    @click="toggleDarkMode"
  />
</template>