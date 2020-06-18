<template>
  <div
    id="settings-index"
    class="bg-off-purple overflow-hidden flex flex-auto flex-column">
    <settings-header :on-show-side-panel="showSidePanel"/>
    <div class="flex flex-auto relative">
      <section class="flex flex-auto pa24 relative">
        <miso-tabs
          :value="activeTab"
          class="bg-white ba b--purple-gray flex flex-auto scroll-tab-content"
          @tab-click="onTabClick">
          <miso-tab-pane
            name="users"
            label="Users">
            <settings-tabs-users
              :on-show-side-panel="showSidePanel"
              :on-hide-side-panel="hideSidePanel"/>
          </miso-tab-pane>
          <miso-tab-pane
            name="integrations"
            label="Integrations"
            class="settings-integrations-list">
            <div
              v-for="( integration, index ) in integrations"
              :key="index"
              class="bb b--purple-gray b-last-n settings-add-integration-row">
              <div
                v-loading="getWrapper(integration, 'busy.sync', false)"
                v-if="shouldShowIntegration(integration.name) || isJustworks"
                :element-loading-text="getWrapper(integration, 'busy.sync_message', '')"
                class="flex items-center justify-between">
                <!-- Header -->
                <div class="flex items-center">
                  <div class="pl3">
                    <img
                      :src="assetsHost + integration.logo_url"
                      class="h2 w2">
                  </div>
                  <div class="pa3">
                    <miso-heading
                      level="4"
                      class="mt0 mb1 dark-gray-accent">
                      {{ integration.name }}
                    </miso-heading>
                    <miso-heading
                      level="5"
                      class="mv0 normal purple">
                      {{ integration.description }}
                    </miso-heading>
                  </div>
                </div>

                <!-- CTA -->
                <div class="pa3 flex items-center">
                  <div
                    v-if="integration.enabled"
                    class="mr3 flex items-center f6">
                    <feather-icon
                      name="check-circle"
                      color="green"
                      class="mr1"/>
                  </div>
                  <miso-button-link
                    :href="'/settings/integrations/' + lower(integration.name)"
                    type="outline">
                    <div
                      v-if="!integration.enabled"
                      class="flex items-center">
                      <feather-icon
                        color="purple"
                        class="mr1 settings-add-integration-button"
                        name="plus"/>
                      Add Integration
                    </div>
                    <div
                      v-else
                      class="flex items-center">
                      Configure
                    </div>
                  </miso-button-link>
                </div>
              </div>
            </div>
          </miso-tab-pane>
          <miso-tab-pane
            name="success-metrics"
            label="Success Metrics">
            <settings-tabs-success-metrics
              :on-show-side-panel="showSidePanel"
              :on-hide-side-panel="hideSidePanel"
              :show-edit-form="showEditForm"/>
          </miso-tab-pane>
          <miso-tab-pane
            name="data-mappings"
            label="Data Mappings">
            <settings-mappings />
          </miso-tab-pane>
          <!-- TO-DO: Uncomment post-beta <miso-tab-pane
            name="events"
            label="Events">
            <settings-events />
          </miso-tab-pane> -->
        </miso-tabs>
      </section>

      <div
        v-if="isExpandedAside"
        class="side-panel-bg"/>

      <miso-side-panel
        :visible="isSidePanelVisible"
        :width="panelWidth"
        :style="panelWidthCss"
        :class="isExpanded"
        class="side-panel">
        <component
          :on-hide-side-panel="hideSidePanel"
          :on-show-side-panel="showSidePanel"
          :on-toggle-panel="togglePanel"
          :expanded="isExpandedAside"
          :is-edit="isEdit"
          :is="sidePanelView"
          :key="sidePanelView"/>
      </miso-side-panel>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import {
  FeatherIcon,
  MisoButton,
  MisoButtonLink,
  MisoEmpty,
  MisoHeading,
  MisoInput,
  MisoSidePanel,
  MisoTabPane,
  MisoTabs
} from 'miso'
import _ from 'lodash'
import axios from 'axios'
import CreateEmailForm from '#/components/emails/create-email-form'
import CreateNoteForm from '#/components/notes/create-note-form'
import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'
import CreateSuccessMetricsForm from '#/components/settings/create-success-metrics-form.vue'
import CreateTaskForm from '#/components/tasks/create-task-form'
import EditNoteForm from '#/components/notes/edit-note-form'
import EditTaskForm from '#/components/tasks/edit-task-form'
import SettingsEvents from '#/components/settings/Events.vue'
import SettingsHeader from '#/components/settings/settings-header.vue'
import SettingsMappings from '#/components/settings/Mappings.vue'
import SettingsTabsSuccessMetrics from '#/components/settings/settings-tabs-success-metrics.vue'
import SettingsTabsUsers from '#/components/settings/settings-tabs-users'
import TasksRescheduleForm from '#/components/tasks/tasks-reschedule-form'
import UserForm from '#/components/users/user-form'

