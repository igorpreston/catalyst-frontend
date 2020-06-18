<template>
  <div class="flex flex-auto mh3 overflow-x-auto">
    <activity-filter
      :visible="isFilterVisible"
      :on-toggle-filter-visible="toggleFilterVisible"/>

    <div class="flex-auto">
      <activity-header
        :side-panel-view="sidePanelView"
        :is-filter-visible="isFilterVisible"
        :on-show-side-panel="onShowSidePanel"
        :on-toggle-filter-visible="toggleFilterVisible"/>

      <div class="flex flex-auto relative column">
        <div
          ref="activityListColumn"
          class="flex flex-auto bt b--light-gray mr24 overflow-auto activity__column"
          @scroll="toggleBottomShadow">
          <activity-list
            ref="activityListItems"
            :on-opened-item="openItem"
            :currently-selected-item="currentlySelectedItem"
            :on-select-list-item="selectListItem"/>

          <div
            v-if="scrollable"
            class="shadow__bottom shadow__bottom--from-bottom"/>
        </div>

        <div class="flex flex-auto bt bl b--light-gray activity__column">
          <activity-item-view
            :activity-type="activityType"
            :on-close-item="closeItem"
            :is-filter-visible="isFilterVisible"
            :currently-selected-item="currentlySelectedItem"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityHeader from '#/components/activity/activity-header'
import ActivityFilter from '#/components/activity/activity-filter'
import ActivityList from '#/components/activity/activity-list'
import ActivityItemView from '#/components/activity/activity-item-view'

export default {
  name: 'Activity',

  components: {
    ActivityHeader,
    ActivityFilter,
    ActivityList,
    ActivityItemView
  },

  props: {
    isSidePanelVisible: {
      type: Boolean,
      default: false
    },
    onShowSidePanel: {
      type: Function,
      default () {}
    },
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    sidePanelView: {
      type: String,
      default: null
    },
    destination: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isFilterVisible: false,
      activityType: null,
      currentlySelectedItem: null,
      scrollable: false
    }
  },

  watch: {
    isActive () {
      this.$refs.activityListColumn.scrollTop = 1

      if (this.$refs.activityListColumn.scrollTop) {
        this.$refs.activityListColumn.scrollTop = 0
        this.scrollable = true
      }
    }
  },

  mounted () {
    window.addEventListener('resize', this.toggleBottomShadow)
  },

  methods: {
    toggleFilterVisible () {
      this.isFilterVisible = !this.isFilterVisible
    },

    openItem (type) {
      this.activityType = type
    },

    closeItem () {
      this.activityType = null
      this.currentlySelectedItem = null
    },

    selectListItem (activity) {
      this.currentlySelectedItem = activity
    },

    toggleBottomShadow () {
      let column = this.$refs.activityListColumn

      if (column.scrollTop + column.offsetHeight === column.scrollHeight) {
        this.scrollable = false
      } else {
        this.scrollable = true
      }
    }
  }
}
</script>

<style lang="scss">
  .activity__column {
    height: calc(100vh - 238px);

    .review & {
      height: calc(100vh - 246px);
    }
  }
</style>

<style scoped lang="scss">
  .shadow__bottom {
    left: 0;
    width: 48.5%;
    background-color: #eaeaec;
  }

  .column {
    min-width: 1024px;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 112px;
      width: 1px;
      height: 58px;
      background-color: #fff;
      z-index: 5;
    }
  }

  @media all and (-ms-high-contrast:none) {
    .column:before {
      width: 0;
    }

    *::-ms-backdrop,
    .foo {
      width: 0;
    }
  }
</style>
