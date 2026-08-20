import { boot } from 'quasar/wrappers'
import { Dark } from 'quasar'

export default boot(() => {
  const saved = localStorage.getItem('theme')
  if (saved) {
    Dark.set(saved === 'dark')
  } else {
    Dark.set('auto')
  }
})