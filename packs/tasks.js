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
  Logo,
  MisoHeading,
  MisoLoading,
  CircleBadge
} from 'miso'

import FlashMessage from '#/components/FlashMessage'
import SideNavigationLink from '#/components/SideNavigationLink'
import TasksReview from '#/components/tasks/tasks-review'

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

let serverBackUrl
let reviewIds

const tasksReviewEl = document.getElementsByTagName('tasks-review')[0]
if (tasksReviewEl) {
  serverBackUrl = tasksReviewEl.getAttribute('server_back_url')
  reviewIds = JSON.parse(tasksReviewEl.getAttribute('server_review_ids'))
  tasksReviewEl.removeAttribute('server_tasks')
  tasksReviewEl.removeAttribute('server_back_url')
}

if (serverBackUrl) {
  store.commit('setReviewBackUrl', serverBackUrl)
}

if (reviewIds) {
  store.commit('setReviewIds', reviewIds)
}

store.dispatch('fetchCurrentUser')

const unsync = sync(store, router)

/* eslint-disable no-new */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('full-screen')

  new Vue({
    el: 'main',
    store,
    router,
    components: {
      CircleBadge,
      FlashMessage,
      MisoHeading,
      Logo,
      SideNavigationLink,
      TasksReview
    }
  })
})
