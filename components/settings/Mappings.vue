<template>
  <div
    id="settings-mappings"
    class="settings-data-mappings">
    <div class="pa3">
      <div class="tr pb3 flex justify-end">
        <miso-dropdown trigger="click" @command="handleCommand" class="mr2">
          <miso-button type="primary">
            <div class="flex items-end settings-data-mappings-default-mapping-button">
              Default Mapping
              <feather-icon
                :stroke-width="3"
                class="ml2"
                color="white"
                name="chevron-down"
                height="16"
                width="16"/>
            </div>
          </miso-button>
          <miso-dropdown-menu>
            <miso-dropdown-item command="salesforce">Salesforce</miso-dropdown-item>
            <miso-dropdown-item
              v-if="isJustworks"
              command="zendesk">Zendesk</miso-dropdown-item>
          </miso-dropdown-menu>
        </miso-dropdown>
        <miso-button
          :loading="saveInProgress"
          type="primary"
          class="settings-save-data-mappings-button"
          @click="saveMappings">
          Save Mappings
        </miso-button>
      </div>
      <div v-if="hasMeta">
        <div
          v-for="( fields, internalObject ) in fieldMeta.internal"
          :key="internalObject"
          class="bb b--purple-gray b-last-n mb3">
          <header class="pb3 bb b--purple-gray">
            <miso-heading
              level="3"
              class="mv0">
              {{ titleize(internalObject) }}
            </miso-heading>
          </header>

          <div
            v-for="name in fields"
            :key="name"
            class="flex bb b--purple-gray b-last-n settings-mappings-row-field">
            <div class="w-50 flex items-center pv3">
              <miso-heading
                level="4"
                class="mv0">{{ humanize(name) }}</miso-heading>
            </div>
            <div class="w-50 flex items-center bl b--purple-gray pl3 pv1 settings-mappings-sf-row-field">
              <miso-cascader
                :value="cascaderSelectionFor(internalObject, name)"
                :options="cascaderValuesFor(internalObject)"
                class="w-100"
                placeholder="View integrations"
                filterable
                clearable
                @change="((val) => setMapping(internalObject, name, val))"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InnerContent from '#/components/InnerContent.vue'
import { humanizeString } from '../mixins/humanize-string'

import {
  MisoAlert,
  MisoCascader,
  MisoButton,
  MisoButtonLink,
  MisoEmpty,
  MisoHeading,
  MisoTabs,
  MisoTabPane,
  MisoTable,
  MisoInput,
  MisoMessage,
  MisoDropdown,
  MisoDropdownItem,
  MisoDropdownMenu,
  FeatherIcon
} from 'miso'

import axios from 'axios'
import _ from 'lodash'
import { mapGetters } from 'vuex'

import _inflector from 'lodash-inflection'
_.mixin(_inflector)

const DEFAULT_SALESFORCE =
  {
    'salesforce': {
      'account': {
        'Description': 'description',
        'Industry': 'industry',
        'Name': 'name',
        'NumberOfEmployees': 'size',
        'Phone': 'phone',
        'Type': 'account_type',
        'Website': 'website'
      },
      'contact': {
        'Email': 'email',
        'FirstName': 'first_name',
        'LastName': 'last_name',
        'Phone': 'phone',
        'Title': 'title'
      },
      'ticket': {}
    },
    'zendesk': {
      'account': {},
      'contact': {},
      'ticket': {},
      'user': {}
    }
  }

const DEFAULT_ZENDESK =
  {
    'salesforce': {
      'account': {},
      'contact': {},
      'ticket': {}
    },
    'zendesk': {
      'contact': {},
      'ticket': {
        'description': 'description',
        'priority': 'priority',
        'satisfaction_rating': 'satisfaction_rating',
        'status': 'status',
        'subject': 'subject',
        'tags': 'tags'
      },
      'user': {}
    }
  }

