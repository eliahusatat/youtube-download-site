<template>
  <v-app>
    <v-main>
      <youtube-search-bar/>
      <v-fade-transition mode="out-in">
        <router-view/>
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
import YoutubeSearchBar from "./components/YoutubeSearchBar";
export default {
  name: 'App',

  components: {
    YoutubeSearchBar
  },

  data: () => ({
    //
  }),
};
</script>
