<template>
  <div
    class="flex flex-auto flex-column">
    <segments-activity-list-item
      v-for="(activity, index) in dateActivities"
      :key="index"
      :date="activity.date"
      :values="activity.values"
      :last-item="index === dateActivities.length - 1"
      :is-opened="true"
      :currently-selected-item="currentlySelectedItem"
      :on-select-list-item="onSelectListItem"
      :on-opened-item="onOpenedItem"
      :segment-name="segmentName">
    </segments-activity-list-item>
  </div>
</template>

<script>
  import SegmentsActivityListItem from '#/components/segments/segments-activity-list-item'

  export default {
    name: 'segments-activity-list',

    props: {
      onOpenedItem: Function,
      onSelectListItem: Function,
      currentlySelectedItem: Number,
      segmentName: String,
      activities: Array
    },

    components: {
      SegmentsActivityListItem
    },

    computed: {
      dateActivities () {
        return this.activities && this.activities.map(activity => {
          const dateKey = Object.keys(activity)[0]
          console.log('datekey', dateKey)
          return {
            date: dateKey,
            values: activity[dateKey]
          }
        })
      }
    }
  }
</script>