export default {
  name: 'SettingsMappings',

  components: {
    MisoAlert,
    MisoCascader,
    MisoButton,
    MisoButtonLink,
    MisoEmpty,
    MisoHeading,
    MisoInput,
    MisoTabs,
    MisoTabPane,
    MisoMessage,
    InnerContent,
    MisoTable,
    MisoDropdown,
    MisoDropdownItem,
    MisoDropdownMenu,
    FeatherIcon
  },

  mixins: [humanizeString],

  data: () => ({
    fieldMeta: {},
    mappings: {},
    saveInProgress: false
  }),

  computed: {
    ...mapGetters(['isJustworks']),

    hasMeta () {
      return !(_.isEmpty(this.fieldMeta) && _.isEmpty(this.fieldMeta.integrations))
    },

    modelToIntegration () {
      if (_.isEmpty(this.mappings)) return {}

      let inverted = {}

      _.toPairs(this.mappings).forEach((pair) => {
        let integration = pair[0]
        let models = pair[1]

        _.toPairs(models).forEach((modelPair) => {
          let model = modelPair[0]
          let mapping = modelPair[1]

          if (!_.has(inverted, model)) inverted[model] = {}
          if (!_.has(inverted[model], integration)) inverted[model][integration] = {}

          inverted[model][integration] = _.invert(mapping)
        })
      })

      return inverted
    }
  },

  beforeMount () {
    this.getFieldMeta().then(() => this.getMappings())
  },

  methods: {
    cascaderSelectionFor (internalObject, internalField) {
      const forModel = _.toPairs(this.modelToIntegration[internalObject])

      const foundMapping = _.find(forModel, (fieldMap) => {
        const map = fieldMap[1]

        return _.has(map, internalField)
      })

      if (_.isEmpty(foundMapping)) return
      return [foundMapping[0], foundMapping[1][internalField]]
    },

    cascaderValuesFor (prop) {
      let integrations = []

      for (let key in this.fieldMeta.integrations) {
        let integration = null
        let fields = null
        if (this.fieldMeta.integrations[key].hasOwnProperty(prop)) {
          integration = key
          fields = this.fieldMeta.integrations[key][prop].map(field => ({
            label: field.label,
            value: field.name
          }))

          integrations.push({
            label: this.titleize(integration),
            value: integration,
            children: _.sortBy(fields, 'label')
          })
        }
      }

      return integrations
    },

    getFieldMeta () {
      return axios.get('/settings/mappings/fields')
        .then((r) => {
          this.fieldMeta = r.data
        })
    },

    getMappings () {
      axios.get('/settings/mappings')
        .then((r) => {
          this.mappings = r.data
        })
    },

    titleize (str) { return _.titleize(str) },

    // Map from external to internal
    setMapping (internalModel, internalField, val) {
      if (_.isEmpty(val)) {
        let reverse = this.cascaderSelectionFor(internalModel, internalField)
        delete this.mappings[reverse[0]][internalModel][reverse[1]]
        // Do reverse lookup and nuke the correct one
      } else {
        let integration = val[0]
        let externalField = val[1]
        const entries = Object.entries(this.mappings[integration][internalModel])
        entries.forEach(entry => {
          const external = entry[0]

          if (this.mappings[integration][internalModel][external] === internalField) {
            delete this.mappings[integration][internalModel][external]
          }
        })
        this.mappings[integration][internalModel][externalField] = internalField
      }
    },

    saveMappings () {
      this.saveInProgress = true
      axios.post('/settings/mappings', this.mappings)
        .then((r) => { this.mappings = r.data })
        .then(() => MisoMessage.success('Mappings saved!'))
        .then(() => { this.saveInProgress = false })
        .then(() => this.getMappings())
    },

    setSalesforce () {
      this.mappings = Object.assign({}, this.mappings, DEFAULT_SALESFORCE)
    },

    setZendesk () {
      this.mappings = Object.assign({}, this.mappings, DEFAULT_ZENDESK)
    },

    handleCommand (command) {
      switch (command) {
        case 'salesforce':
          this.setSalesforce()
          break
        case 'zendesk':
          this.setZendesk()
          break
        default:
          break
      }
    }
  }
}
</script>
