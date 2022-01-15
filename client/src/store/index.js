import Vue from 'vue'
import Vuex from 'vuex'
import { getAppMainInitState } from '../utils/getDefaultData'
// modules
import youtube from './modules/youtube'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: getAppMainInitState(),
  mutations,
  actions,
  modules: {
    youtube
  }
})
