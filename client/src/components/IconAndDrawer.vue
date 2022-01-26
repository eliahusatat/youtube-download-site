<template>
  <div>
    <v-container>
      <v-row  no-gutters>
        <v-col>
    <v-skeleton-loader :loading="this.youtube.mainLoader"
                       type="image"
                       max-height="60px">
      <v-img
          max-height="80"
          max-width="100"
          class="youtube-logo"
          @click.stop="testAddNotification"
          src="https://logos-world.net/wp-content/uploads/2020/04/YouTube-Logo-2017-present.jpg"
      >
      </v-img>

    </v-skeleton-loader>
        </v-col>
        <v-col>
        <v-app-bar-nav-icon  @click.stop="setDrawer"></v-app-bar-nav-icon>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
// import {getAppLanguagesOptions} from "@/utils/getDefaultData";

export default {
  name: 'IconAndDrawer',
  data () {
    return {
      datesArr: [{ date: '18/01/22 15:14:13' }, { date: '18/01/22 15:15:13' }, { date: '18/01/22 15:12:13' }, { date: '18/01/22 15:17:13' }],
      flag: true
    }
  },
  methods: {
    ...mapActions(['openConfirmModal']),
    setDrawer () {
      console.log(this.$vuetify.rtl)
      this.$store.commit('SET', { name: 'navigationDrawer', value: true })
    },
    sortAndPrint () {
      if (this.flag) {
        this.datesArr = this.datesArr.sort((a, b) => new moment(a.date, 'DD/MM/YY HH:mm:ss') - new moment(b.date, 'DD/MM/YY HH:mm:ss'))
        console.log('after a - b')
        console.log(this.datesArr)
        this.flag = !this.flag
      } else {
        this.datesArr = this.datesArr.sort((a, b) => new moment(b.date, 'DD/MM/YY HH:mm:ss') - new moment(a.date, 'DD/MM/YY HH:mm:ss'))
        console.log('after b - a')
        console.log(this.datesArr)
        this.flag = !this.flag
      }
    },
    async onClickLogo () {
      // this.$store.commit('youtube/SET', {name: 'mainLoader', value: true})
      // await this.$store.dispatch('youtube/PopularOnYoutube', {
      //   "str": this.searchText
      // });
      // this.$store.commit('youtube/SET', {name: 'mainLoader', value: false})
      // if(this.$route.matched.some(({ name }) => name !== 'youtube-home')){
      // this.$router.push(`/youtube-home`);
      // }

      // error with some options
      // this.$store.commit('OPEN_CONFIRM_MODAL', {
      //   message: 'error',
      //   secondDynamicString: 'secondDynamicString',
      //   type: 'error',
      //   title: 'error'
      // }, {root: true})

      // success
      // this.$store.commit('SET_SUCCESS_MODAL', {
      //   message: 'success',
      // }, {root: true});

      // error
      // this.$store.commit('SET_ERROR_MODAL', 'error', {root: true});

      // warning
      // this.$store.commit('SET_WARNING_MODAL', {message: 'info'}, {root: true})

      // info
      this.$store.commit('OPEN_CONFIRM_MODAL', {
        message: 'error',
        secondDynamicString: 'secondDynamicString',
        title: 'error'
      }, { root: true })
    },
    async testConfirmModal () {
      const isUserOpenShortLinkModal = await this.openConfirmModal({
        okButton: { text: 'yes', icon: 'mdi-check', color: 'success' },
        cancelButton: { text: 'cancel', icon: 'mdi-close', color: 'error' },
        message: 'testConfirmModal',
        isActionButtons: true
      })
      if (isUserOpenShortLinkModal) { console.log('true') } else { console.log('false') }
      return isUserOpenShortLinkModal
    },
    async testConfirmModalText () {
      const listName = await this.openConfirmModal({
        message: 'testConfirmModal',
        isInputMode: true,
        inputType: 'addNewContactList'
      })
      console.log(listName)
    },
    async testConfirmModalDate () {
      const selectedDate = await this.openConfirmModal({
        message: 'testConfirmModalDate',
        title: 'testConfirmModalDate',
        isDatePickerMode: true,
        isInputMode: true,
        isTextFieldMode: false,
        inputButtonText: 'update',
        inputButtonIcon: 'mdi-calendar-arrow-left'
      })
      console.log(selectedDate)
    },
    async testAddNotification () {
      await this.$store.dispatch('addNotification', { message: 'testWithNum', type: 'info', dynamicString: '1' })
    }
  },
  computed: {
    ...mapState(['youtube'])
  }
}
</script>

<style scoped>

</style>
