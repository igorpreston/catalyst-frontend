<template>
  <header class="pv3 flex items-center justify-between bb b--light-gray header">
    <div class="flex items-center">
      <p class="ma0 pv2 header__title">Created by
        <a href="#" class="link">{{ createdBy }}</a>
      </p>
    </div>

    <div class="flex items-center ml-auto">
      <div class="pr3 br b--light-gray">
        <miso-button type="outline" @click="openTemplateForm">Edit</miso-button>
      </div>

      <div class="pl2">
        <miso-button type="transparent" size="tiny" class="pa1" @click="setTemplate(null)">
          <feather-icon
            name="x"
            height="20"
            width="20"
            color="gray">
          </feather-icon>
        </miso-button>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  .pr3 {
    padding-right: 24px;
  }

  .pl2 {
    padding-left: 14px;
  }

  .header {
    &__title {
      font-size: 14px;
    }
  }
</style>

<script>
  import Vue from 'vue'

  import { mapMutations } from 'vuex'

  import {
    MisoButton,
    FeatherIcon
  } from 'miso'

  export default {
    name: 'templates-view-header',

    props: ['category', 'createdBy', 'onShowSidePanel'],

    components: {
      MisoButton,
      FeatherIcon
    },

    methods: {
      ...mapMutations(['setTemplate']),

      openTemplateForm () {
        if (this.category === 'note') {
          this.onShowSidePanel('EditTemplateForm')
        } else if (this.category === 'email') {
          this.onShowSidePanel('EditEmailTemplateForm')
        }
      }
    }
  }
</script>
