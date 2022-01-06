<template>
  <div :class="[{'mx-10' : $vuetify.breakpoint.mdAndUp, 'mt-10' : $vuetify.breakpoint.mdAndDown}, 'mx-5 ']">
  <videos-search-list
                      :videos="this.youtube.videos"
                      :text-width="500"
                      :img-width="250"
                      :text-height="140"
                      :img-height="140"

  ></videos-search-list>
  </div>
</template>

<script>
import VideosSearchList from "@/components/VideosSearchList";
import {mapState} from "vuex";
export default {
  name: "youtubeSearch",
  components: {
    VideosSearchList
  },
  computed: {
    pageTitle() {
      return  'YoutubePage';
    },
    ...mapState(['youtube'])
  }
}
</script>

<style scoped>

</style>