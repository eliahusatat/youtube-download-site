<template>
<div>
  <v-container>
    <v-row>
  <youtube v-if="this.videoId != ''" :video-id="this.videoId" player-width="1280" player-height="640" ref="youtubeVideo"></youtube>
  <videos-search-list :videos="this.youtube.videos"/>
    </v-row>

  </v-container>
</div>
</template>

<script>
import VideosSearchList from "../../components/VideosSearchList";
import {mapState} from "vuex";

export default {
  name: 'VideoPlay',
  components : {
    VideosSearchList,
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