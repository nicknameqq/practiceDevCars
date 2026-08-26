import { ref, computed } from 'vue'

const token = ref(localStorage.getItem('token'))

const isAuthenticated = computed(() => !!token.value)

function setToken(newToken) {
  token.value = newToken
  localStorage.setItem('token', newToken)
}

function logout() {
  token.value = null

  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('email')
}

export function useAuth() {
  return {
    token,
    isAuthenticated,
    setToken,
    logout
  }
}

