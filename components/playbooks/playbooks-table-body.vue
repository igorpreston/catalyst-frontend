<template>
  <miso-table
    :data="filteredPlaybooks"
    @selection-change="selectPlaybooks"
    @row-click="rowClick"
    row-key="id"
    data-cy="playbook-table"
    class="full-height-table">
    <div slot="empty">
      <miso-empty
        class="pv5"
        heading="No Playbooks"
        body="You're good to go!"/>
    </div>

    <miso-table-column type="selection"/>

    <miso-table-column
      label="Name"
      prop="name"
      min-width="160"
      sortable>
      <template slot-scope="scope">
        <div class="truncate">
          {{ scope.row.name }}
        </div>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Description"
      prop="content_plain"
      min-width="300">
      <template slot-scope="scope">
        <div class="truncate">
          {{ scope.row.description }}
        </div>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Creator"
      prop="creator"
      min-width="160">
      <template slot-scope="scope">
        {{ scope.row.user.name }}
      </template>
    </miso-table-column>

    <miso-table-column
      label="Created"
      prop="created_at"
      min-width="130"
      sortable>
      <template slot-scope="scope">
        {{ formatCreatedAt(scope.row.created_at) }}
      </template>
    </miso-table-column>

    <miso-table-column
      min-width="182">
      <template slot-scope="scope">
        <div class="flex items-center justify-end pr3">
          <span
            class="switch"
            :class="scope.row.active ? 'active' : 'unactive'">
            Paused
          </span>

          <el-switch
            :value="scope.row.active"
            @input="val => updateStatus(val, scope.row.id)"
            :width="40"
            active-color="#3DBA88"
            inactive-color="#E74C3B"
            @click.prevent/>

          <span
            class="switch"
            :class="scope.row.active ? 'unactive' : 'active'">
            Active
          </span>
        </div>
      </template>
    </miso-table-column>
  </miso-table>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import moment from 'moment-timezone'
import _ from 'lodash'

import {
  MisoTable,
  MisoTableColumn,
  MisoEmpty,
  MisoMessage,
  FeatherIcon
} from 'miso'

import { Switch } from 'element-ui'

export default {
  name: 'PlaybooksTableBody',

  components: {
    MisoTable,
    MisoTableColumn,
    MisoEmpty,
    'el-switch': Switch,
    FeatherIcon
  },

  props: {
    onShowPlaybookView: {
      type: Function,
      default () {}
    },
    onHideSidePanel: {
      type: Function,
      default () {}
    }
  },

  computed: {
    ...mapGetters(['filteredPlaybooks']),
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },

    methods: {
      ...mapActions(['updatePlaybookStatus', 'selectPlaybooks']),

    formatCreatedAt (createdAt) {
      const date = createdAt && moment.tz(createdAt, (this.currentUser && this.currentUser.time_zone) || 'UTC')

        const formattedDate = date.format('MM/DD/YYYY')

        return `${formattedDate}`
      },

      playbookStatusById (id) {
        return _.find(this.filteredPlaybooks, { id })
      },

      updateStatus (status, id) {
        this.updatePlaybookStatus({ id, status })
            .then(() => MisoMessage.success('Successfully updated playbook'))
            .catch(() => MisoMessage.error('Failed to update playbook'))
      },

      rowClick (row, event) {

        if (!_.some(['el-checkbox__original', 'el-checkbox__inner', 'link', 'el-switch'], el => _.includes(event.target.className, el))) {
          this.onShowPlaybookView(row)
          this.onHideSidePanel()
        }
      }
    }
  }
</script>

<style lang="scss">
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    cursor: pointer;
  }

  .goto-playbook {
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
