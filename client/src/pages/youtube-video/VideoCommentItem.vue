<template>
  <v-container>
    <v-row>
      <v-col cols="1">
        <v-avatar>
          <img
              :src="this.comment.imgSrc"
          >
        </v-avatar>
      </v-col>
      <v-col  cols="3" >
        <v-row >
         {{this.comment.name}}   {{this.comment.publishedAt}}
        </v-row>
        <v-row>
          <p v-html="this.comment.text"></p>
        </v-row>
      </v-col>
      <v-col  cols="6" justify="left">

      </v-col>
    </v-row>
    <v-row>

    </v-row>
  </v-container>
</template>

<script>
export default {
name: "VideoCommentItem",
  props:{
  comment :{
    type :Object ,
    default : () => {
      return {}
    }
  }
  }
}
</script>

<style scoped>

</style>