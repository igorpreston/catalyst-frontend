<template>
  <div class="flex pa3 flex-column">
    <h3 class="mt0 mb3 ttn f5 fw3 dark-gray title">{{ title }}</h3>

    <h3 class="main-heading">Body</h3>
    <div v-html="body"/>

  </div>
</template>

<script>
import { itemView } from '../mixins/item-view'
import { mapActions, mapState } from 'vuex'

import {
  FeatherIcon,
  MisoCollapse,
  MisoCollapseItem
} from 'miso'

export default {
  name: 'ActivityItemViewEmail',

  components: {
    FeatherIcon,
    MisoCollapse,
    MisoCollapseItem
  },

  mixins: [itemView],

  data () {
    return {
      showMore: false
    }
  },

  computed: {
    ...mapState('activity', ['messages', 'activeName']),

    title () {
      return `${this.activity.resource.subject}`
    },

    body () {
      return `${this.activity.resource.body}`
    }
  },

  methods: {
    toContact (msg) {
      if (msg.email_type === 'received') {
        return `${msg.user.name} (me)`
      } else {
        return msg.contact.full_name
      }
    },

    fromContact (msg) {
      if (msg.email_type === 'sent') {
        return `${msg.user.name} (me)`
      } else {
        return msg.contact.full_name
      }
    },

    truncate (msg) {
      if (msg.body.length > 77) {
        return `${msg.body.substring(0, 77)}...`
      } else {
        return msg.body
      }
    }
  }
}
</script>

<style lang="scss">
  .linebreaks {
    white-space: pre;
  }
  .email__accordion {
    &.el-collapse {
      border: 0;
    }

    .is-active {
      .el-collapse-item__header {
        display: none;
      }
    }

    .el-collapse-item {
      &:not(:last-child) {
        border-bottom: 1px solid #dfe6ec;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }

    .el-collapse-item__header {
      display: block;
      height: auto;
      padding-left: 0;
      border: 0;
      line-height: unset;

      &:hover {
        background-color: #fbfbfe;
        cursor: pointer;
      }
    }

    .el-collapse-item__header__arrow {
      display: none;
    }

    .el-collapse-item__wrap {
      border: 0;
      background-color: #fff;
    }

    .el-collapse-item__content {
      padding: 24px 0;
    }
  }
</style>

<style lang="scss" scoped>
  .title {
    margin-bottom: 26px;
  }

  .email {
    &__to {
      color: #7E7F89;
    }
  }

  .show-more:hover {
    background-color: #fbfbfe;
    cursor: pointer;
  }

  .pre-wrap {
    white-space: pre-wrap;
  }
</style>
