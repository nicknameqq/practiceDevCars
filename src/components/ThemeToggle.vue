<script setup>
import { Dark } from 'quasar'

function toggleDarkMode() {
  Dark.toggle()
}
</script>

<template>
  <q-btn
    :icon="Dark.isActive ? 'light_mode' : 'dark_mode'"
    round
    unelevated
    @click="toggleDarkMode"
  />
</template>