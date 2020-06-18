<template>
  <miso-table
    :data="filteredTemplates"
    row-key="id"
    class="full-height-table"
    @selection-change="selectTemplates"
    @row-click="onRowClick">
    <div slot="empty">
      <miso-empty
        class="pv5"
        heading="No Templates"
        body="You're good to go!"/>
    </div>

    <miso-table-column type="selection"/>

    <miso-table-column
      label="Name"
      prop="name"
      min-width="150"
      sortable
      class="truncate two-lines"/>

    <miso-table-column
      label="Description"
      prop="content_plain"
      min-width="400">
      <template slot-scope="scope">
        <div class="truncate two-lines">
          {{ scope.row.content_plain }}
        </div>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Type"
      prop="category"
      width="160"
      sortable>
      <template slot-scope="scope">
        {{ scope.row.category === 'note' ? 'Note' : 'Email' }}
      </template>
    </miso-table-column>

    <miso-table-column
      label="Created"
      prop="created_at"
      min-width="180"
      sortable>
      <template slot-scope="scope">
        {{ formatCreatedAt(scope.row.created_at) }}<br >
        <span style="color: #8a8a95;">by {{ scope.row.created_by_name }}</span>
      </template>
    </miso-table-column>

    <miso-table-column
      min-width="50"
      class-name="goto-template">
      <template slot-scope="scope">
        <feather-icon
          name="arrow-right"
          height="20"
          width="20"
          color="purple"
          class="goto-template__arrow ml-auto"/>
      </template>
    </miso-table-column>
  </miso-table>
</template>

<script>
import moment from 'moment-timezone'

import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'

import {
  MisoTable,
  MisoTableColumn,
  MisoEmpty,
  FeatherIcon
} from 'miso'

export default {
  name: 'TemplatesTableBody',

  components: {
    MisoTable,
    MisoTableColumn,
    MisoEmpty,
    FeatherIcon
  },

  computed: {
    ...mapGetters(['filteredTemplates']),
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },

  methods: {
    ...mapActions(['selectTemplates']),

    ...mapMutations(['setTemplate']),

    formatCreatedAt (createdAt) {
      const date = createdAt && moment.tz(createdAt,
        (this.currentUser && this.currentUser.time_zone) || 'UTC')

      const formattedDate = date.format('MM/DD/YYYY')
      const formattedTime = date.format('h:mma')

      return `${formattedDate} @ ${formattedTime}`
    },

    onRowClick (row, event, column) {
      if (column.type === 'selection') {
        return
      }

      this.setTemplate(row.id)
    }
  }
}
</script>

<style lang="scss">
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    cursor: pointer;
  }

  .goto-template {
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
