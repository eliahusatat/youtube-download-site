<template>
<!--  <div v-frag>-->
    <!-- Main App Nav-->
    <v-app-bar app  >
      <v-toolbar>
        <template >

          <v-row no-gutters>

            <v-col  sm="4">

            </v-col >
            <v-col sm="7">
              <v-skeleton-loader :loading="this.youtube.mainLoader"
                                 type="article"
                                 max-height="60px">
              <v-container>
                <v-text-field
                    placeholder="Search"
                    solo
                    class="text-field"
                    outlined
                    clearable
                    dense
                    @keyup.enter="search"
                    v-model="searchText">
                <template v-slot:append>
                  <v-btn
                      depressed
                      tile
                      class="btn mr-0 ml-0 mb-0 p-0"
                      @click="search"
                      :loading="searchLoading"
                      :disabled="searchLoading"
                     >
                    <v-icon left>mdi-magnify</v-icon>
                  </v-btn>
                </template>
                </v-text-field>
              </v-container>
            </v-skeleton-loader>
            </v-col>
            <v-col  sm="1">
              <v-skeleton-loader :loading="this.youtube.mainLoader"
                                 type="image"
                                 max-height="60px">
              <v-img
                  max-height="80"
                  max-width="100"
                  class="youtube-logo"
                  @click.stop="onClickLogo"
                  src="https://logos-world.net/wp-content/uploads/2020/04/YouTube-Logo-2017-present.jpg"
                  >
              </v-img>
              </v-skeleton-loader>
              </v-col>

          </v-row>

        </template>
      </v-toolbar>
    </v-app-bar>



<!--  </div>-->
</template>
<script>
import {mapActions,mapState} from "vuex";

export default {
  name: 'YoutubeSearchBar',
  data() {
    return {
      userCreditsBalanceModal: false,
      isLoading : false,
      searchLoading: false,
      searchText : '',
      videos : []

    }
  },
  methods: {
    ...mapActions(['openConfirmModal']),
    async search(){
      if(this.searchText != '' && this.$route.params.searchQuery != this.searchText){
        this.$store.commit('youtube/SET',  { name:'mainLoader',value: true })
        this.searchLoading = true;
        await this.$store.dispatch('youtube/searchOnYoutube', {
          "str": this.searchText
        });
        this.searchLoading = false;
        this.$store.commit('youtube/SET',  { name:'mainLoader',value: false })
        this.$router.push(`/youtube-search/${this.searchText||''}`).catch(()=>{this.$router.push(`/youtube-home`)});
      }
    },
    async onClickLogo() {
      this.$store.commit('youtube/SET', {name: 'mainLoader', value: true})
      await this.$store.dispatch('youtube/PopularOnYoutube', {
        "str": this.searchText
      });
      this.$store.commit('youtube/SET', {name: 'mainLoader', value: false})
      if(this.$route.matched.some(({ name }) => name !== 'youtube-home')){
      this.$router.push(`/youtube-home`);
      }
    }
  },
  computed:{
    ...mapState(['youtube'])
  }

}
</script>
<style scoped>
.text-field{
  width: 500px;
  height: 13px;
  border-radius: 0;
  padding: 0 !important;
}
.btn{
  border-radius: 0;
  margin-bottom: 100px;
}


</style>
