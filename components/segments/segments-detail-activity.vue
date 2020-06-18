<template>
  <div class="pa3 pt0 bg-white mb3 h-100 flex flex-column emails-form">
    <div class="flex flex-0 items-center justify-between bb b--light-gray segments-activity__heading">
      <miso-heading
        level="4"
        class="mv0 dark-gray">
        Segment Timeline
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

    <div class="flex flex-auto flex-column overflow-y-auto">
      <segments-activity-list
        v-if="activities.length"
        :segment-name="getCurrentSegment.name"
        :activities="activities"/>

      <p
        v-else
        class="mv3 f6 mid-gray">
        Nothing yet to show!
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SegmentsActivityList from '#/components/segments/segments-activity-list'

import {
  FeatherIcon,
  MisoButton,
  MisoHeading
} from 'miso'

export default {
  name: 'SegmentDetailActivity',

  components: {
    FeatherIcon,
    MisoButton,
    MisoHeading,

    SegmentsActivityList
  },

  props: {
    onHideSidePanel: Function
  },

  computed: {
    ...mapState({
      activities: state => state.segments.activities
    }),

    ...mapGetters(['getCurrentSegment'])
  }
}
</script>

<style lang="scss">
  .segments-activity {
    &__heading {
      padding: 30px 0 22px;
    }
  }
</style>
