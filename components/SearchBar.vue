<template>
  <div id="search-bar" class="flex justify-between">
    <real-lang :type="type" ></real-lang>
    <miso-popover
      v-model="saveSegmentVisible"
      ref="saveSegment"
      :width="300">
      <div class="pa2">
        <div class="flex items-center">
          <miso-input variant="white" v-model="segmentName" placeholder="Name of segment" class="f6 flex-auto mr2"></miso-input>
          <miso-button type="secondary" size="small" @click="saveSegment" :loading="isSaving" loading-text="Saving!">
            <div class="flex items-center">
              Save
            </div>
          </miso-button>
        </div>
      </div>
    </miso-popover>
    <miso-button
      v-popover:saveSegment
      class="ml3"
      type="primary"
      :disabled="!rowsCompleted">
      Save Segment
    </miso-button>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import RealLang from '#/components/RealLang'

  import axios from 'axios'
  import {
    MisoButton,
    MisoInput,
    MisoPopover,
    MisoMessage
  } from 'miso'

  Vue.use(MisoPopover)

  export default {
    name: 'search-bar',
    components: {
      RealLang,
      MisoButton,
      MisoInput,
      MisoPopover,
      MisoMessage
    },
    props: {
      type: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        saveSegmentVisible: false,
        isSaving: false,
        segmentName: ''
      }
    },
    computed: {
      ...mapGetters('realLang', ['rows', 'rowsCompleted']),
      segmentFromCurrentState() {
        return {
          name: this.segmentName,
          query_meta: this.queryMetaFromState
        }
      },
      queryMetaFromState() {
        return {
          terms: _.compact(this.rows).map((row) => {
            return row.inputs.map((input) => ({
              value: input.name,
              type: input.type
            }));
          }),
          type: this.type
        }
      },
    },
    methods: {
      saveSegment() {
        this.isSaving = true
        axios.post(`/segments`, this.segmentFromCurrentState)
           .then((response) => MisoMessage.success('Segment created!'))
           .catch((e) => MisoMessage.info('Oops! Something went wrong!'))
        this.isSaving = false
        this.saveSegmentVisible = false
      }
    }
  }
</script>

