<template>
  <v-app>
    <v-main>
      <youtube-search-bar/>
      <v-fade-transition mode="out-in">
        <router-view/>
      </v-fade-transition>
    </v-main>
    <confirm ref="confirm"/>
  </v-app>
</template>

<script>
import YoutubeSearchBar from './components/YoutubeSearchBar'
import Confirm from './components/Confirm'
export default {
  name: 'App',

  components: {
    YoutubeSearchBar,
    Confirm
  },
  mounted () {
    this.$root.$confirm = this.$refs.confirm // set the confirmModal as global
  },

  data: () => ({
    //
  })
}
</script>
