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
            </v-col>
            <v-col  sm="1">
              <v-img
                  max-height="80"
                  max-width="100"
                  class="youtube-logo"
                  @click.stop="onClickLogo"
                  src="https://logos-world.net/wp-content/uploads/2020/04/YouTube-Logo-2017-present.jpg"
                  >
              </v-img>
              </v-col>
          </v-row>
        </template>
      </v-toolbar>
    </v-app-bar>



<!--  </div>-->
</template>
<script>
import {mapActions} from "vuex";

export default {
  name: 'YoutubeSearchBar',
  data() {
    return {
      userCreditsBalanceModal: false,
      isLoading: false,
      searchLoading: false,
      searchText: '',
      videos: []

    }
  },
  methods: {
    async search(){
      if(this.searchText != ''){
    this.searchLoading = true;
    await this.$store.dispatch('youtube/searchOnYoutube', {
        "str": this.searchText
      });
    this.searchLoading = false;
      }
    },
    async onClickLogo(){
    await this.$store.dispatch('youtube/PopularOnYoutube');
    }
  },

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
