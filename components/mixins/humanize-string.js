import _ from 'lodash'

export const humanizeString = {
  methods: {
    humanize(str) { return _.capitalize(str).replace(/_/g, ' '); }
  }
}
