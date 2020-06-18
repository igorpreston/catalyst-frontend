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

import SettingsIndex from '#/components/settings/Index.vue'
import SettingsIntegrations from '#/components/settings/Integration.vue'
import SettingsEvents from '#/components/settings/Events.vue'
import SettingsMappings from '#/components/settings/Mappings.vue'
import FlashMessage from '#/components/FlashMessage.vue'
import SideNavigationLink from '#/components/SideNavigationLink'

Vue.use(Vuex)
Vue.use(MisoLoading)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    el.querySelector('input').focus()
  }
})

const settingsIndexEl = document.getElementsByTagName('settings-index')[0]
if (settingsIndexEl) {
  settingsIndexEl.removeAttribute('server_users')
  settingsIndexEl.removeAttribute('server_current_user')
}

const token = document.getElementsByName('csrf-token')[0].getAttribute('content')
axios.defaults.headers.common['X-CSRF-Token'] = token
axios.defaults.headers.common['Accept'] = 'application/json'

const unsync = sync(store, router)

/* eslint-disable no-new */
document.addEventListener('DOMContentLoaded', () => {
  store.dispatch('fetchCurrentUser')
  new Vue({
    el: 'main',
    store,
    router,
    components: {
      MisoHeading,
      Logo,
      SideNavigationLink,
      FlashMessage,
      SettingsIndex,
      SettingsEvents,
      SettingsIntegrations,
      SettingsMappings,
      CircleBadge
    }
  })
})
