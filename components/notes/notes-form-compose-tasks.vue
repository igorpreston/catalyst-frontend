<template>
  <miso-popover
    ref="tasks"
    width="250">
    <div class="bg-off-white bb b--light-gray-accent mid-gray-accent pa2 flex items-center justify-between">
      <span class="f6">Insert tasks</span>
      <miso-button
        type="transparent"
        size="small"
        @click="onClose">
        <feather-icon
          name="x"
          height="16"
          width="16"
          color="mid-gray"/>
      </miso-button>
    </div>
  </miso-popover>
</template>

<script>
import {
  MisoPopover,
  MisoButton,
  FeatherIcon
} from 'miso'

export default {
  name: 'NotesFormComposeTasks',

  components: {
    MisoPopover,
    MisoButton,
    FeatherIcon
  },

  props: ['onClose']
}
</script>
