import Vue from 'vue';
import Vuex from 'vuex';

// modules
import youtube from './modules/youtube';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        youtube
    }
});
