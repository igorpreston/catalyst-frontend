<template>
  <div class="pa3 pt0 bg-white mb3 overflow-y-auto h-100 flex flex-column justify-between metrics-form">
    <div class="flex items-center justify-between bb b--light-gray fixed z-1 metrics-form__heading">
      <miso-heading
        level="4"
        class="mv0 dark-gray">
        {{ isEditMode ? 'Edit Success Metric' : 'New Success Metric' }}
      </miso-heading>

      <div class="flex items-center justify-around">
        <div class="pl2">
          <miso-button
            type="transparent"
            size="small"
            @click="onHideSidePanel">
            <feather-icon
              name="x"
              color="mid-gray"
              height="18"
              width="18"/>
          </miso-button>
        </div>
      </div>
    </div>

    <div
      ref="form"
      class="flex flex-auto flex-column overflow-y-auto metrics-form__form">
      <miso-form
        label-position="top"
        @submit.prevent>
        <miso-form-item class="w-100 mb2">
          <miso-label>Name</miso-label>

          <miso-input
            v-model="name"
            variant="white"
            placeholder="Awesome New Feature"
            class="w-100 mb1"/>

          <p
            ref="innerFormElement"
            class="ma0 f7 subtext">
            Name this generic as possible since we are calculating the following 4 formulas for you.
          </p>
        </miso-form-item>

        <miso-form-item class="w-100 mb2">
          <miso-label>Event</miso-label>

          <miso-select
            v-model="eventType"
            variant="white"
            placeholder="Accounts Created"
            class="w-100 mb2 white-select">
            <miso-option
              v-for="eventType in eventsList"
              :key="eventType"
              :label="eventType"
              :value="eventType"/>
          </miso-select>
        </miso-form-item>

        <miso-form-item class="w-100">
          <miso-label>Default Formula</miso-label>

          <miso-select
            v-model="selectedFormula"
            variant="white"
            placeholder="Select Default Formula"
            class="w-100 mb2 white-select">
            <miso-option
              v-for="formula in formulasList"
              :key="formula.name"
              :label="formula.name"
              :value="formula.value"/>
          </miso-select>
        </miso-form-item>

        <div
          v-if="selectedFormula"
          class="flex flex-auto flex-column nt2 mb2 pa2 ba b--light-gray bg-off-purple f6 lh-copy metrics-form__formula-description">
          <div>
            <p class="mt0 mb4">
              {{ selectedDescription.description }}
            </p>

            <p class="mb0 nt1 fw5">
              Examples:
            </p>

            <ul class="ma0">
              <li
                v-for="example in selectedDescription.examples"
                :key="example">
                {{ example }}
              </li>
            </ul>
          </div>
        </div>

        <miso-form-item class="w-100 mb2">
          <miso-label>Default Timeframe</miso-label>

          <miso-radio-group
            v-model="timeframe"
            :class="{ 'on-scroll' : ifScrolled }">
            <miso-radio-button :label="1">1 Day</miso-radio-button>

            <miso-radio-button :label="7">7 Days</miso-radio-button>

            <miso-radio-button :label="30">30 Days</miso-radio-button>

            <miso-radio-button :label="60">60 Days</miso-radio-button>

            <miso-radio-button :label="90">90 Days</miso-radio-button>
          </miso-radio-group>
        </miso-form-item>

      </miso-form>
    </div>

    <div class="flex items-center justify-end fixed bottom-0 pb3 bt b--light-gray metrics-form__footer">
      <miso-button
        type="primary"
        class="f6 order-last"
        @click.prevent="saveMetric">
        Save
      </miso-button>
    </div>
  </div>
</template>

<script>
import {
  MisoHeading,
  MisoButton,
  FeatherIcon,
  MisoForm,
  MisoFormItem,
  MisoInput,
  MisoMessage,
  MisoLabel,
  MisoSelect,
  MisoOption,
  MisoRadioGroup,
  MisoRadioButton
} from 'miso'

