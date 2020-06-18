<template>
  <div id="tasks-index" class="component-wrap">
    <header class="pa3 bg-white flex items-center justify-between bb b--light-gray">
      <miso-heading level="2" class="mv0 dark-gray-accent">Tasks</miso-heading>
      <miso-button-link type="primary" href="/tasks/new">New Task</miso-button-link>
    </header>
    <header class="bg-white shadow-2 pa3">
      <miso-input variant="white" placeholder="Filter by name" v-model="search" class="f6 w5"/>
    </header>
    <inner-content>
      <el-table :data="paginatedTasks" height="100%" :row-key="keyForRow" class="vh-100">
        <div slot="empty">
          <miso-empty heading="No tasks found." body="Add one." class="pv3"></miso-empty>
        </div>
        <el-table-column label="Name" prop="name" sortable>
          <template slot-scope="scope">
            <a :href="taskUrl(scope.row.id)" class="link">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column label="Description" prop="description" sortable>
          <template slot-scope="scope">
            {{ scope.row.description | truncate(200) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="bg-white pa3 tr overflow-shadow z-999" v-if="filteredTasks.length > pageSize">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page.sync="page"
          :total="filteredTasks.length">
        </el-pagination>
      </div>
    </inner-content>
  </div>
</template>

<script>
  import InnerContent from '#/components/InnerContent'
  import Vue from 'vue'
  import axios from 'axios'
  import {
    MisoButtonLink,
    MisoEmpty,
    MisoHeading,
    Pagination,
    MisoInput,
    Table,
    TableColumn,
  } from 'miso'

  import Vue2Filters from 'vue2-filters'
  Vue.use(Vue2Filters)

  export default {
    name: 'tasks-index',
    components: {
      MisoButtonLink,
      MisoEmpty,
      MisoHeading,
      InnerContent,
      MisoInput,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination
    },
    methods: {
      taskUrl(taskId) {
        return `/tasks/${taskId}`
      }
    },
    data () {
      return {
        results: [],
        search: '',
        page: 1,
        pageSize: 10 // 10 is default
      }
    },
    computed: {
      filteredTasks: function () {
        var search = this.search.toLowerCase()
        if (search.length > 0) {
          return this.results.filter(function (row) {
            return row.name.toLowerCase().includes(search.trim())
          })
        } else {
          return this.results
        }
      },
      paginatedTasks() {
        var results = this.filteredTasks

        var startIndex = (this.page-1) * this.pageSize
        var endIndex = Math.min(this.page * this.pageSize, results.length)

        return results.slice(startIndex, endIndex)
      },
      keyForRow(row) {
        return row.id
      }
    },
    watch: {
      filteredTasks: function() {
        this.page = 1
      }
    },
    created () {
      axios.get(`/tasks.json`)
        .then(response => { this.results = response.data })
        .catch(() => '/tasks.json failed')
    }
  }
</script>
