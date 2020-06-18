export default {
  watch: {
    successMetric () {
      if (this.triggerOperator && this.times && this.days) {
        this.filterMembers()
      }
    },

    triggerOperator () {
      if (this.successMetric && this.times && this.days) {
        this.filterMembers()
      }
    },

    times () {
      if (this.successMetric && this.triggerOperator && this.days) {
        this.filterMembers()
      }
    },

    days () {
      if (this.successMetric && this.triggerOperator && this.times) {
        this.filterMembers()
      }
    }
  },
}