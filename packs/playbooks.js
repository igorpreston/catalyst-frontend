import 'miso/dist/lib/miso.min.css'
import { sync } from 'vuex-router-sync'
import axios from 'axios/index'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import Vuex from 'vuex'

import {
  Logo,
  MisoHeading
} from 'miso'

import FlashMessage from '#/components/FlashMessage'
import SideNavigationLink from '#/components/SideNavigationLink'
import PlaybooksIndex from '#/components/playbooks/playbooks-index'

Vue.use(Vuex)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    el.querySelector('input').focus()
  }
})

// Csrf token Pff
const token = document.getElementsByName('csrf-token')[0].getAttribute('content')
axios.defaults.headers.common['X-CSRF-Token'] = token
axios.defaults.headers.common['Accept'] = 'application/json'

store.dispatch('fetchPlaybooks')
store.dispatch('fetchSegments')
store.dispatch('fetchTemplates')
store.dispatch('fetchCampaigns')
store.dispatch('fetchCurrentUser')
store.dispatch('fetchMetrics')
store.dispatch('fetchEventNames')

const unsync = sync(store, router)

/* eslint-disable no-new */
document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    el: 'main',
    store,
    components: {
      Logo,
      MisoHeading,
      FlashMessage,
      SideNavigationLink,
      PlaybooksIndex
    }
  })
})
