<template>
  <div class="flex flex-auto justify-between items-center mb3">
    <div class="flex flex-auto items-center">
      <miso-button
        type="transparent"
        class="metric__choose"
        :disabled="isFirstMetric"
        @click="iterateMetrics('backward')">
        <feather-icon
          color="color-inherit"
          widht="20"
          height="20"
          name="arrow-left">
        </feather-icon>
      </miso-button>

      <miso-button
        type="transparent"
        class="mr2 metric__choose"
        :disabled="isLastMetric"
        @click="iterateMetrics('forward')">
        <feather-icon
          color="color-inherit"
          widht="20"
          height="20"
          name="arrow-right">
        </feather-icon>
      </miso-button>

      <miso-heading
        level="4"
        class="mv0 fw5">
        {{ currentMetric.name }}
      </miso-heading>
    </div>

    <miso-popover
      ref="customizePopover"
      placement="bottom-end"
      trigger="click"
      width="336">
      <div class="flex flex-auto flex-column pa3 metric__customize">
        <miso-label>Formula</miso-label>

        <miso-select
          v-model="formula"
          placeholder="Select Formula"
          class="mb3 f6">
          <miso-option
            v-for="item in formulas"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </miso-option>
        </miso-select>

        <miso-label>Timeframe</miso-label>

        <miso-radio-group v-model="timeframe">
          <miso-radio-button :label="1">1 Day</miso-radio-button>

          <miso-radio-button :label="7">7 Days</miso-radio-button>

          <miso-radio-button :label="30">30 Days</miso-radio-button>

          <miso-radio-button :label="60">60 Days</miso-radio-button>

          <miso-radio-button :label="90">90 Days</miso-radio-button>

        </miso-radio-group>
      </div>
    </miso-popover>

    <miso-button-link
      type="outline"
      class="mr2"
      href="/settings">
      Create Metric
    </miso-button-link>

    <miso-button
      type="primary"
      v-popover:customizePopover>
      <div class="flex">
        Customize Metric
        <feather-icon
          width="16"
          height="16"
          color="white"
          name="chevron-down"
          class="ml1">
        </feather-icon>
      </div>
    </miso-button>
  </div>
</template>

<script>
  import {
    MisoHeading,
    MisoButton,
    MisoButtonLink,
    MisoPopover,
    MisoSelect,
    MisoOption,
    MisoRadioGroup,
    MisoRadioButton,
    MisoLabel,
    FeatherIcon
  } from 'miso'

  import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'

  export default {
    name: 'product-header',

    props: {
      toggleLoading: Function
    },

    components: {
      MisoHeading,
      MisoButton,
      MisoButtonLink,
      MisoPopover,
      MisoSelect,
      MisoOption,
      MisoRadioGroup,
      MisoRadioButton,
      MisoLabel,
      FeatherIcon
    },

    computed: {
      ...mapState({
        formulas: state => state.metrics.formulas,
        currentMetricIndex: state => state.metrics.currentMetricIndex
      }),

      ...mapGetters([
        'isFirstMetric', 'isLastMetric', 'currentMetric'
      ]),

      formula: {
        get() {
          return this.currentMetric.default_formula
        },

        set(value) {
          this.setMetricAttribute({ index: this.currentMetricIndex, key: 'default_formula', value })
          this.customizeCurrentMetric()
        }
      },

      timeframe: {
        get() {
          return this.currentMetric.days_count
        },

        set(value) {
          this.setMetricAttribute({ index: this.currentMetricIndex, key: 'days_count', value })
          this.customizeCurrentMetric()
        }
      }
    },

    methods: {
      ...mapActions(['fetchFormulas', 'customizeMetric']),
      ...mapMutations(['setMetricAttribute', 'setMetricIndex']),

      customizeCurrentMetric() {
        this.toggleLoading(this.currentMetric.id)

        this.customizeMetric(this.currentMetricIndex)
            .then(() => {
              this.toggleLoading('')
            })
      },

      iterateMetrics (direction) {
        this.setMetricIndex(direction === 'forward' ? this.currentMetricIndex + 1 : this.currentMetricIndex - 1)
      },
    },

    mounted() {
      this.fetchFormulas()
    }
  }
</script>

<style lang="scss">
  .metric {
    &__choose {
      padding: 0 .5rem;
    }

    &__customize {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      flex-direction: column;
      flex: 0 0 336px;

      & + .popper__arrow {
        display: none;
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
    }
  }
</style>
