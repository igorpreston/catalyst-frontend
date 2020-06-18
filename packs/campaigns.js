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
  MisoLoading,
  CircleBadge
} from 'miso'

import FlashMessage from '#/components/FlashMessage.vue'
import CampaignsIndex from '#/components/campaigns/Index.vue'
import CampaignsDetail from '#/components/campaigns/Detail.vue'
import CampaignsNew from '#/components/campaigns/New.vue'
import Editor from '#/components/Editor.vue'
import SideNavigationLink from '#/components/SideNavigationLink'

Vue.use(Vuex)
Vue.use(MisoLoading)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.filter('pad', (value) => {
  const padFunc = (n, width, z) => {
    z = z || '0'
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
  }

  return padFunc(value, 2)
})
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    el.querySelector('input').focus()
  }
})

let token = document.getElementsByName('csrf-token')[0].getAttribute('content')
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
      MisoLoading,
      MisoHeading,
      Logo,
      SideNavigationLink,
      FlashMessage,
      CampaignsIndex,
      CampaignsDetail,
      CampaignsNew,
      Editor,
      CircleBadge
    }
  })
})
