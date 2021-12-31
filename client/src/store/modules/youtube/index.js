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
    searchOnYoutube: async ({ commit,dispatch }, body) => {
      try{
        const { data } = await MyApi().post('youtube/search-on-youtube-new', { "str": body.str});
            console.log(data)
        if (data.success) {
          dispatch('clearStat')
          commit('SET', { name:'videos',value: data.videos })
          commit('SET', { name:'searchMode',value: true })
        } else{
          console.error('fail searchOnYoutube')        
        }
        } catch(e) {
            console.error(e)
        }
    },
    PopularOnYoutube: async ({ commit,dispatch }) => {
        try{
            const {data} = await MyApi().post('youtube/youtube-most-popular', { "str": ""});
            if (data.success) {
              dispatch('clearStat')
              commit('SET', { name:'videos',value: data.videos })
              commit('SET', { name:'popularMode',value: true })
              }else{
                console.error('fail PopularOnYoutube')        
              }
            }catch(e) {
              console.error(e)
            }
        },
        viewVideo: async ({ commit,dispatch }, id) => {
            console.log(id)
            try{
              dispatch('clearStat')
              commit('SET', { name:'choosenVideoId',value: id })
              commit('SET', { name:'videoMode',value: true })
            } catch (e) {
                console.error(e)
            }
        },
        clearStat: ({ commit }) => {
          commit('SET', { name:'choosenVideoId',value: '' })
          commit('SET', { name:'popularMode',value: false })
          commit('SET', { name:'searchMode',value: false })
          commit('SET', { name:'videoMode',value: false })
        }

    }
}
