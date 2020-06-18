import router from '../router'

export default {
  state: {
    isSidePanelVisible: false,
    sidePanelView: null,
    isExpandedAside: false,
    panelWidth: 0
  },

  getters: {
    assetsHost (state) {
      return process.env.AWS_CLOUD_FRONT_HOST
    }
  },

  actions: {
    showSidePanel (view) {
      this.setPanelVisibility(true)
      this.setPanelView(view)
      this.setExpandedAside(false)
      this.setPanelWidth(341)
    },

    hideSidePanel (state) {
      this.setPanelVisibility(false)
      this.setPanelView(null)
      this.setExpandedAside(true)
      this.setPanelWidth(0)
    },

    changeTab (context, name) {
      router.push({query: {tab: name}})
    }
  },

  mutations: {
    setPanelVisibility (state, visibility) {
      state.isSidePanelVisible = visibility
    },
    setPanelView (state, view) {
      state.sidePanelView = view
    },
    setExpandedAside (state, expanded) {
      state.isExpandedAside = expanded
    },
    setPanelWidth (state, width) {
      state.panelWidth = width
    }
  }
}
