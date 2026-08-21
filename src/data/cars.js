const cars = [
  {
    id: 1,
    brand: 'BMW',
    model: '5 Series',
    bodyType: 'Седан',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
    year: 2023,
    transmission: 'Автомат',
    fuel: 'Бензин',
    seats: 5,
    status: 'available'

  },

  {
    id: 2,
    brand: 'Audi',
    model: 'A6',
    bodyType: 'Седан',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6',
    year: 2024,
    transmission: 'Автомат',
    fuel: 'Бензин',
    seats: 5,
    //available, booked, uavailable
    status: 'available'

  },

  {
    id: 3,
    brand: 'Toyota',
    model: 'Camry',
    bodyType: 'Седан',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb',
    year: 2022,
    transmission: 'Автомат',
    fuel: 'Гибрид',
    seats: 5,
    status: 'unavailable'
  }
]

export function getCarById(id) {
  return cars.find(car => car.id === id)
}


export default cars
