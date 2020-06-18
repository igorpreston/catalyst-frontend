<template>
  <div
    id="settings-integrations"
    class="vh-100 bg-off-purple component-wrap">
    <div v-if="showControls">
      <header class="bg-white pa3 bb b--purple-gray shadow-1">
        <back-link
          destination="/settings"
          text="Integrations"
          class="db mb1"/>
        <div class="flex items-center">
          <miso-heading
            class="mv0"
            level="3">{{ serviceName }}</miso-heading>
        </div>
      </header>
      <section class="pa3">
        <miso-tabs
          v-model="activeTab"
          class="bg-white ba b--purple-gray">
          <miso-tab-pane
            v-if="!isSegment && !isMixpanel"
            name="overview"
            label="Connection"
            class="pa3">
            <article class="pb3 bb b--light-gray">
              <miso-heading
                level="5"
                class="normal mid-gray mv0">Connection Status</miso-heading>
              <miso-status-indicator
                v-if="needConfig"
                :status="false"
                class="mt2"
                false-label="Please configure your Zendesk integration before authorizing the connection"/>
              <miso-status-indicator
                v-if="needAuth"
                :status="false"
                class="mt2"
                false-label="Please authorize the connection"/>
              <miso-status-indicator
                v-if="!showAuth"
                :status="true"
                class="mt2"
                true-label="All systems operational"/>
              <div class="pt2">
                <miso-button
                  v-if="showAuth"
                  type="primary"
                  @click="authorize">
                  Authorize Connection
                </miso-button>
                <miso-button
                  type="danger"
                  @click="toggleDeleteModal">
                  Remove Integration
                </miso-button>
              </div>
              <div class="pt2">
                <miso-button
                  v-if="!showAuth"
                  type="primary"
                  @click="callTriggerSync">
                  <div class="flex items-center">
                    <feather-icon
                      name="download-cloud"
                      height="16"
                      width="16"
                      color="white"
                      class="mr2"/>
                    Trigger sync
                  </div>
                </miso-button>
              </div>
            </article>
          </miso-tab-pane>
          <miso-tab-pane
            v-if="isZendesk"
            name="configuration"
            label="Configuration"
            class="pa3">
            <miso-label class="mid-gray">Zendesk Subdomain</miso-label>
            <miso-input
              v-model="subdomain"
              placeholder="Enter your Zendesk subdomain"/>
            <div class="flex items-center justify-end pa3">
              <miso-button
                class="mr2"
                type="primary"
                @click="updateZendeskConfig">
                Save
              </miso-button>
            </div>
          </miso-tab-pane>

          <miso-tab-pane
            v-if="isSegment"
            name="configuration"
            label="Configuration"
            class="pa3">

            <miso-button
              v-if="integration && integration.id"
              type="danger"
              @click="toggleDeleteModal">
              Remove Integration
            </miso-button>

            <miso-button
              v-else
              type="primary"
              @click="updateSegmentConfig ">
              Integrate
            </miso-button>

            <p>To send events from Segment to Catalyst, create a new webhook destination with the following URL and
            shared secret. Do not share your URL or secret with anyone.</p>

            <miso-label class="mid-gray">Segment Shared Secret</miso-label>
            <miso-input
              :autoselect="true"
              :value="events_api_key"
              disabled
              class="mb2"/>

            <miso-label class="mid-gray">Event Endpoint Information</miso-label>
            <miso-input
              v-model="segment_endpoint"
              disabled
              placeholder="(loading endpoint...)"/>
          </miso-tab-pane>
          <miso-tab-pane
            v-if="isMixpanel"
            name="configuration"
            label="Configuration"
            class="pa3">
            <miso-button
              type="danger"
              @click="toggleDeleteModal">
              Remove Integration
            </miso-button>

            <p>To send events from Mixpanel to Catalyst, go to your project settings (settings -> project settings) and
            copy-paste the
            API secret key in the input below, and we will sync all incoming events into Catalyst.</p>

            <miso-label class="mid-gray">Mixpanel Project Secret</miso-label>
            <miso-input
              :autoselect="true"
              :value="mixpanelApiSecret"
              class="mb2"
              @input="setMixpanelApiSecret"/>

            <miso-label class="mid-gray">Mixpanel Project Timezone</miso-label>

            <miso-select
              :remote-method="setMixpanelTimezoneFilterQuery"
              :value="mixpanelTimeZone"
              filterable
              clearable
              remote
              value-key="value"
              class="w-100 white-select"
              placeholder="Search by timezone name"
              @input="setMixpanelTimezone">
              <miso-option
                v-for="timezone in filteredTimezones"
                :key="timezone"
                :value="timezone"
                :label="timezone"/>
            </miso-select>

            <div class="flex items-center justify-end pa3">
              <miso-button
                class="mr2"
                type="primary"
                @click="updateMixpanelConfig">
                Save
              </miso-button>
            </div>

          </miso-tab-pane>
        </miso-tabs>
      </section>
    </div>

    <miso-modal :visible.sync="deleteModalVisible">
      <header
        slot="title"
        class="flex items-center justify-between">
        <miso-heading
          level="3"
          class="mv0">
          Remove integration?
        </miso-heading>
        <miso-button
          type="transparent"
          @click="toggleDeleteModal">
          <feather-icon
            color="mid-gray"
            width="24"
            height="24"
            name="x"/>
        </miso-button>
      </header>
      <div class="pa3">
        <p class="lh-copy f5 mv0">This operation will remove this integration from your organization's entire account.
        If you are absolutely sure that you wish to proceed, please type the integration name into the box below.</p>
      </div>
      <div class="pa3">
        <miso-input
          :autoselect="true"
          :placeholder="deletePlaceholder"
          v-model="deleteModalServiceName"
          class="w-100"/>
      </div>
      <footer
        slot="footer"
        class="pa3">
        <miso-button
          class="mr2"
          type="default"
          @click="toggleDeleteModal">
          Cancel
        </miso-button>
        <miso-button
          :disabled="deleteDisabled"
          type="danger"
          @click="callDeleteIntegration">
          Remove permanently
        </miso-button>
      </footer>
    </miso-modal>
  </div>
