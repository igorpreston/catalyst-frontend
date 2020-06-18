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
  MisoLoading,
  VTooltip
} from 'miso'

import FlashMessage from '#/components/FlashMessage.vue'
import SegmentsIndex from '#/components/segments/segments-index.vue'
import SegmentsDetail from '#/components/segments/segments-detail.vue'
import SideNavigationLink from '#/components/SideNavigationLink'

Vue.use(Vuex)
Vue.use(Vue2Filters)
Vue.use(VTooltip)
Vue.use(MisoLoading)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    el.querySelector('input').focus()
  }
})

const segmentsIndexEl = document.getElementsByTagName('segments-index')[0]
const segmentsDetailEl = document.getElementsByTagName('segments-detail')[0]

let serverSegments = null
let serverCurrentUser = null

if (!segmentsDetailEl) {
  serverSegments = segmentsIndexEl.getAttribute('server_segments')
  serverCurrentUser = segmentsIndexEl.getAttribute('server_current_user')

  segmentsIndexEl.removeAttribute('server_segments')
  segmentsIndexEl.removeAttribute('server_current_user')
  store.commit('setSegments', serverSegments && JSON.parse(serverSegments))
} else {
  serverCurrentUser = segmentsDetailEl.getAttribute('server_current_user')
  segmentsDetailEl.removeAttribute('server_current_user')
}

store.commit('setCurrentUser', serverCurrentUser && JSON.parse(serverCurrentUser))

const token = document.getElementsByName('csrf-token')[0].getAttribute('content')
axios.defaults.headers.common['X-CSRF-Token'] = token
axios.defaults.headers.common['Accept'] = 'application/json'

const unsync = sync(store, router)

/* eslint-disable no-new */
document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    el: 'main',
    store,
    components: {
      MisoHeading,
      Logo,
      SideNavigationLink,
      FlashMessage,
      CircleBadge,

      SegmentsIndex,
      SegmentsDetail
    } })
})