export default {
  name: 'SettingsIndex',

  components: {
    CreateEmailForm,
    CreateNoteForm,
    CreateNoteTaskForm,
    CreateSuccessMetricsForm,
    CreateTaskForm,
    EditNoteForm,
    EditTaskForm,
    FeatherIcon,
    MisoButton,
    MisoButtonLink,
    MisoEmpty,
    MisoHeading,
    MisoInput,
    MisoSidePanel,
    MisoTabPane,
    MisoTabs,
    SettingsEvents,
    SettingsHeader,
    SettingsMappings,
    SettingsTabsSuccessMetrics,
    SettingsTabsUsers,
    TasksRescheduleForm,
    UserForm
  },

  data: () => ({
    integrations: [],
    isSidePanelVisible: false,
    sidePanelView: null,
    isExpandedAside: false,
    panelWidth: 341,
    isEdit: false
  }),

  computed: {
    ...mapGetters('settings', ['activeTab']),

    ...mapGetters(['isJustworks', 'assetsHost']),

    isExpanded () {
      if (this.isExpandedAside) {
        return 'is-expanded'
      }
    },

    panelWidthCss () {
      return {
        width: this.panelWidth + 'px'
      }
    }
  },

  beforeMount () {
    this.getExternalServices()
    this.fetchUsers()
  },

  methods: {
    ...mapMutations(['resetUserFormData']),

    ...mapActions(['fetchUsers', 'updateUserForm', 'changeTab']),

    shouldShowIntegration (name) {
      const blackList = [
        'Zendesk',
        'Redshift',
        'Intercom',
        'Google Analytics',
        'Drift',
        'Stripe',
        'Delighted',
        'Service Cloud'
      ]
      return !blackList.includes(name)
    },

    onTabClick (tab) {
      this.changeTab(tab.name)
    },

    getExternalServices () {
      axios.get('/integrations')
        .then((r) => {
          this.integrations = r.data
        })
    },

    getWrapper (object, field, def) {
      return _.get(object, field, def)
    },

    lower: (s) => _.lowerCase(s),

    showSidePanel (view, isEdit) {
      if (isEdit) {
        this.updateUserForm()
        this.isEdit = true
      } else {
        this.resetUserFormData()
        this.isEdit = false
      }
      this.isSidePanelVisible = true
      this.sidePanelView = view
      this.isExpandedAside = false
      this.panelWidth = 341
    },

    hideSidePanel () {
      this.resetUserFormData()
      this.isSidePanelVisible = false
      this.sidePanelView = null
      this.isExpandedAside = false
      this.panelWidth = 0
      this.isEdit = false
    },

    togglePanel () {
      this.isExpandedAside = !this.isExpandedAside
      switch (this.panelWidth) {
        case 341:
          this.panelWidth = 730
          break
        case 730:
          this.panelWidth = 341
          break
        default:
      }
    },

    showEditForm () {
      this.showSidePanel('CreateSuccessMetricsForm', true)
    }
  }
}
</script>

<style lang="scss">
  .side-panel {
    flex: 0 0 341px;

    &-bg {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.2);
      z-index: 2;
    }
  }

  .is-expanded {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    flex: 0 0 730px;
    z-index: 2;
  }
</style>
