<template>
<div>
  <v-container>
    <v-row>
  <youtube v-if="this.videoId != ''" :video-id="this.videoId" player-width="670" player-height="444" ref="youtubeVideo" justify-right></youtube>
  <videos-search-list :videos="this.youtube.videos"/>
    </v-row>
  </v-container>
</div>
</template>

<script>
import VideosSearchList from "./VideosSearchList";
import {mapState} from "vuex";

export default {
  name: 'VideoPlay',
  components : {
    VideosSearchList
  },
  data() {
    return {
      isLoading : false
    }
  },
  props: {
    videoId: {
      type: String
    }
  },
  computed: {
    ...mapState(['youtube'])
  },
  methods: {

  },
}
</script>

<style scoped>

</style>