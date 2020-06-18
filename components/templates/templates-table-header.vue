<template>
  <header class="flex items-center justify-between pb3">

    <div class="flex items-center f6">
      <div class="br b--light-gray mr3">
        <miso-button class="mr3" type="outline" v-if="!isFilterVisible" @click="onToggleFilterVisible">
          Filter Items
        </miso-button>
      </div>

      <p v-if="anyTemplatesSelected" class="mv0">{{ selectedTemplatesNum }} templates selected</p>
      <p v-else class="mv0">Showing {{ filteredTemplatesNum }} out of {{ templatesNum }} templates</p>
    </div>

    <div class="flex items-center">
      <div class="br b--light-gray pr3 flex items-center mr3" v-if="anyTemplatesSelected">
        <miso-button v-if="singleTemplateSelected" class="mr2" type="outline"
          @click="openTemplateForm">Edit
        </miso-button>

        <miso-button type="outline" @click="onShowDeleteModal">Delete</miso-button>
      </div>

      <miso-dropdown
        trigger="click"
        @visible-change="toggleIcon()"
        @command="handleMenuClick">
        <miso-button type="primary" class="dark-gray create-template">
          New Template
          <feather-icon
            :name="dropdownIcon"
            color="white"
            width="16"
            height="16"
            class="ml2">
          </feather-icon>
        </miso-button>
        <miso-dropdown-menu slot="dropdown">
          <miso-dropdown-item
            :command="{ form: 'CreateTemplateForm', category: 'note' }"
            class="f6">
            Note Template
          </miso-dropdown-item>
          <miso-dropdown-item
            :command="{ form: 'CreateEmailTemplateForm', category: 'email' }"
            class="f6">
            Email Template
          </miso-dropdown-item>
        </miso-dropdown-menu>
      </miso-dropdown>
    </div>


  </header>
</template>

<script>
  import Vue from 'vue'

  import { mapGetters, mapMutations } from 'vuex'

  import {
    MisoButton,
    FeatherIcon,
    MisoDropdown,
    MisoDropdownMenu,
    MisoDropdownItem
  } from 'miso'

  export default {
    name: 'templates-table-header',

    props: [
      'sidePanelView',
      'isFilterVisible',
      'onShowSidePanel',
      'onShowDeleteModal',
      'onToggleFilterVisible'
    ],

    components: {
      MisoButton,
      FeatherIcon,
      MisoDropdown,
      MisoDropdownMenu,
      MisoDropdownItem
    },

    data () {
      return {
        dropdownIcon: 'chevron-down'
      }
    },

    computed: {
      ...mapGetters([
        'selectedTemplatesNum',
        'anyTemplatesSelected',
        'singleTemplateSelected',
        'templatesNum',
        'filteredTemplatesNum',
        'firstSelectedTemplate'
      ])
    },

    methods: {
      ...mapMutations(['setTemplateCategory']),

      handleMenuClick (item) {
        this.setTemplateCategory(item.category)
        this.onShowSidePanel(item.form)
      },

      toggleIcon () {
        if (this.dropdownIcon === 'chevron-down') {
          this.dropdownIcon = 'chevron-up'
        } else {
          this.dropdownIcon = 'chevron-down'
        }
      },

      openTemplateForm () {
        if (this.firstSelectedTemplate && this.firstSelectedTemplate.category === 'note') {
          this.onShowSidePanel('EditTemplateForm')
        } else if (this.firstSelectedTemplate && this.firstSelectedTemplate.category === 'email') {
          this.onShowSidePanel('EditEmailTemplateForm')
        }
      }
    }
  }
</script>

<style lang="scss">
  .create-template {
    & > div {
      display: flex;
    }
  }
</style>
