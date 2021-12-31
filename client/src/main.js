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
Vue.filter('str_limit', function (value, size) {
  if (!value) return '';
  value = value.toString();

  if (value.length <= size) {
    return value;
  }
  return value.substr(0, size) + '...';
});


new Vue({
  store,
  vuetify: Vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
