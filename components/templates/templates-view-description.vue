<template>
  <div class="bb b--light-gray pb24 f6">
    <h2 class="ma0 ttu mid-gray templates-view__heading">Description</h2>
    <div v-html="descriptionWithReplacedItems"></div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'templates-view-description',

    props: ['description'],

    computed: {
      descriptionWithReplacedItems() {
        const flow = _.flow([this.replaceImages, this.replaceLinks])

        return flow(this.description)
      }
    },

    methods: {
      replaceImages (str) {
        return str.replace(/<img([\w\W]+?)>/, (match) => {
          return ' < image > '
        })
      },

      replaceLinks (str) {
        return str.replace(/(<a([\w\W]+?)>)|(<\/a>)/, '')
      }
    }
  }
</script>
