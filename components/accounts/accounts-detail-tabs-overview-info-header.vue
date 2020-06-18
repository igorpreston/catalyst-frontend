<template>
  <header class="flex items-center justify-between mb3">

    <miso-heading
      level="3"
      class="mv0 dark-gray-accent">Account Info</miso-heading>

    <miso-button
      v-if="isEditing"
      type="primary"
      size="small"
      @click="onDisableEdit"
    >
      Save
    </miso-button>

    <miso-button
      v-else
      type="outline"
      size="small"
      @click="onEnableEdit"
    >
      Edit
    </miso-button>

  </header>
</template>

<script>
import {
  MisoHeading,
  MisoButton
} from 'miso'

export default {
  name: 'AccountsDetailTabsOverviewInfoHeader',

  components: {
    MisoHeading,
    MisoButton
  },

  props: {
    isEditing: {
      type: Boolean,
      default: false
    },
    onEnableEdit: {
      type: Function,
      default () {}
    },
    onDisableEdit: {
      type: Function,
      default () {}
    }
  }
}
</script>
