<template>
<!--  <div v-frag>-->
    <!-- Main App Nav-->
<!--  <v-container fluid>-->
<!--    <v-row class="red">-->
    <v-app-bar app>
      <v-toolbar>
        <v-toolbar-items>
              <!--        Lang switcher-->
              <language-switcher-menu/>
        </v-toolbar-items>
        <v-spacer/>
        <v-toolbar-items>
              <v-skeleton-loader :loading="this.youtube.mainLoader"
                                 type="article"
                                 max-height="60px">
                <div>
                <v-text-field
                    placeholder="Search"
                    solo
                    class="text-field mb-6 mx-auto"
                    outlined
                    clearable
                    dense
                    @keyup.enter="search"
                    v-model="searchText">
                  <template v-slot:append>
                    <v-btn
                        depressed
                        tile
                        class="btn mr-0 ml-0 mb-0 p-0 float-right"
                        @click="search"
                        :loading="searchLoading"
                        :disabled="searchLoading"
                    >
                      <v-icon left>mdi-magnify</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
                </div>
            </v-skeleton-loader>
        </v-toolbar-items>
            <v-spacer/>
        <v-toolbar-items>
              <icon-and-drawer></icon-and-drawer>
        </v-toolbar-items>
      </v-toolbar>
    </v-app-bar>
<!--    </v-row>-->
<!--  </v-container>-->

<!--  </div>-->
</template>
<script>
import { mapActions, mapState } from 'vuex'
import LanguageSwitcherMenu from './LanguageSwitcherMenu'
import IconAndDrawer from './IconAndDrawer'

export default {
  name: 'YoutubeSearchBar',
  components: {
    LanguageSwitcherMenu,
    IconAndDrawer
  },
  data () {
    return {
      userCreditsBalanceModal: false,
      isLoading: false,
      searchLoading: false,
      searchText: '',
      videos: [],
      testN: true
    }
  },
  methods: {
    ...mapActions(['openConfirmModal']),
    async search () {
      if (this.searchText !== '' && this.$route.params.searchQuery !== this.searchText) {
        this.$store.commit('youtube/SET', { name: 'mainLoader', value: true })
        this.searchLoading = true
        await this.$store.dispatch('youtube/searchOnYoutube', {
          str: this.searchText
        })
        this.searchLoading = false
        this.$store.commit('youtube/SET', { name: 'mainLoader', value: false })
        this.$router.push(`/youtube-search/${this.searchText || ''}`).catch(() => { this.$router.push('/youtube-home') })
      }
    }
  },
  computed: {
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
