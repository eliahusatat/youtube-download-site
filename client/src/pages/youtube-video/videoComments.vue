<template>
  <v-container>
    <v-row>
      <v-col>
        {{ commentNum }} Comments
      </v-col>
      <v-col>
        SORT BY
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1">
        <v-avatar>
          <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              alt="John"
          >
        </v-avatar>
      </v-col>
      <v-col  cols="11" >
        <v-row >
          Commenting publicly
        </v-row>
        <v-row>
          <v-divider/>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-for="(comment,i) in comments" :key="i">
       <video-comment-item :comment="comment"></video-comment-item>
    </v-row>
  </v-container>
</template>

<script>
import VideoCommentItem from './VideoCommentItem'
export default {
  name: 'videoComments',
  components: {
    VideoCommentItem
  },
  props: {
    comments: {
      type: Array,
      default: () => {
        return []
      }
    },
    commentNum: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
