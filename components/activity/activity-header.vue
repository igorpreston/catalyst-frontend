<template>
  <header class="pt3 pb3 flex items-center justify-between activity__header">

    <div class="flex items-center">
      <p class="mv0 mr3 f6 header__title">Showing all events</p>
    </div>
  </header>
</template>

<script>
  import Vue from 'vue'

  import {
    MisoButton,
    MisoButtonLink,
    MisoMessage,
    MisoTag,
    FeatherIcon
  } from 'miso'

  export default {
    name: 'activity-header',

    props: [
      'isFilterVisible',
      'onToggleFilterVisible',
      'onShowSidePanel',
      'sidePanelView',
      'onShowDeleteModal',
      'reviewTaskUrl',
    ],

    components: {
      MisoButton,
      MisoButtonLink,
      MisoMessage,
      MisoTag,
      FeatherIcon
    }
  }
</script>

<style lang="scss">
  .activity__header {
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
  }
</style>

<style scoped>
  .header__title {
    line-height: 32px;
  }
</style>
