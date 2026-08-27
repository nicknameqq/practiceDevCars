import {api} from 'src/boot/axios'

export function getProfile() { return api.get('/profile') }

export function updateProfile(data) { return api.put('/profile', data) }
