const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'cars',
        component: () => import('pages/CarsPage.vue')
      },
      {
        path: 'cars/:id',
        component: () => import('pages/CarDetailsPage.vue')
      },
      {
        path: 'bookings',
        component: () => import('pages/BookingsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true }
      },
        {
          path: 'admin',
          component: () => import('pages/AdminPage.vue'),
            meta: {
              requiresAuth: true,
              requiresAdmin: true
            }
        },
        {
          path: 'admin/cars',
          component: () => import('pages/AdminCarsPage.vue'),
          meta: {
            requiresAuth: true,
            requiresAdmin: true
          }
        },
        {
          path: '/admin/bookings',
          component: () => import('pages/AdminBookingsPage.vue'),
          meta: {
            requiresAdmin: true
          }
        },
      {
        path: 'favorites',
        component: () => import('pages/FavoritesPage.vue'),
        meta: { requiresAuth: true }
      },
        {
          path: '/login',
          component: () => import('pages/LoginPage.vue'),
          meta: { guestOnly: true }
        }
    ]
  },



  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

