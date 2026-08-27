import { ref, computed } from 'vue'

const token = ref(localStorage.getItem('token'))
const role = ref(localStorage.getItem('role'))

const isAuthenticated = computed(() => !!token.value)
const isAdmin = computed(() => role.value === 'ADMIN')

function setToken(newToken) {
  token.value = newToken
  localStorage.setItem('token', newToken)
}

function setRole(newRole) {
  role.value = newRole
  localStorage.setItem('role', newRole)
}

function logout() {
  token.value = null
  role.value = null

  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('username')
  localStorage.removeItem('email')
}

export function useAuth() {
  return {
    token,
    role,
    isAuthenticated,
    isAdmin,
    setToken,
    setRole,
    logout
  }
}