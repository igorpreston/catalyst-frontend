<template>
  <li
    :class="{ 'active' : active, 'collapsed' : collapsed }"
    class="db w-100 mb2">
    <popper :options="{ placement: 'right' }">
      <div class="popper el-tooltip__popper is-dark">
        {{ title }}
      </div>

      <a
        slot="reference"
        :href="link"
        class="flex items-center no-underline mid-gray-accent hover-dark-gray-accent justify-center navigation__link">
        <feather-icon
          :color="iconColor"
          :name="icon"
          height="19"
          width="19">
        </feather-icon>

        <span v-if="!collapsed">{{ title }}</span>
      </a>
    </popper>
  </li>
</template>

<script>
  import { Tooltip } from 'element-ui'
  import { FeatherIcon } from 'miso'

  import Popper from 'vue-popperjs'
  export default {
    props: {
      active: {
        type: Boolean,
        default: false
      },

      title: {
        type: String
      },

      icon: {
        type: String
      },

      link: {
        type: String
      },

      collapsed: {
        type: Boolean,
        default: false
      }
    },

    name: 'SideNavigationLink',

    components: {
      FeatherIcon,
      'el-tooltip': Tooltip,
      Popper
    },

    computed: {
      iconColor () {
        if (this.active) {
          return 'purple'
        } else {
          return 'gray'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  li:not(.active):hover {
    svg {
      fill: #313136;
    }
  }

  .active,
  .active:hover,
  .active:focus {
    box-shadow: inset 2px 0 0 0 #6957DA;

    a {
      color: #313136;
    }
  }

  a:focus {
    outline: none;
  }

  .navigation__link {
    padding: 10.5px 0;
  }
</style>
