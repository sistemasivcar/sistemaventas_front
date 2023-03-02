import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store'
import Cate from '../components/Cate.vue'
import Login from '../components/Login.vue'
import Article from '../components/Article.vue'
import Ingreso from '../components/Ingreso.vue'
import Client from '../components/Client.vue'
import Proveedor from '../components/Proveedor';
import User from '../components/User.vue';
import Venta from '../components/Venta';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      administrador: true,
      almacenero: true,
      vendedor: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { libre: true }
  },
  {
    path: '/proveedores',
    name: 'proveedor',
    component: Proveedor,
    meta: {
      administrador: true,
      almacenero: true
    }
  },
  {
    path: '/ingresos',
    name: 'ingreso',
    component: Ingreso,
    meta: {
      administrador: true,
      vendedor: true
    }
  },
  {
    path: '/ventas',
    name: 'venta',
    component: Venta,
    meta: {
      administrador: true,
      vendedor: true
    }
  },
  {
    path: '/users',
    name: 'user',
    component: User,
    meta: { administrador: true }
  },
  {
    path: '/clientes',
    name: 'client',
    component: Client,
    meta: {
      administrador: true,
      vendedor: true
    }
  },
  {
    path: '/articles',
    name: 'article',
    component: Article,
    meta: {
      administrador: true,
      almacenero: true
    }
  },
  {
    path: '/categories',
    name: 'category',
    component: Cate,
    meta: {
      administrador: true,
      almacenero: true,
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
    next();
  } else if (store.state.user && store.state.user.rol == "admin") {
    if (to.matched.some(record => record.meta.administrador)) {
      next();
    }
  } else if (store.state.user && store.state.user.rol == "vendedor") {
    if (to.matched.some(record => record.meta.vendedor)) {
      next();
    }
  } else if (store.state.user && store.state.user.rol == "almacenero") {
    if (to.matched.some(record => record.meta.almacenero)) {
      next();
    }
  } else {
    next({ name: 'login' });
  }
})
export default router
