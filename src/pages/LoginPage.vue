<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h5">Вход</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin">
          <q-input
            v-model="email"
            type="email"
            label="Email"
            outlined
            class="q-mb-md"
            :error="!!errorMessage"
          />

          <q-input
            v-model="password"
            type="password"
            label="Пароль"
            outlined
            class="q-mb-md"
            :error="!!errorMessage"
          />

          <div
            v-if="errorMessage"
            class="text-negative q-mb-md"
          >
            {{ errorMessage }}
          </div>

          <q-btn
            type="submit"
            label="Войти"
            unelevated
            class="full-width"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from 'src/api/authApi'
import { useAuth } from 'src/composables/useAuth'

const router = useRouter()
const { setToken, setRole } = useAuth()

const email = ref('')
const password = ref('')

const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await login(
      email.value,
      password.value
    )

    const data = response.data

    setToken(data.token)
    setRole(data.role)
    
    localStorage.setItem('username', data.username)
    localStorage.setItem('email', data.email)

    await router.push('/')

  } catch (error) {
    console.error('Login failed:', error)

    errorMessage.value =
      error.response?.data?.message ||
      'Не удалось выполнить вход'
  } finally {
    loading.value = false
  }
}


</script>

