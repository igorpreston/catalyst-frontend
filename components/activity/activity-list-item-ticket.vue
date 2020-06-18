<template>
  <div
    :class="isSelected"
    @click="onItemClick">
    <div class="mid-gray z-1 activity__time">{{ toTimeInTimeZone(activity.when) }}</div>

    <div class="bg-white z-1 activity__circle">
      <!-- change icon name -->
      <div class="flex items-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 20"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>Ticket</title>

          <defs/>

          <g
            id="Page-1"
            stroke="none"
            stroke-width="2"
            fill="none"
            fill-rule="evenodd"
            stroke-linecap="round"
            stroke-linejoin="round">
            <g
              id="Ticket"
              transform="translate(1.000000, 1.000000)"
              stroke="#6b6b76"
              stroke-width="2">
              <path
                id="Rectangle-path"
                d="M2.03731572,0 L19.9626994,1.36395175e-05 C21.0672613,1.36395175e-05 21.9626857,0.895438033 21.9626857,2 C21.9626857,2.33725796 21.8773991,2.66903911 21.7147572,2.96448886 C20.7907591,4.64299257 20.3287601,6.32149629 20.3287601,8 C20.3287601,9.67850205 20.7907582,11.3570041 21.7147545,13.0355062 L21.7147537,13.0355066 C22.2474292,14.0031478 21.8948198,15.2193948 20.9271786,15.7520703 C20.6317271,15.914713 20.2999441,16 19.9626843,16 L2.03730062,15.9999864 C0.932738658,15.9999864 0.0373142639,15.104562 0.0373142639,14 C0.0373142639,13.662742 0.1226009,13.3309609 0.28524278,13.0355111 C1.20924089,11.3570074 1.67123994,9.67850371 1.67123994,8 C1.67123994,6.32149795 1.2092418,4.64299589 0.285245525,2.96449384 L0.285246278,2.96449343 C-0.247429208,1.99685219 0.1051802,0.780605183 1.07282143,0.247929697 C1.36827288,0.0852870376 1.70005589,6.19536259e-17 2.03731572,0 Z"/>
              <rect
                id="Rectangle-path"
                x="8"
                y="6"
                width="6"
                height="4"
                rx="0.514285735"/>
            </g>
          </g>
        </svg>
      </div>
    </div>

    <div
      class="activity__text">
      <p
        class="mt0 activity__title">
        {{ action }} {{ listTitle }}
      </p>

      <p class="ma0 flex items-center activity__description">
        <span
          :class="priorityClass"
          class="flex mr2 f7">
          &bull;
        </span>
        {{ title }}
      </p>
    </div>

    <feather-icon
      name="arrow-right"
      width="19"
      height="19"
      color="purple"
      class="ml-auto activity__arrow"/>
  </div>
</template>

<script>
import { FeatherIcon } from 'miso'
import { itemView } from '../mixins/item-view'

export default {
  name: 'ActivityListItemTicket',

  components: {
    FeatherIcon
  },

  mixins: [itemView],

  props: {
    activity: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: String,
      default: null
    },
    onSelectListItem: {
      type: Function,
      default () {}
    },
    currentlySelectedItem: {
      type: Object,
      default: () => ({})
    },
    onOpenedItem: {
      type: Function,
      default () {}
    }
  },

  computed: {
    title () {
      return `${this.activity.resource.ticket_title}`
    },

    listTitle () {
      let str = this.activity.changes === '' ? '' : `${this.activity.changes} for`
      str = `${str} ${this.activity.verb === 'created' ? 'a' : 'the'} ticket for `

      return `${str} ${this.activity.resource.contact.full_name}`
    },

    description () {
      if (this.activity.resource_type === 'Ticket') {
        var priority = ''
        if (this.activity.resource.priority === 'Normal' || this.activity.resource.priority === 'High') {
          priority = ` and priority is ${this.activity.resource.priority}`
        }
        return `For ${this.activity.owner.full_name}${priority}`
      } else {
        return `${this.activity.verb} ${this.activity.changes}`
      }
    },

    isSelected () {
      if (this.currentlySelectedItem === null) {
        return false
      } else if (this.activity.id === this.currentlySelectedItem.id) {
        return 'selected'
      }
      return false
    },

    priorityClass () {
      return this.activity.resource.priority === 'High' ? 'red' : 'green'
    }
  },

  methods: {
    onItemClick () {
      this.onOpenedItem('ticket')
      this.onSelectListItem(this.activity)
    }
  }
}
</script>
