const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children:[{path: '', component: () => import('pages/IndexPage.vue')},
              {path: 'cars',component: () => import('pages/CarsPage.vue')},
             {path: 'cars/:id', component: () => import('pages/CarDetailsPage.vue')}],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