import axios from 'axios'
import _ from 'lodash'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CreateSuccessMetricsForm',

  components: {
    MisoHeading,
    MisoButton,
    FeatherIcon,
    MisoForm,
    MisoFormItem,
    MisoInput,
    MisoMessage,
    MisoLabel,
    MisoSelect,
    MisoOption,
    MisoRadioGroup,
    MisoRadioButton
  },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    onHideSidePanel: {
      type: Function,
      default () {}
    }
  },

  data () {
    return {
      id: '',
      name: '',
      eventType: '',
      selectedFormula: '',
      ifScrolled: false,
      timeframe: 30,
      eventsList: [],
      formulasList: [
        {
          name: 'Total # of events',
          value: 'total_number_of_events'
        },
        {
          name: 'Percentage of users performing events',
          value: 'percentage_of_users_performing_events'
        },
        {
          name: 'Ratio of events per user',
          value: 'ratio_of_events_per_user'
        },
        {
          name: 'Total # of users performing event',
          value: 'total_number_of_users_performing_events'
        }
      ],
      formulasDescriptions: [
        {
          value: 'total_number_of_events',
          description: '‘Total # of events‘ tracks less frequent but high-value events performed by any user within a customer.',
          examples: [
            'Total ‘Tasks Completed’ events',
            'For Catalyst, it would be 542 Scorecards Created'
          ]
        },

        {
          value: 'percentage_of_users_performing_events',
          description: '‘Percentage of Users Performing Events‘ ensures that a certain percentage of customer’s user base is performing certain event(s)',
          examples: [
            'Percentage of active users performing the ‘Tasks Completed’ event',
            'For Catalyst, it would be 50% of Users, 50 out of 100, are performing Tasks Completed Event'
          ]
        },

        {
          value: 'ratio_of_events_per_user',
          description: '‘Ratio of Events Per User‘ tracks high-volume events that should scale with a customer’s user base.',
          examples: [
            '‘Tasks Completed’ per active user',
            'For Catalyst, it would be 72 Tasks Completed Per User'
          ]
        },

        {
          value: 'total_number_of_users_performing_events',
          description: '‘Total # of Users Performing Events‘ ensures that a specific number of customer’s users perform certain event(s).',
          examples: [
            'Number of users that perform the ‘Tasks Completed’ Event',
            'For Catalyst, it would be 20 Users Performing Tasks Completed Feature'
          ]
        }
      ]
    }
  },

  computed: {
    ...mapGetters(['editedMetric', 'selectedMetricsNum']),

    selectedDescription () {
      return _.find(this.formulasDescriptions, (d) => d.value === this.selectedFormula)
    },

    isEditMode () {
      return this.isEdit
    }
  },

  watch: {
    selectedFormula () {
      this.ifScrolled = window.innerHeight <= 787
    },

    editedMetric () {
      if ((this.editedMetric.name === '' || this.selectedMetricsNum === 0 || this.selectedMetricsNum > 1) && this.isEditMode) {
        this.onHideSidePanel()
      }
      if (this.isEditMode) {
        this.setFormData()
      }
    },

    isEditMode () {
      if (!this.isEditMode) {
        this.id = ''
        this.name = ''
        this.eventType = ''
        this.selectedFormula = ''
        this.timeframe = 30
      } else {
        this.setFormData()
      }
    }
  },

  mounted () {
    this.fetchEventTypes()
    this.fetchMetricFormulas()
    if (this.isEditMode) {
      this.setFormData()
    }
    window.addEventListener('resize', this.handleResize)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    ...mapActions(['fetchMetrics']),

    fetchMetricFormulas () {
      axios.get('/metrics/formulas')
        .then(res => { this.selectedFormulasList = res.data })
        .catch(err => console.error(err))
    },

    fetchEventTypes () {
      axios.get('/metrics/event_types')
        .then(res => {
          if (!_.isEmpty(res.data)) {
            this.eventsList = res.data
          }
        })
        .catch(err => console.error(err))
    },

    saveMetric () {
      const metric = {
        name: this.name,
        event_type: this.eventType,
        default_formula: this.selectedFormula,
        days_count: this.timeframe
      }

      if (this.isEditMode) {
        axios.patch(`/metrics/${this.id}`, metric)
          .then(res => {
            MisoMessage.success('Successfully updated a success metric')
            this.fetchMetrics()
            this.onHideSidePanel()
          })
          .catch(err => {
            console.error(err)
            MisoMessage.error('Failed to update a success metric')
          })
      } else {
        axios.post('/metrics', {
          name: this.name,
          event_type: this.eventType,
          default_formula: this.selectedFormula,
          days_count: this.timeframe
        })
          .then(res => {
            MisoMessage.success('Successfully created a success metric')
            this.fetchMetrics()
            this.onHideSidePanel()
          })
          .catch(err => {
            console.error(err)
            MisoMessage.error('Failed to create a success metric')
          })
      }
    },

    setFormData () {
      this.id = this.editedMetric.id
      this.name = this.editedMetric.name
      this.eventType = this.editedMetric.event_type
      this.selectedFormula = this.editedMetric.default_formula
      this.timeframe = this.editedMetric.days_count
    },

    handleResize () {
      this.$refs.form.offsetWidth !== this.$refs.innerFormElement.offsetWidth ? this.ifScrolled = true : this.ifScrolled = false
    }
  }
}
</script>

<style lang="scss">
  .metrics-form {
    &__footer,
    &__heading {
      width: 310px;
      background-color: #fff;
    }

    &__heading {
      padding: 30px 0 22px;
    }

    &__form {
      margin: 90px 0 68px;
    }

    &__footer {
      padding-top: 27px;
    }

    .el-radio-button {
      &__inner {
        padding: 9px 6px;
        border-left: 0;
        border-right: 0;
        border-color: #EAEAEC;
        font-weight: 300;
        color: #D4D4D8;
      }

      &.is-active .el-radio-button__inner {
        border-color: #EAEAEC;
        background-color: #fff;
        color: #404046;
        box-shadow: none;
        font-weight: 500;
      }

      &:first-child .el-radio-button__inner {
        padding-left: 13px;
        border-left: 1px solid #EAEAEC;
      }

      &:last-child .el-radio-button__inner {
        padding-right: 13px;
        border-right: 1px solid #EAEAEC;
      }
    }

    &__formula-description {
      padding: 13px;

      ul {
        padding-left: 18px;
      }
    }
  }

  .subtext {
    color: #9c9ca6;
    line-height: 17px;
  }

  .on-scroll {
    .el-radio-button__inner {
      padding: 9px 4.7px;
    }
  }
</style>
