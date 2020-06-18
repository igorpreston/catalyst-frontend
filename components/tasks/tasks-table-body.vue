<template>
  <div id="tasks-table-body">
    <miso-table
      v-loading="isLoadingTasks"
      :data="tasks"
      class="full-height-table"
      element-loading-text="Loading tasks"
      row-key="id"
      @row-click="handleRowClick"
      @selection-change="selectTasks"
      @sort-change="sortChange">
      <div slot="empty">
        <miso-empty
          class="pv5"
          heading="No tasks"
          body="You don't have any pending tasks.">
          <div class="flex justify-center ">
            <span
              class="mv3 ph3 pv3 br-100 ba b--light-gray bg-off-white">
              <feather-icon
                :stroke-width="1.5"
                color="mid-gray"
                height="32"
                name="check-square"
                width="32"/>
            </span>
          </div>
          <div slot="cta">
            <miso-button
              type="primary"
              class="dark-gray"
              @click="onShowSidePanel('CreateTaskForm')">
              Create New Task
            </miso-button>
          </div>
        </miso-empty>

      </div>

      <miso-table-column type="selection"/>

      <miso-table-column
        v-if="filters.status !== false"
        prop="is_completed"
        width="50">
        <template slot-scope="scope">
          <tasks-table-status-column
            :is-completed="scope.row.is_completed"/>
        </template>
      </miso-table-column>

      <miso-table-column
        label="Action"
        prop="category"
        min-width="280">
        <template slot-scope="scope">
          <tasks-table-action-column
            :id="scope.row.id"
            :account-name="scope.row.account_name"
            :contact-name="scope.row.contact_full_name"
            :type="scope.row.category"
            :description="scope.row.description"
            :current-user-id="currentUser && currentUser.id"
            :playbook="scope.row.playbook || false"
            :step="scope.row.step || { number: 1, title: 'User Onboarding' }"
            :is-completed="scope.row.is_completed"/>
        </template>
      </miso-table-column>

      <miso-table-column
        label="Priority"
        prop="priority"
        :render-header="renderTasksTableHeader"
        sortable
        min-width="120">
        <template slot-scope="scope">
          <tasks-table-priority-column
            data-cy="tasks-table-priority-cell"
            :priority_text="scope.row.priority_text"
            :priority="scope.row.priority"
            :is-completed="scope.row.is_completed"/>
        </template>
      </miso-table-column>

      <miso-table-column
        label="Due"
        prop="due"
        :render-header="renderTasksTableHeader"
        sortable
        min-width="196">
        <template slot-scope="scope">
          <tasks-table-due-column
            data-cy="tasks-table-due-cell"
            :due="scope.row.due"
            :is-completed="scope.row.is_completed"/>
        </template>
      </miso-table-column>

      <miso-table-column
        sortable="custom"
        label="Renewal"
        :render-header="renderTasksTableHeader"
        prop="account_renewal_date"
        min-width="130">
        <template slot-scope="scope">
          <tasks-table-renewal-column
            data-cy="tasks-table-renewal-cell"
            :renewal="scope.row.account_renewal_date"
            :is-completed="scope.row.is_completed"/>
        </template>
      </miso-table-column>

      <miso-table-column
        label="Stage"
        prop="account_stage"
        :render-header="renderTasksTableHeader"
        sortable
        min-width="120">
        <template slot-scope="scope">
          <p
            data-cy="tasks-table-stage-cell"
            :class="getColorWithStatus(scope.row.is_completed)['text_color']">
            {{ scope.row.account_stage }}</p>
        </template>
      </miso-table-column>

      <miso-table-column
        label="Value"
        prop="account_contract_value"
        :render-header="renderTasksTableHeader"
        sortable
        min-width="110">
        <template slot-scope="scope">
          <tasks-table-value-column
            data-cy="tasks-table-value-cell"
            :value="scope.row.account_decimal_contract_value"
            :is-completed="scope.row.is_completed"/>
        </template>
      </miso-table-column>

      <miso-table-column
        label="Owner"
        prop="user_name"
        :render-header="renderTasksTableHeader"
        sortable
        min-width="130">
        <template slot-scope="scope">
          <tasks-table-owner-column
            data-cy="tasks-table-owner-cell"
            :owner_name="scope.row.user_name"
            :is-completed="scope.row.is_completed"/>
        </template>
      </miso-table-column>
    </miso-table>
    <div class="bg-white bl bb br b--purple-gray pa3 tr">

      <miso-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"/>

    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  FeatherIcon,
  MisoButton,
  MisoEmpty,
  MisoMessage,
  MisoPagination,
  MisoTable,
  MisoTableColumn
} from 'miso'
import { mapActions, mapGetters, mapState } from 'vuex'
import TasksTableActionColumn from '#/components/tasks/tasks-table-action-column'
import TasksTableDueColumn from '#/components/tasks/tasks-table-due-column'
import TasksTableOwnerColumn from '#/components/tasks/tasks-table-owner-column'
import TasksTablePriorityColumn from '#/components/tasks/tasks-table-priority-column'
import TasksTableRenewalColumn from '#/components/tasks/tasks-table-renewal-column'
import TasksTableStatusColumn from '#/components/tasks/tasks-table-status-column'
import TasksTableValueColumn from '#/components/tasks/tasks-table-value-column'

