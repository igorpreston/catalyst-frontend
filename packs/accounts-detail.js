import 'miso/dist/lib/miso.min.css'
import { mixin as focusMixin } from 'vue-focus'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import Vuex from 'vuex'
import Vue2Filters from 'vue2-filters'

import {
  Logo,
  MisoHeading,
  MisoLoading,
  CircleBadge
} from 'miso'

import AccountsDetail from '#/components/accounts/accounts-detail'
import FlashMessage from '#/components/FlashMessage'
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

store.dispatch('fetchCurrentUser')

const unsync = sync(store, router)

/* eslint-disable no-new */
document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    el: 'main',
    store,
    router,
    components: {
      MisoHeading,
      Logo,
      SideNavigationLink,
      FlashMessage,
      AccountsDetail,
      CircleBadge
    },
    mixins: [ focusMixin ]
  })
})
