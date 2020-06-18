<template>
  <miso-table
    :data="users"
    @selection-change="selectUsers"
    @row-click="rowClick"
    class="full-height-table--inner">
    <div slot="empty">
      <miso-empty
        class="pv5"
        heading="No users"
        body="You're good to go!">
      </miso-empty>
    </div>

    <miso-table-column type="selection"></miso-table-column>

    <miso-table-column
      prop="name"
      label="Name"
      min-width="160"
      sortable>
    </miso-table-column>

    <miso-table-column
      prop="title"
      label="Title"
      min-width="250"
      sortable>
    </miso-table-column>

    <miso-table-column
      prop="email"
      label="Email"
      min-width="250">
    </miso-table-column>

    <miso-table-column
      prop="admin"
      min-width="120">
      <template slot-scope="scope">
        <miso-tag
          class="users__admin"
          v-if="scope.row.admin">
          Admin
        </miso-tag>
      </template>
    </miso-table-column>
  </miso-table>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  import {
    MisoTable,
    MisoTableColumn,
    MisoEmpty,
    MisoTag
  } from 'miso'

  export default {
    name: 'settings-users-table-body',

    props: [
      'destination',
      'onShowSidePanel'
    ],

    components: {
      MisoTable,
      MisoTableColumn,
      MisoEmpty,
      MisoTag
    },

    computed: {
      ...mapState({
        users: state => state.users.all
      })
    },

    methods: {
      ...mapActions(['selectUsers', 'updateUserForm']),

      rowClick (row, event) {
        if (!_.some(['el-checkbox__original', 'el-checkbox__inner', 'link', 'el-switch'], el => _.includes(event.target.className, el))) {
          this.updateUserForm(row)
          this.onShowSidePanel('UserForm', true)
        }
      }
    }
  }
</script>

<style>
  .users__admin {
    border-radius: 0;
    border-width: 2px;
    border-color: #A299E7;
  }

  .el-table__row:hover {
    cursor: pointer;
  }
</style>
