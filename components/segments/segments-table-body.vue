<template>
  <miso-table
    :data="segments"
    class="full-height-table pointer"
    data-cy="segment-table"
    @selection-change="selectSegments"
    @row-click="rowClick">
    <div slot="empty">
      <miso-empty
        heading="No segments"
        body="Add a segment to get started"/>
    </div>

    <miso-table-column
      type="selection"
      width="55"/>

    <miso-table-column
      sortable
      label="Name"
      prop="name"
      width="180">
      <template slot-scope="scope">
        <p class="ma0 truncate two-lines">{{ scope.row.name }}</p>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Filters"
      min-width="300">
      <template slot-scope="scope">
        <div
          class="ma0 truncate two-lines description-fix">
          <span
            v-for="(term, index) in scope.row.query_meta.terms"
            :key="index">
            {{ filtersString(scope.row.query_meta.terms, term, index) }}
          </span>
        </div>
      </template>
    </miso-table-column>

    <miso-table-column
      sortable
      prop="type"
      label="Type"
      min-width="100">
      <template slot-scope="scope">
        {{ scope.row.type }}
      </template>
    </miso-table-column>

    <miso-table-column
      sortable
      prop="member_count"
      label="Size"
      width="100"/>

    <miso-table-column
      label="Recent Activity"
      min-width="200">
      <template slot-scope="scope">
        <p class="ma0 truncate two-lines activity-fix">{{ scope.row.last_activity_text }}</p>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Creator"
      min-width="150">
      <template slot-scope="scope">
        <p class="ma0 truncate">{{ scope.row.user.name }}</p>
      </template>
    </miso-table-column>
  </miso-table>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import _ from 'lodash'

import {
  MisoTable,
  MisoTableColumn,
  MisoEmpty
} from 'miso'

export default {
  name: 'SegmentsTableBody',

  components: {
    MisoTable,
    MisoTableColumn,
    MisoEmpty
  },

  props: {
    segments: {
      type: Array,
      default: () => []
    },
    setMode: {
      type: Function,
      default () {}
    },
    humanizedString: {
      type: Function,
      default () {}
    }
  },

  methods: {
    ...mapActions([
      'selectSegments'
    ]),

    ...mapMutations([
      'setSegmentViewId'
    ]),

    rowClick (row, event) {
      if (!_.some(['el-checkbox__original', 'el-checkbox__inner', 'link', 'el-switch', 'el-table-column--selection'], el => _.includes(event.target.className, el))) {
        this.setSegmentViewId(row.id)
        this.setMode('view')
      }
    },

    filtersString (terms, term, index) {
      return `${this.humanizedString(term.field, term.operator, term.value)}${terms.length === 1 || index === terms.length - 1 ? '' : ';'}`
    }
  }
}
</script>

<style>
  @media not all and (min-resolution:.001dpcm)
  { @supports (-webkit-appearance:none) and (stroke-color:transparent) {
    .name-fix {
      width: 95px;
    }

    .description-fix {
      width: 270px;
    }

    .activity-fix {
      width: 170px;
    }
  }}
</style>
