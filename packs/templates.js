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
  MisoHeading
} from 'miso'

import FlashMessage from '#/components/FlashMessage'
import SideNavigationLink from '#/components/SideNavigationLink'
import TemplatesIndex from '#/components/templates/templates-index'

Vue.use(Vuex)
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

const templatesEl = document.getElementsByTagName('templates-index')[0]
const serverCurrentUser = templatesEl.getAttribute('server_current_user')
const serverTemplates = templatesEl.getAttribute('server_templates')
const serverNotes = templatesEl.getAttribute('server_notes')
const serverContacts = templatesEl.getAttribute('server_contacts')
const serverRandomContacts = templatesEl.getAttribute('server_random_contacts')
const serverAccounts = templatesEl.getAttribute('server_accounts')
const serverUsers = templatesEl.getAttribute('server_users')

templatesEl.removeAttribute('server_current_user')
templatesEl.removeAttribute('server_templates')
templatesEl.removeAttribute('server_notes')
templatesEl.removeAttribute('server_contacts')
templatesEl.removeAttribute('server_random_contacts')
templatesEl.removeAttribute('server_accounts')
templatesEl.removeAttribute('server_users')

store.commit('setCurrentUser', serverCurrentUser && JSON.parse(serverCurrentUser))
store.commit('setTemplates', serverTemplates && JSON.parse(serverTemplates))
store.commit('setRandomContacts', serverRandomContacts && JSON.parse(serverRandomContacts))
store.commit('setNotes', serverNotes && JSON.parse(serverNotes))
store.commit('setAccounts', serverAccounts && JSON.parse(serverAccounts))
store.commit('setContacts', serverContacts && JSON.parse(serverContacts))
store.commit('setUsers', serverUsers && JSON.parse(serverUsers))

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
      TemplatesIndex
    }
  })
})
