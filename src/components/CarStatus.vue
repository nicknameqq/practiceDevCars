<template>
  <div
    class="car-status"
    :class="`status-${status}`"
  >
    <span class="status-dot"></span>

    {{ statusText }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'available':
      return 'Доступне'

    case 'booked':
      return 'Заброньоване'

    case 'unavailable':
      return 'Недоступне'

    default:
      return 'Невідомий статус'
  }
})
</script>

<style scoped>
.car-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  font-size: 14px;
  font-weight: 600;
}

.status-dot {
  width: 9px;
  height: 9px;

  border-radius: 50%;

  background: currentColor;
}

.status-available {
  color: #6f9b6a;
}

.status-booked {
  color: #d4a24c;
}

.status-unavailable {
  color: #c9564f;
}
</style>