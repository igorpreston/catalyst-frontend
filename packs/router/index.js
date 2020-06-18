import accounts from './accounts'
import contacts from './contacts'
import dashboard from './dashboard'
import tasks from './tasks'

import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

export const routes = [
  ...dashboard,
  ...tasks,
  ...accounts,
  ...contacts
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
