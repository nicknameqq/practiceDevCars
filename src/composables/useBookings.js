import { ref } from 'vue'


const STORAGE_KEY = 'bookings'


const bookings = ref(
  loadBookings()
)


// =========================
// ЗАГРУЗКА БРОНИРОВАНИЙ
// =========================

function loadBookings() {

  const data =
    localStorage.getItem(
      STORAGE_KEY
    )

  return data
    ? JSON.parse(data)
    : []

}


// =========================
// СОХРАНЕНИЕ БРОНИРОВАНИЙ
// =========================

function saveBookings() {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(
      bookings.value
    )

  )

}


export function useBookings() {


  // =========================
  // ДОБАВЛЕНИЕ БРОНИРОВАНИЯ
  // =========================

  function addBooking(booking) {

    bookings.value.push({

      id:
        Date.now(),

      ...booking

    })


    saveBookings()

  }


  // =========================
  // УДАЛЕНИЕ БРОНИРОВАНИЯ
  // =========================

  function removeBooking(id) {

    bookings.value =
      bookings.value.filter(

        booking =>
          booking.id !== id

      )


    saveBookings()

  }


  return {

    bookings,

    addBooking,

    removeBooking

  }

}