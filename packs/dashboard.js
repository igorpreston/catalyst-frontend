import 'miso/dist/lib/miso.min.css'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import Vuex from 'vuex'
import Vue2Filters from 'vue2-filters'

import {
  CircleBadge,
  Logo,
  MisoHeading,
  MisoLoading
} from 'miso'

import FlashMessage from '#/components/FlashMessage.vue'
import Dashboard from '#/components/dashboard/dashboard'
import SideNavigationLink from '#/components/SideNavigationLink'

Vue.use(Vuex)
Vue.use(Vue2Filters)
Vue.use(MisoLoading)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    el.querySelector('input').focus()
  }
})

const token = document.getElementsByName('csrf-token')[0].getAttribute('content')
axios.defaults.headers.common['X-CSRF-Token'] = token
axios.defaults.headers.common['Accept'] = 'application/json'

store.dispatch('fetchCurrentUser').then(res => {
  store.dispatch('updateFilter', {field: 'owner_id', value: res.data.id})
})

const unsync = sync(store, router)

/* eslint-disable no-new */
document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    el: 'main',
    store,
    components: {
      Logo,
      SideNavigationLink,
      MisoHeading,
      FlashMessage,
      Dashboard,
      CircleBadge
    }
  })
})
