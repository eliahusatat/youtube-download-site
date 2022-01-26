<template>
  <v-dialog :hide-overlay="false" :max-width="confirmModalData.maxWidth" @input="resetModal" v-model="show">
    <v-card>
      <v-toolbar :color="confirmModalData.type" class="px-3 elevation-0" dark height="45">
        <div>
          <v-icon>
            {{getIcon}}
          </v-icon>
          <span :class="[{'small-text': true}, 'mx-5']">
                  {{$t(confirmModalData.title)}}
                    </span>
        </div>
        <v-spacer></v-spacer>
        <v-btn @click.stop="resetModal" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-row class="my-4" justify="center" no-gutters>
        <template v-if="confirmModalData.type === 'success'">
          <sweetalert-icon icon="success"></sweetalert-icon>
        </template>
        <template v-else-if="confirmModalData.type === 'error'">
          <sweetalert-icon icon="error"></sweetalert-icon>
        </template>
        <template v-else-if="confirmModalData.type === 'warning'">
          <sweetalert-icon icon="warning"></sweetalert-icon>
        </template>
        <template v-else-if="confirmModalData.type === 'info'">
          <sweetalert-icon icon="info"></sweetalert-icon>
        </template>
      </v-row>

      <!--  Confirm only Text Mode-->
      <v-row class="pb-5 mx-auto" justify="center" no-gutters>
        <span class=" md-text px-4"  v-html="$t(confirmModalData.message, confirmModalData.secondDynamicString, confirmModalData.thirdDynamicString, confirmModalData.fourthDynamicString)">
                </span>
      </v-row>

      <!--  Action Buttons Mode-->
      <template v-if="confirmModalData.isActionButtons">
        <v-row justify="center" no-gutters>
          <v-col class="mx-5 mb-2 mt-5">
            <v-divider/>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer/>
          <v-row no-gutters>
            <v-btn :block="$vuetify.breakpoint.xsOnly" :color="confirmModalData.cancelButton.color" @click="clickNo" rounded text>
              {{$t(confirmModalData.cancelButton.text)}}
              <v-icon right>
                {{confirmModalData.cancelButton.icon}}
              </v-icon>
            </v-btn>
            <v-btn :block="$vuetify.breakpoint.xsOnly" v-if="confirmModalData.toShowOkButton" :color="confirmModalData.okButton.color" @click="clickOk" rounded text>
              {{confirmModalData.okButton.text}}
              <v-icon right>{{confirmModalData.okButton.icon}}</v-icon>
            </v-btn>
          </v-row>
        </v-card-actions>
      </template>

      <!--  Input or Date Mode-->
      <v-form ref="form" v-else-if="confirmModalData.isInputMode" v-model="isFormValid">
        <v-row justify="center" no-gutters>
          <v-col cols="11" sm="8" align-self="end">
            <v-text-field
                :append-icon="confirmModalData.inputFieldIcon"
                @keypress.enter.prevent="clickOnInputButton"
                dense
                outlined
                v-if="confirmModalData.isTextFieldMode"
                v-model="inputFieldValue">
            </v-text-field>

            <date-and-time-picker
                :label="$t('fromDate')"
                :selected-date="selectedDate"
                @clearDate="selectedDate = ''"
                v-if="confirmModalData.isDatePickerMode"
                v-model="selectedDate">
            </date-and-time-picker>
          </v-col>
        </v-row>
        <v-row class="pb-5" justify="center" no-gutters>
          <v-col cols="11" sm="8">
            <v-btn
                :disabled="!isFormValid"
                :loading="confirmModalData.isLoading"
                @click="clickOnInputButton"
                block
                color="success"
            >
              {{$t(confirmModalData.inputButtonText)}}
              <v-icon right>{{confirmModalData.inputButtonIcon}}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import DateAndTimePicker from './DateAndTimePicker'

export default {
  name: 'ConfirmModal',
  components: {
    DateAndTimePicker
  },
  data: function () {
    return {
      isFormValid: false,
      randomNumber: '',
      inputFieldValue: '',
      selectedDate: '',
      resolve: null,
      reject: null,
      icons: [
        { type: 'info', icon: 'mdi-information-variant' },
        { type: 'success', icon: 'mdi-checkbox-marked-circle' },
        { type: 'warning', icon: 'mdi-exclamation' },
        { type: 'error', icon: 'mdi-alert' }
      ]
    }
  },
  methods: {
    getRandomSuccessAnimation () {
      this.randomNumber = Math.floor(Math.random() * 3) + 1
    },
    resetModal () {
      this.$store.commit('CLOSE_CONFIRM_MODAL')
      this.$store.commit('RESET_CONFIRM_MODAL_DATA')
      this.resolve = null
      this.reject = null
      if (this.confirmModalData.isInputMode) { // reset if has no value from store
        this.$refs.form.resetValidation()
        if (!this.confirmModalData.initialInputValue) { this.inputFieldValue = '' }
      }
      // this.$refs.form.reset(); // reset the form value and validations error if is
    },
    openModal (modalData) {
      this.$store.commit('OPEN_CONFIRM_MODAL', modalData)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    clickOk () {
      if (typeof this.resolve === 'function') {
        this.resolve(true)
        this.resetModal()
      } else { // sometimes the modal stuck - reload the page temp solution
        return window.location.reload()
      }
    },
    clickNo () {
      if (typeof this.resolve === 'function') {
        this.resolve(false)
        this.resetModal()
      } else { this.resetModal() }
    },
    clickOnInputButton () {
      if (!this.$refs.form.validate()) return
      if (this.confirmModalData.isTextFieldMode) { this.resolve(this.inputFieldValue) } else { this.resolve(this.selectedDate) }
      this.resetModal()
    }
  },
  computed: {
    ...mapState(['confirmModalData', 'isConfirmModalVisible']),
    ...mapState('auth', ['user']),
    show: {
      get () {
        return this.isConfirmModalVisible
      },
      set (value) {
        if (!value) {
          this.getRandomSuccessAnimation() // generate new random number
          this.$store.commit('CLOSE_CONFIRM_MODAL')
          this.$store.commit('RESET_CONFIRM_MODAL_DATA')
        }
      }
    },
    getIcon () {
      return this.icons.find(el => el.type === this.confirmModalData.type).icon
    }
  },
  mounted () {
    this.getRandomSuccessAnimation()
  },
  watch: {
    'confirmModalData.initialDateValue' (val) {
      this.selectedDate = val // set the init date val
    },
    'confirmModalData.initialInputValue' (val) {
      this.inputFieldValue = val // set the init date val
    }
  }
}
</script>
<style>
.small-text {
  font-size: 0.9rem;
}
</style>

<style scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
::v-deep input[type=number] {
  -moz-appearance: textfield;
}
</style>
