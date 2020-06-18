import 'miso/dist/lib/miso.min.css'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import Vuex from 'vuex'

import {
  Logo,
  MisoHeading,
  CircleBadge
} from 'miso'

import FlashMessage from '#/components/FlashMessage.vue'
import SideNavigationLink from '#/components/SideNavigationLink'
import UsersIndex from '#/components/users/Index.vue'
import UsersDetail from '#/components/users/Detail.vue'

Vue.use(Vuex)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    el.querySelector('input').focus()
  }
})

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
axios.defaults.headers.common['X-CSRF-Token'] = token
axios.defaults.headers.common['Accept'] = 'application/json'

const unsync = sync(store, router)

/* eslint-disable no-new */
document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    el: 'main',
    components: {
      MisoHeading,
      Logo,
      SideNavigationLink,
      FlashMessage,
      CircleBadge,
      UsersIndex,
      UsersDetail
    }
  })
})
