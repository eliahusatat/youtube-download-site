import Vue from 'vue'
import App from './App.vue'
import Vuetify from './plugins/vuetify';
import store from './store'
import router from './router';
import VueRouter from "vue-router";
import VueYouTubeEmbed from 'vue-youtube-embed'

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(VueYouTubeEmbed)


new Vue({
  store,
  vuetify: Vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
