<template>
  <header class="pt3 pb3 flex items-center justify-between">

    <div class="flex items-center">

      <div class="br b--light-gray">
        <miso-button
          v-if="!isFilterVisible"
          class="mr3 dark-gray"
          type="outline"
          @click="onToggleFilterVisible">
          Filter items
        </miso-button>
      </div>

      <p
        v-if="anyTasksSelected"
        :class="{ 'ml3' : !isFilterVisible }"
        class="mv2 f6">
        {{ selectedTasksNum }} tasks selected
      </p>

      <p
        v-else
        :class="{ 'ml3' : !isFilterVisible }"
        class="mv2 f6 pr2">
        {{ headerText }}
      </p>

      <miso-tag
        v-for="status in filterLabels['status']"
        :closable="true"
        :key="status"
        class="ml1"
        type="gray"
        @close="resetFilter('status', status)">
        {{ status }}
      </miso-tag>

      <miso-tag
        v-for="type in filterLabels['type']"
        :closable="true"
        :key="type"
        class="ml1"
        type="gray"
        @close="resetFilter('type', type)">
        {{ type }}
      </miso-tag>

      <miso-tag
        v-if="filterLabels && filterLabels['owner']"
        :closable="true"
        class="ml1"
        type="gray"
        @close="resetFilter('owner', filterLabels['owner'])">
        {{ filterLabels['owner'] }}
      </miso-tag>

      <miso-tag
        v-if="filterLabels && filterLabels['due']"
        :closable="true"
        class="ml1"
        type="gray"
        @close="resetFilter('due', filterLabels['due'])">
        {{ filterLabels['due'] }}
      </miso-tag>
    </div>

    <div class="flex items-center">
      <div
        v-if="anyTasksSelected"
        class="br b--light-gray pr3 flex items-center mr3 self-end">
        <miso-button
          v-if="singleTaskSelected"
          class="mr2"
          type="outline"
          size="medium"
          @click="onShowSidePanel('EditTaskForm')">
          Edit
        </miso-button>

        <miso-button
          class="mr2"
          type="outline"
          size="medium"
          @click="onShowSidePanel('TasksRescheduleForm')">
          Change Due Date
        </miso-button>

        <miso-button
          type="outline"
          size="medium"
          @click="onShowDeleteModal">
          Delete
        </miso-button>
      </div>

      <miso-button
        v-if="!reviewMode && (selectedTasksNum > 0)"
        type="primary"
        class="dark-gray"
        @click="reviewTasks({taskIds: selectedTaskIds})">
        Review
      </miso-button>
    </div>
  </header>
</template>

<style lang="scss">
  .el-tag--gray {
    border: 1px solid #CACACF;
    border-radius: 0;
    background-color: transparent;
    color: #7E7F89;
    .el-icon-close {
      border-radius: 0;
      color: #6B6B76;
    }
  }
</style>

<script>
import moment from 'moment-timezone'
import _ from 'lodash'
import { mapState, mapGetters, mapActions } from 'vuex'
import {
  FeatherIcon,
  MisoBadge,
  MisoButton,
  MisoButtonLink,
  MisoMessage,
  MisoTag
} from 'miso'

export default {
  name: 'TasksTableHeader',

  components: {
    FeatherIcon,
    MisoBadge,
    MisoButton,
    MisoButtonLink,
    MisoMessage,
    MisoTag
  },

  props: {
    isFilterVisible: {
      type: Boolean,
      default: false
    },
    onToggleFilterVisible: {
      type: Function,
      default () {}
    },
    onShowSidePanel: {
      type: Function,
      default () {}
    },
    onShowDeleteModal: {
      type: Function,
      default () {}
    },
    reviewMode: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters([
      'selectedTasksNum',
      'anyTasksSelected',
      'selectedTaskIds',
      'tasksFilters',
      'singleTaskSelected'
    ]),
    ...mapState({
      filters: state => state.tasks.filters,
      users: state => state.users,
      page: state => state.tasks.page,
      pageSize: state => state.tasks.pageSize,
      total: state => state.tasks.total
    }),

    headerText () {
      if (this.total === 0) {
        return `Showing 0 tasks`
      } else {
        return `Showing ${this.numShown} out of ${this.total} tasks`
      }
    },

    numShown () {
      let start = (this.page - 1) * this.pageSize + 1
      let finish = this.page === Math.ceil(this.total / this.pageSize) ? this.total : this.page * this.pageSize
      return `${start}-${finish}`
    },

    filterLabels () {
      let filters = this.tasksFilters()
      const labels = {}
      if (!_.isEmpty(filters.status)) {
        const statusLabel = _.map(filters.status, (s) => {
          return s ? 'Completed' : 'Open'
        })
        labels['status'] = statusLabel
      } else {
        labels['status'] = []
      }
      if (!_.isEmpty(filters.type)) {
        const typeLabel = _.map(filters.type, (t) => _.startCase(t))
        labels['type'] = this.isJustworks ? typeLabel : _.without(typeLabel, 'Email')
      } else {
        labels['type'] = []
      }
      if (filters.owner_id != null && filters.owner_id !== '') {
        const owner = this.users.all.find(function (user) { return user.id === filters.owner_id })
        labels['owner'] = owner && owner.name
      }
      if (filters.due && filters.due.length === 2) {
        if (filters.due[0] && filters.due[1]) {
          labels['due'] = moment(filters.due[0]).format('MM/DD/YYYY hh:mm a') + ' - ' + moment(filters.due[1]).format('MM/DD/YYYY hh:mm a')
        }
      }
      return labels
    }
  },

  methods: {
    ...mapActions(['reviewTasks', 'updateFilter']),

    resetFilter (targetType, target) {
      switch (targetType) {
        case 'status':
          this.updateFilter({field: 'status', value: _.filter(this.filterLabels['status'], (o) => o !== target)})
          break
        case 'type':
          this.updateFilter({
            field: 'type',
            value: _.map(_.filter(this.filterLabels['type'],
              (o) => o !== target), (f) => _.snakeCase(f))})
          break
        case 'owner':
          this.updateFilter({field: 'owner_id', value: null})
          break
        case 'due':
          this.updateFilter({field: 'due', value: []})
          break
      }
    }
  }
}
</script>
