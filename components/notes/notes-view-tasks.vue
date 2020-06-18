<template>
  <div>
    <miso-checkbox
      v-for="task in tasks"
      :checked="task.completed_by_id"
      :key="task.id"
      disabled
      label="email greenhouse"
      class="flex items-center note-view__task">
      <div
        :style="{ cursor: !task.completed_by_id ? 'pointer' : '' }"
        @click="handleClick(task)">
        <!-- TODO: Add class pointer triggering <- not Styles-->
        <h2 class="ttu mid-gray note-view__heading">{{ generateTitle(task) }}</h2>
        <p class="task__description">{{ generateTitle(task) }} {{ task.description }}</p>
        <small class="task__estimate">Due on {{ formatDate(task.due ) }} — {{ task.priority_text }} Priority</small>
      </div>
    </miso-checkbox>
  </div>
</template>

<style lang="scss">
  .note-view__task {
    display: flex;
    margin-bottom: 16px;

    & + & {
      margin: 0 0 16px;
    }

    .el-checkbox__label {
      margin-left: 12px;
      padding-left: 12px;
      border-left: 1px solid #E5E2F9;
      white-space: normal;
    }

    .task {
      &__description {
        margin: 0 0 8px;
        font-weight: 300;
        color: #404046;
      }

      &__estimate {
        font-size: 12px;
        color: #9C9CA6;
      }
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
      border-color: #EAEAEC;
      background-color: #F4F4F4;
      &::after {
        border-color: #CACACF;
      }
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      opacity: .3;
      .task__description {
        text-decoration: line-through;
      }
    }
  }
</style>

<script>
import {
  MisoCheckboxGroup,
  MisoCheckbox
} from 'miso'

import moment from 'moment-timezone'
import { mapState } from 'vuex'

export default {
  name: 'NotesViewTask',

  components: {
    MisoCheckboxGroup,
    MisoCheckbox
  },

  props: {
    note: {
      type: Object,
      default: () => ({})
    },
    tasks: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },

  methods: {
    generateTitle (task) {
      return task.category_text + ' ' + (task.contact.id ? task.contact.full_name + ' at ' : '') + task.account.name
    },

    formatDate (date) {
      return moment.tz(date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YY')
    },

    handleClick (task) {
      if (!task.completed_by_id) {
        window.location.href = `/tasks/${task.id}`
      }
    }
  }
}
</script>

<style scoped>
  .el-checkbox__label.active {
    cursor: pointer !important;
  }
</style>
