import Vue from 'vue'
import App from './App.vue'
import Vuetify from './plugins/vuetify'
import store from './store'
import router from './router'
import VueRouter from 'vue-router'
import VueYouTubeEmbed from 'vue-youtube-embed'
import SweetAlertIcons from 'vue-sweetalert-icons'

Vue.use(SweetAlertIcons)
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueYouTubeEmbed)
Vue.filter('str_limit', function (value, size) {
  if (!value) return ''
  value = value.toString()

  if (value.length <= size) {
    return value
  }
  return value.substr(0, size) + '...'
})
Vue.prototype.$t = function (...args) {
  try {
    args[0] = `$vuetify.${args[0]}`
    let text = this.$vuetify.lang.t(...args)
    if (text === args[0] && this.$vuetify.lang.current !== 'he') { // in case not found translation - fall back to hebrew
      const key = args[0].split('.')[1] // remove the $vuetify from the string
      text = this.$vuetify.lang.locales.he[key]
      text = text.replace(/\{(\d+)\}/g, (match, index) => args[Number(index) + 1]) // add dynamics fields to text - find the {number} and replace
    }
    return text
  } catch (e) {
    const text = args[0]
    return text
  }
} // translation

export const app = new Vue({
  store,
  vuetify: Vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
