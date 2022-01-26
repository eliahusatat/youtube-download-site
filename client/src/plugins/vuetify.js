import Vue from 'vue'
// Languages
import en from '../locale/en'
import he from '../locale/he'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  iconfont: 'mdi',
  lang: {
    locales: { en, he },
    current: 'he' // hebrew id the default lang
  }
})
