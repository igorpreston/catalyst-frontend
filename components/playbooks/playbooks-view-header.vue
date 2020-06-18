<template>
  <header class="pv3 ph24 flex items-center justify-between ba b--light-gray bg-white ph24 playbooks__header">
    <div class="flex flex-column f6">
      <p class="ma0 mb2">
        <strong>{{ name }}</strong>
        by
        {{ user }}
      </p>

      <p class="ma0 gray">
        Created on
        {{ formattedCreatedAt }}
      </p>
    </div>

    <div class="flex items-center ml-auto">
      <div class="flex items-center justify-end pr3 f6">
        <span
          class="switch"
          :class="status ? 'active' : 'unactive'">
          Paused
        </span>

        <el-switch
          :width="40"
          active-color="#3DBA88"
          inactive-color="#E74C3B"
          :value="status"
          @input="val => updateStatus(val, id)"/>

        <span
          class="switch"
          :class="status ? 'unactive' : 'active'">
          Active
        </span>
      </div>

      <div class="ph3 bl br b--light-gray">
        <miso-button
          type="outline"
          @click="onShowEditForm">
          Edit
        </miso-button>
      </div>

      <div class="pl3">
        <miso-button
          type="transparent"
          size="tiny"
          class="pa1"
          @click="onClosePlaybook">
          <feather-icon
            name="x"
            height="20"
            width="20"
            color="gray"/>
        </miso-button>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment-timezone'

import {
  MisoButton,
  MisoMessage,
  FeatherIcon
} from 'miso'

import { Switch } from 'element-ui'

export default {
  name: 'PlaybooksViewHeader',

  components: {
    MisoButton,
    MisoMessage,
    FeatherIcon,
    'el-switch': Switch
  },

  props: {
    name: {
      type: String,
      default: null
    },
    user: {
      type: String,
      default: null
    },
    createdAt: {
      type: String,
      default: null
    },
    status: {
      type: Boolean,
      default: false
    },
    onClosePlaybook: {
      type: Function,
      default () {}
    },
    onShowEditForm: {
      type: Function,
      default () {}
    },
    id: {
      type: String,
      default: null
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    }),
    formattedCreatedAt () {
      const time = moment.tz(this.createdAt, (this.currentUser && this.currentUser.time_zone) || 'UTC')
      return time.format('MM/DD/YYYY') + ' at ' + time.format('hh:mm a')
    }
  },

    methods: {
      ...mapActions(['updatePlaybookStatus']),

      updateStatus (status, id) {
        this.updatePlaybookStatus({ id, status })
            .then(() => MisoMessage.success('Successfully updated playbook'))
            .catch(() => MisoMessage.error('Failed to update playbook'))
      }
    }
  }
</script>

<style lang="scss">
  .el-switch {
    margin: 0 10px;
  }

  .switch {
    &.active {
      color: #9C9CA6;
    }

    &.unactive {
      color: #404046;
    }
  }
</style>

<style lang="scss" scoped>
  .gray {
    color: #7E7F89;
  }
</style>
