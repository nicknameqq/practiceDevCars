import {api} from 'src/boot/axios'

export function login(email, password) {
  return api.post('/auth/login', {
    email,
    password
  })
}