export default {
  name: 'TasksTableBody',

  components: {
    FeatherIcon,
    MisoButton,
    MisoEmpty,
    MisoMessage,
    MisoPagination,
    MisoTable,
    MisoTableColumn,
    TasksTableActionColumn,
    TasksTableDueColumn,
    TasksTableOwnerColumn,
    TasksTablePriorityColumn,
    TasksTableRenewalColumn,
    TasksTableStatusColumn,
    TasksTableValueColumn
  },

  props: {
    destination: {
      type: String,
      default: null
    },
    onShowSidePanel: {
      type: Function,
      default () {}
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser,
      filters: state => state.tasks.filters,
      account: state => state.accounts.account,
      contact: state => state.contacts.contact,
      page: state => state.tasks.page,
      pageSize: state => state.tasks.pageSize,
      tasks: state => state.tasks.all,
      total: state => state.tasks.total,
      order: state => state.tasks.order,
      sortColumn: state => state.tasks.sortColumn,
      isLoadingTasks: state => state.tasks.isLoadingTasks
    }),

    ...mapGetters([
      'getColorWithStatus'
    ]),

    currentPage: {
      get () {
        return this.page
      },
      set (page) {
        this.updatePage(page)
      }
    }
  },

  watch: {
    currentPage: function (newPage, oldPage) {
      this.fetchTasks(newPage)
    }
  },

  methods: {
    ...mapActions([
      'fetchTasksByDestination',
      'selectTasks',
      'updateSortColumn',
      'updateOrder',
      'updatePage',
      'updateIncludes',
      'reviewTasks'
    ]),

    renderTasksTableHeader (h, { column: { label } } ) {
      return h('span', { attrs: {'data-cy': `tasks-table-${label.toLowerCase()}-header`}, }, label)
    },

    fetchTasks (page) {
      this.fetchTasksByDestination({ page, destination: this.destination })
    },

    handleRowClick (row, event) {
      if (!_.some(['el-checkbox__original', 'el-checkbox__inner', 'link', 'el-switch'],
        el => _.includes(event.target.className, el))) {
        const taskIds = _.map(this.tasks, (t) => t.id)
        this.reviewTasks({clickedTaskId: row.id, taskIds: taskIds, filterConditions: this.filters})
      }
    },

    sortChange (obj) {
      let order = null
      switch (obj.order) {
        case 'ascending':
          order = 'ASC NULLS FIRST'
          break
        case 'descending':
          order = 'DESC NULLS LAST'
          break
        default:
          break
      }
      let prop = obj.prop
      let object = prop.split('_')[0]
      if (prop.split('_').length > 1 && this.tasks[0].hasOwnProperty(object)) {
        prop = prop.replace(`${object}_`, `${object}s.`)
        if (object === 'account') {
          this.updateIncludes('account')
        } else if (object === 'user') {
          this.updateIncludes('assigned_to')
        }
      }
      this.updateSortColumn(prop)
      this.updateOrder(order)
      this.currentPage = 1
      this.fetchTasks(this.currentPage)
    }
  }
}
</script>

<style lang="scss">
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    cursor: pointer;
  }

  .goto-task {
    .cell {
      display: flex;
    }

    &__arrow {
      visibility: hidden;
      .el-table__row:hover & {
        visibility: visible;
      }
    }
  }
</style>
