<template>
  <div class="pa3 pt0 bg-white mb3 overflow-y-auto h-100 flex flex-column justify-between metrics-form">
    <div class="flex items-center justify-between bb b--light-gray fixed z-1 segments-form__heading">
      <miso-heading
        level="4"
        class="mv0 dark-gray">
        {{ title }} Segment
      </miso-heading>

      <div class="flex items-center justify-around bl b--light-gray">
        <div class="pl2">
          <miso-button
            type="transparent"
            size="small"
            @click="hideSidePanel">
            <feather-icon
              name="x"
              color="mid-gray"
              height="18"
              width="18">
            </feather-icon>
          </miso-button>
        </div>
      </div>
    </div>

    <div class="flex flex-auto flex-column segments-form__form">
      <miso-form
        label-position="top"
        @submit.prevent>
        <miso-form-item class="w-100 mb2">
          <miso-label>Name</miso-label>

          <miso-input
            variant="white"
            placeholder="A great name"
            v-model="segmentName"
            data-cy="name"
            class="w-100 mb1">
          </miso-input>
        </miso-form-item>
      </miso-form>
    </div>

    <div class="flex items-center justify-end fixed bottom-0 pb3 bt b--light-gray segments-form__footer">
      <miso-button
        type="primary"
        class="f6 order-last"
        @click.prevent="onChange">
        {{ buttonTitle }}
      </miso-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

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

export default {
  name: 'SegmentsNameForm',
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
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    setMode: {
      type: Function,
      default () {}
    }
  },

  data () {
    return {
      name: ''
    }
  },

  computed: {
    ...mapState({
      mode: state => state.segments.mode
    }),

    ...mapGetters(['segmentFormData']),

    segmentName: {
      get () {
        return this.mode === 'pre-create' ? '' : this.segmentFormData.name
      },

      set (value) {
        this.updateSegmentFormData({ key: 'name', value })
      }
    },

    title () {
      switch (this.mode) {
        case 'pre-create':
          return 'New'
        case 'edit':
          return 'Edit'
        case 'rename':
          return 'Rename'
        default:
          return ''
      }
    },

    buttonTitle () {
      switch (this.mode) {
        case 'pre-create':
          return 'Create'
        default:
          return 'Rename'
      }
    }
  },

  methods: {
    ...mapActions(['updateSegment', 'updateSegmentFormData']),

    hideSidePanel () {
      this.onHideSidePanel()
      if (this.mode === 'pre-create') {
        this.updateSegmentFormData({ key: 'type', value: '' })
        this.updateSegmentFormData({ key: 'name', value: ''})
      }
    },

    onChange () {
      this.onHideSidePanel()

      if (this.mode === 'view') {
        this.updateSegment()
      } else if (this.mode === 'pre-create') {
        this.setMode('create')
      }
    }
  }
}
</script>

<style lang="scss">
  .segments-form {
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
  }
</style>