</template>

<script>
import {
  MisoHeading,
  BackLink,
  MisoTabs,
  MisoTabPane,
  MisoLabel,
  MisoButton,
  MisoStatusIndicator,
  MisoMessage,
  MisoInput,
  MisoModal,
  MisoSelect,
  MisoOption,
  FeatherIcon
} from 'miso'

import _ from 'lodash'
import { mapActions } from 'vuex'
import TimeZones from '../mixins/timezones'

export default {
  name: 'SettingsIntegrations',
  components: {
    MisoHeading,
    BackLink,
    MisoMessage,
    MisoTabs,
    MisoTabPane,
    MisoLabel,
    MisoButton,
    MisoStatusIndicator,
    MisoInput,
    MisoModal,
    MisoSelect,
    MisoOption,
    FeatherIcon
  },

  mixins: [ TimeZones ],

  props: {
    external_service_name: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      integration: {},
      activeTab: 'overview',
      deleteModalVisible: false,
      deleteModalServiceName: '',
      events_api_key: '',
      segment_endpoint: '',
      subdomain: '',
      mixpanel_api_secret: '',
      mixpanel_timezone: null,
      mixpanel_timezone_filter_query: ''
    }
  },

  computed: {
    serviceName () {
      return this.integration.external_service_name || this.external_service_name
    },

    showControls () {
      return !_.isEmpty(this.integration)
    },

    deleteDisabled () {
      return _.lowerCase(this.deleteModalServiceName) !== _.lowerCase(this.serviceName)
    },

    deletePlaceholder () {
      return `Type name of integration (e.g. ${this.serviceName})`
    },

    showAuth () {
      return _.isEmpty(this.integration.identity_id)
    },

    needAuth () {
      return this.showAuth && (this.isZendesk !== _.isEmpty(this.subdomain))
    },

    isZendesk () {
      return this.serviceName === 'Zendesk'
    },

    isSegment () {
      return this.serviceName.toLowerCase() === 'segment'
    },

    isMixpanel () {
      return this.serviceName.toLowerCase() === 'mixpanel'
    },

    needConfig () {
      return this.isZendesk && this.showAuth && _.isEmpty(this.subdomain)
    },

    mixpanelApiSecret () {
      if (!this.mixpanel_api_secret) {
        return this.integration &&
            this.integration.config &&
            this.integration.config.api_secret
      }

      return this.mixpanel_api_secret
    },

    mixpanelTimeZone () {
      if (!this.mixpanel_timezone) {
        const timezone = this.integration &&
            this.integration.config &&
            this.integration.config.timezone

        if (timezone) {
          return timezone
        }

        return 'UTC'
      }

      return this.mixpanel_timezone
    },

    filteredTimezones () {
      return this.filterTimeZones(this.mixpanel_timezone_filter_query, this.timezones)
    }
  },

  beforeMount () {
    if (this.isSegment || this.isMixpanel) {
      this.activeTab = 'configuration'
    }

    if (this.isSegment) {
      this.fetchEventAPI()
        .then(res => {
          this.events_api_key = res.data.key
        })
      this.fetchSegmentEndpoint()
        .then(res => {
          this.segment_endpoint = res.data
        })
    }

    this.callFetchIntegration()
  },

  methods: {
    ...mapActions('settings', ['fetchIntegration', 'deleteIntegration', 'updateConfig', 'triggerSync', 'fetchEventAPI', 'fetchSegmentEndpoint']),

    toggleDeleteModal () {
      this.deleteModalVisible = !this.deleteModalVisible
    },

    authorize () {
      window.location.href = `/auths/${this.external_service_name}`
    },

    callFetchIntegration () {
      this.fetchIntegration(this.external_service_name)
        .then(res => {
          this.integration = res.data
          this.subdomain = res.data.config['url']
          this.enabled = true
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          return Promise.reject(err)
        })
    },

    callDeleteIntegration () {
      this.deleteIntegration(this.external_service_name)
        .then(() => { window.location.href = '/settings' })
        .catch(() => MisoMessage.info('Oops! Could not remove integration!'))
    },

    callUpdateConfig (config) {
      this.updateConfig({config: config, externalServiceName: this.external_service_name})
        .then(res => {
          this.integration = res.data
          MisoMessage.success('Successfully updated configuration')
        })
        .catch(() => MisoMessage.info('Failed to update configuration'))
    },

    updateZendeskConfig () {
      this.callUpdateConfig({ 'url': `${this.subdomain}` })
    },

    updateMixpanelConfig () {
      this.callUpdateConfig({
        'api_secret': `${this.mixpanelApiSecret}`,
        'timezone': `${this.mixpanelTimeZone}`
      })
    },

    updateSegmentConfig () {
      this.callUpdateConfig({})
    },

    callTriggerSync () {
      this.triggerSync(this.external_service_name)
        .then(() => MisoMessage.success('Sync triggered'))
        .catch(() => MisoMessage.info('Failed to sync'))
    },

    setMixpanelApiSecret (value) {
      this.mixpanel_api_secret = value
    },

    setMixpanelTimezone (value) {
      this.mixpanel_timezone = value
    },

    setMixpanelTimezoneFilterQuery (query) {
      this.mixpanel_timezone_filter_query = query
    },

    filterTimeZones (query, timezones) {
      if (query === '') {
        return _.take(timezones, 10)
      }

      const filtered = timezones.filter(timezone =>
        timezone.toLowerCase().indexOf(query && query.toLowerCase()) > -1
      )

      if (filtered.length > 10) {
        return _.take(filtered, 10)
      }

      return filtered
    }
  }
}
</script>
