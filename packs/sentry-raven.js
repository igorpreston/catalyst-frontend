import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (catalystEnvironment !== 'development' && catalystEnvironment !== 'test') {
  Raven
    .config(catalystSentry, {
      environment: catalystEnvironment
    })
    .addPlugin(RavenVue, Vue)
    .install()
}

export default {
  Raven,
  RavenVue
}
