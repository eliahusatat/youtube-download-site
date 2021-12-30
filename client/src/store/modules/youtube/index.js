import MyApi from '../../../pages/youtube/MyApi'
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
      try{
        const { data } = await MyApi().post('youtube/search-on-youtube-new', { "str": body.str});
            console.log(data)
        if (data.success) {
                // commit('SET_VIDEOS',data.videos);
            commit('SET', { name:'videos',value: data.videos })
            commit('SET', { name:'popularMode',value: false })
            commit('SET', { name:'searchMode',value: true })
            commit('SET', { name:'choosenVideoId',value: '' })
        } else{
            commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', { root: true })
        }
        } catch(e) {
            console.error(e)
            commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', { root: true })
        }
    },
    PopularOnYoutube: async ({ commit }, body) => {
        try{
            const {data} = await MyApi().post('youtube/youtube-most-popular', { "str": body.str});
            if (data.success) {
                commit('SET', { name:'videos',value: data.videos })
                commit('SET', { name:'popularMode',value: true })
                commit('SET', { name:'searchMode',value: false })
                commit('SET', { name:'choosenVideoId',value: '' })
                }else{
                  commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', { root: true })
                }
            }catch(e) {
              console.error(e)
              commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', { root: true })
            }
        },
        viewVideo: async ({ commit }, id) => {
            console.log(id)
            try{
                commit('SET', { name:'choosenVideoId',value: id })
                commit('SET', { name:'popularMode',value: false })
                commit('SET', { name:'searchMode',value: false })
                commit('SET', { name:'videoMode',value: true })
            } catch (e) {
                console.error(e)
                commit('SET_ERROR_MODAL', 'errorDeleteBlockedContact', {root: true})
            }
        }
    }
}
