import MyApi from '../../../service/MyApi'
import { getYoutubeInitState } from '../../../utils/getDefaultData'

export default {
  namespaced: true,
  state: getYoutubeInitState(),
  getters: {},
  mutations: {
    SET: (state, { name, value }) => {
      state[name] = value
    }
  },
  actions: {
    searchOnYoutube: async ({ commit }, body) => {
      try {
        const { data } = await MyApi().post('youtube/search-on-youtube-new', { str: body.str })
        if (data.success) {
          commit('SET', { name: 'videos', value: data.videos })
        } else {
          console.log('fail searchOnYoutube')
          console.log(data)
          // commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', {root: true});
        }
      } catch (e) {
        console.error(e)
        // commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', {root: true});
      }
    },
    PopularOnYoutube: async ({ commit }, body) => {
      try {
        const { data } = await MyApi().post('youtube/youtube-most-popular', { str: body.str })
        if (data.success) {
          commit('SET', { name: 'videos', value: data.videos })
        } else {
          commit('SET', { name: 'videos', value: [] })
          console.log('fail PopularOnYoutube')
          console.log(data)
        }
      } catch (e) {
        commit('SET', { name: 'videos', value: [] })
        console.error(e)
        commit('SET_ERROR_MODAL', 'errorPopularOnYoutube', { root: true })
      }
    },
    relatedToVideo: async ({ commit }, body) => {
      try {
        const { data } = await MyApi().post('youtube/related-to-video', { video_id: body.video_id })
        if (data.success) {
          commit('SET', { name: 'videos', value: data.videos })
        } else {
          commit('SET', { name: 'videos', value: [] })
          console.log('fail relatedToVideo')
          console.log(data)
          // commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', {root: true});
        }
      } catch (e) {
        commit('SET', { name: 'videos', value: [] })
        console.error(e)
        // commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', {root: true});
      }
    },
    viewVideo: async ({ dispatch }, id) => {
      try {
        dispatch('relatedToVideo', { video_id: id })
      } catch (e) {
        console.error(e)
        // commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', {root: true});
      }
    },
    getVideoComments: async (state, video_id) => {
      try {
        const { data } = await MyApi().post('youtube/video-comments', { video_id: video_id })
        if (data.success) {
          return data
        } else {
          console.log('fail getVideoComments')
          console.log(data)
          // commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', {root: true});
        }
      } catch (e) {
        console.error(e)
        // commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', {root: true});
      }
    },
    getVideoFullData: async (state, video_id) => {
      try {
        const { data } = await MyApi().post('youtube/video-full-data', { video_id: video_id })
        if (data.success) {
          return data
        } else {
          console.log('fail getVideoComments')
          console.log(data)
          // commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', {root: true});
        }
      } catch (e) {
        console.error(e)
        // commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', {root: true});
      }
    }

  }
}
