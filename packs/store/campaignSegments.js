import axios from 'axios'
import _ from 'lodash'

axios.defaults.headers.common['X-CSRF-Token'] = document.getElementsByName(
  'csrf-token'
)[0].getAttribute('content')
axios.defaults.headers.common['Accept'] = 'application/json'

const state = {
  availableSegments: [],
  segmentsContacts: [],
  campaignId: '',
  addedSegments: [],
  selectedSegments: [],
  availableContacts: [],
  addedContacts: [],
  selectedContacts: [],
  oneOffContacts: []}

const mutations = {
  resetStore (state) {
    state = Object.assign(state, {
      availableSegments: [],
      segmentsContacts: [],
      campaignId: '',
      addedSegments: [],
      selectedSegments: [],
      availableContacts: [],
      addedContacts: [],
      selectedContacts: [],
      oneOffContacts: []
    })
  },
  setCampaignId (state, campaignId) {
    state.campaignId = campaignId
  },
  updateAvailableSegments (state, segments) {
    state.availableSegments = segments
  },
  updateAvailableContacts (state, contacts) {
    state.availableContacts = contacts
  },
  updateSegmentContacts (state, obj) {
    let contacts = obj.contacts
    let segment = obj.segment
    let intersection = _.intersectionBy(state.segmentsContacts, contacts, 'id')
    let difference = _.differenceBy(contacts, intersection, 'id')
    state.segmentsContacts = _.map(state.segmentsContacts, (el) => {
      if (_.includes(intersection, el)) {
        el.segments.push(segment.name)
        el.segmentIds.push(segment.id)
      }
      return el
    })
    state.segmentsContacts = state.segmentsContacts.concat(difference)
  },
  updateAddedSegments (state, segments) {
    state.addedSegments = Object.assign([], segments)
  },
  updateSelectedSegments (state, segments) {
    state.selectedSegments = Object.assign([], segments)
  },
  removeSegmentContacts (state, segmentId) {
    state.segmentsContacts = _.compact(_.map(state.segmentsContacts, (el) => {
      let index = _.indexOf(el.segmentIds, segmentId)
      if (index > -1 && el.segmentIds.length === 1) {
        return null
      } else if (index > -1) {
        el.segments.splice(index, 1)
        el.segmentIds.splice(index, 1)
        return el
      } else {
        return el
      }
    }))
  },
  saveContact (state, contact) {
    state.oneOffContacts.push(contact)
  },
  removeContact (state, id) {
    state.oneOffContacts = _.filter(state.oneOffContacts, (el) => el.id !== id)
  },
  updateAddedContacts (state, contacts) {
    state.addedContacts = Object.assign([], contacts)
  },
  updateSelectedContacts (state, contacts) {
    state.selectedContacts = Object.assign([], contacts)
  }
}

const actions = {
  clearData (context) {
    context.commit('resetStore')
  },
  processSegments (context, segments) {
    segments.forEach((val) => context.dispatch('loadSegmentContacts', val))
  },
  processContacts (context, contacts) {
    contacts.forEach((val) => context.commit('saveContact', val))
  },
  loadAvailableSegments (context) {
    axios.get('/segments.json')
      .then(response => {
        context.commit('updateAvailableSegments', response.data)
      })
      .catch((err) => {
        console.log('segments.json call failed', err)
      })
  },
  loadAvailableContacts (context) {
    axios.get('/contacts.json?show_yanked')
      .then(response => {
        context.commit('updateAvailableContacts', response.data)
      })
      .catch((err) => {
        console.log('Contacts.json call failed', err)
      })
  },
  async loadSegments (context) {
    return await axios.get(`/campaigns/${state.campaignId}/segments`)
      .then(response => {
        context.dispatch('processSegments', response.data)
        context.commit('updateAddedSegments', response.data)
      })
      .catch((err) => {
        console.log('Segment failed to add to campaign', err)
      })
  },
  async loadContacts (context) {
    return await axios.get(`/campaigns/${state.campaignId}/contacts`)
      .then(response => {
        context.dispatch('processContacts', response.data)
        context.commit('updateAddedContacts', response.data)
      })
      .catch((err) => {
        console.log('Segment failed to add to campaign', err)
      })
  },
  loadSegmentContacts (context, segment) {
    axios.get(`/segments/${segment.id}/contacts.json`)
      .then(response => {
        let data = response.data
        let contacts = _.map(data, (val) => _.extend(val, {segments: [segment.name], segmentIds: [segment.id]}))
        context.commit('updateSegmentContacts', {contacts: contacts, segment: {name: segment.name, id: segment.id}})
      })
      .catch((err) => {
        console.log('contacts.json call failed', err)
      })
  },
  async saveSegment (context, id) {
    return await axios.post(`/campaigns/${state.campaignId}/segments`, {segment_id: id})
      .then(response => {
        console.log('Segment ' + id + ' has been added to campaign')
        context.dispatch('loadSegmentContacts', response.data.segment)
      })
      .catch((err) => {
        console.log('Segment failed to add to campaign', err)
      })
  },
  async removeSegment (context, id) {
    return await axios.delete(`/campaigns/${state.campaignId}/segments/${id}`)
      .then(response => {
        console.log('Segment ' + id + ' has been removed from campaign')
        context.commit('removeSegmentContacts', id)
      })
      .catch((err) => {
        console.log('Segment failed to be removed', err)
      })
  },
  async saveContact (context, id) {
    return await axios.post(`/campaigns/${state.campaignId}/contacts/${id}`)
      .then(response => {
        console.log('Contact ' + id + ' has been added to campaign')
        context.commit('saveContact', response.data.contact)
      })
      .catch((err) => {
        console.log('Segment failed to add to campaign', err)
      })
  },
  async removeContact (context, id) {
    return await axios.delete(`/campaigns/${state.campaignId}/contacts/${id}`)
      .then(response => {
        console.log('Contact ' + id + ' has been removed from campaign')
        context.commit('removeContact', id)
      })
      .catch((err) => {
        console.log('Segment failed to be removed', err)
      })
  },
  setCampaignId (context, campaignId) {
    context.commit('setCampaignId', campaignId)
  },
  updateSelectedSegments (context, segments) {
    context.commit('updateSelectedSegments', segments)
  },
  updateAddedSegments (context, segments) {
    context.commit('updateAddedSegments', segments)
  },
  updateSelectedContacts (context, contacts) {
    context.commit('updateSelectedContacts', contacts)
  },
  updateAddedContacts (context, contacts) {
    context.commit('updateAddedContacts', contacts)
  }
}

const getters = {
  hasSegments: state => state.addedSegments.length > 0,
  allContacts: state => state.segmentsContacts.concat(state.oneOffContacts)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
