<template>
  <header class="pa3 pl4 bg-white bb b--purple-gray shadow-1">

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="br b--light-gray flex items-center pv2 pr3 mr3">
          <back-link
            text="Segments"
            destination="/segments"
            class="segments__back"/>
        </div>

        <miso-heading
          level="3"
          class="mv0 dark-gray fw5 f4">
          {{ segmentName }}
        </miso-heading>
      </div>

      <div class="flex items-center justify-around">

        <div
          v-if="isJustworks"
          class="br b--light-gray">
          <miso-button
            type="transparent"
            class="dark-gray mr2"
            @click="onShowSidePanel('CreateEmailForm')">
            <div class="flex items-center">
              <feather-icon
                class="mr2"
                name="mail"
                color="purple"/>
              Send Email
            </div>
          </miso-button>
        </div>

        <div class="br b--light-gray">
          <miso-button
            type="transparent"
            class="dark-gray ml2 mr2"
            @click="onShowSidePanel('CreateTaskForm')">
            <div class="flex items-center">
              <feather-icon
                class="mr2"
                name="check"
                color="purple"/>
              Create Task
            </div>
          </miso-button>
        </div>

        <div class="b--light-gray">
          <miso-button
            type="transparent"
            class="dark-gray ml2 mr2"
            @click="onShowSidePanel('CreateNoteForm')">
            <span class="flex items-center">
              <feather-icon
                class="mr2"
                name="edit-2"
                color="purple"/>
              Take Note
            </span>
          </miso-button>
        </div>

      </div>

    </div>

  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  BackLink,
  MisoHeading,
  MisoButton,
  FeatherIcon
} from 'miso'

export default {
  name: 'SegmentsDetailHeader',

  components: {
    BackLink,
    MisoHeading,
    MisoButton,
    FeatherIcon
  },

  props: {
    onShowSidePanel: {
      type: Function,
      default () {}
    },

    segmentName: {
      type: String,
      default: ''
    }
  },

  computed: {
    ...mapGetters([
      'isJustworks'
    ])
  }
}
</script>

<style lang="scss">
  .segments__back {
    margin-bottom: 0;
    font-weight: 300;
    color: var(--dark-gray);
  }
</style>
