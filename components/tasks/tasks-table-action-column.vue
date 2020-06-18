<template>
  <div>
    <div class="flex flex-auto items-center mt1 mid-gray">
      <span
        :class="getColorWithStatus(isCompleted)['icon_bg_color']"
        class="flex mv0 ph2 pv1 br4 ba">
        <feather-icon
          :stroke-width="2.5"
          :name="iconType"
          :color="getColorWithStatus(isCompleted)['icon_color']"
          width="10"
          height="10"/>
        <feather-icon
          v-if="ifPlaybook"
          :stroke-width="2.5"
          :color="getColorWithStatus(isCompleted)['icon_color']"
          width="10"
          height="10"
          name="book-open"
          class="ml2"/>
      </span>
      <span class="mh2 light-gray">|</span>
      <span
        :class="getColorWithStatus(isCompleted)['text_color']"
        class="ma0 truncate two-lines">
        <span>{{ taskType }} </span>
        <span v-if="taskType === 'To-Do'">for </span>
        <span
          v-if="contactName"
          class="fw5">{{ contactName }}</span>
        <span v-if="contactName">@ </span>
        <span class="fw5">{{ accountName }} </span>
      </span>
    </div>

    <div
      :class="getColorWithStatus(isCompleted)['desp_color']"
      class="flex flex-auto items-center mt1">
      <p class="ma0 truncate"><span
        v-if="ifPlaybook"
        class="fw5">Step {{ step.number }}: </span>
        {{ description }}</p>
    </div>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui'

import {
  MisoTableColumn,
  FeatherIcon
} from 'miso'

import { mapGetters } from 'vuex'

export default {
  name: 'TasksTableActionColumn',

  components: {
    'el-tooltip': Tooltip,
    MisoTableColumn,
    FeatherIcon
  },

  props: {
    accountName: {
      type: String,
      default: null
    },
    contactName: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    currentUserId: {
      type: String,
      default: null
    },
    playbook: {
      type: Boolean,
      default: false
    },
    step: {
      type: Object,
      default: null
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      ifPlaybook: this.playbook
    }
  },

  computed: {
    ...mapGetters([
      'getColorWithStatus'
    ]),

    taskType () {
      switch (this.type) {
        case 'call':
          return 'Call'
        case 'email':
          return 'Email'
        default:
          return 'To-Do'
      }
    },

    tooltipText () {
      return `This task is ${this.taskType === 'Email' ? 'an' : 'a'} ${this.taskType} within a playbook`
    },

    iconType () {
      switch (this.type) {
        case 'Call':
          return 'file'
        case 'Email':
          return 'mail'
        default:
          return 'check'
      }
    }
  }
}
</script>
