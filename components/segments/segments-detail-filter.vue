<template>
  <div class="bg-white bb b--purple-gray">
    <div class="flex">
      <div
        class="ph3 pv3 flex-auto"
        id="search">
        <miso-label>Showing {{ queryType }} Where</miso-label>

        <real-lang-row
          v-for="(row, rowIndex) in rows"
          class="mb1"
          :rowIndex="rowIndex"
          :key="rowIndex">
        </real-lang-row>
      </div>
      <div class="ph3 pv3 bl b--purple-gray flex">
        <div class="flex items-center justify-center">
          <div class="flex items-center justify-center">
            <miso-checkbox
              v-model="isSegmentContinuous"
              :checked="isNewSegment"
              @change="notifyDataChange">
              Continuous
            </miso-checkbox>

            <feather-icon
              class="ml2"
              color="purple"
              name="info"
              height="16"
              width="16"
              v-tooltip="tooltipContent">
            </feather-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    MisoLabel,
    MisoCheckbox,
    FeatherIcon
  } from 'miso'

  import RealLangRow from '#/components/RealLangRow'

  export default {
    name: 'segments-detail-real-lang',

    props: {
      queryType: String,
      rows: Array,
      isNewSegment: Boolean,
      notifyDataChange: Function,
      segmentContinuous: Boolean
    },

    components: {
      MisoLabel,
      MisoCheckbox,
      FeatherIcon,

      RealLangRow
    },

    data () {
      return {
        tooltipContent: 'By unchecking this, the result set of your current query at this time will remain the same even as data changes occur.',
        isSegmentContinuous: this.segmentContinuous
      }
    },

    watch: {
      isSegmentContinuous () {
        this.$emit('continuous-changed', this.isSegmentContinuous)
      }
    }
  }
</script>
