import { getDefaultConfirmModalData } from '../utils/getDefaultData'

export const SET = (state, { name, value }) => {
  state[name] = value
}

// App confirm modal
export const OPEN_CONFIRM_MODAL = (state, modalData) => {
  state.confirmModalData = getDefaultConfirmModalData()
  state.isConfirmModalVisible = true
  Object.entries(modalData).forEach(el => state.confirmModalData[el[0]] = el[1])
}

export const SET_SUCCESS_MODAL = (state, { message, deletedItemString, isDelete = false, dynamicString, thirdDynamicString }) => {
  if (state.confirmModalData.toHideOtherAlerts) return
  state.confirmModalData = getDefaultConfirmModalData()
  state.isConfirmModalVisible = true
  state.confirmModalData.title = 'successTitle'
  state.confirmModalData.message = message
  state.confirmModalData.type = 'success'
  state.confirmModalData.isSuccessfullyDeleted = isDelete
  state.confirmModalData.deletedItemString = deletedItemString
  state.confirmModalData.secondDynamicString = dynamicString
  state.confirmModalData.thirdDynamicString = thirdDynamicString
}

export const SET_ERROR_MODAL = (state, errorMessage, dynamicString) => {
  if (state.confirmModalData.toHideOtherAlerts) return
  state.confirmModalData = getDefaultConfirmModalData()
  state.isConfirmModalVisible = true
  state.confirmModalData.title = 'errorTitle'
  state.confirmModalData.message = errorMessage
  state.confirmModalData.type = 'error'
  state.confirmModalData.secondDynamicString = dynamicString
}

export const SET_WARNING_MODAL = (state, { message, isStringTranslated = true, dynamicString, thirdDynamicString }) => {
  if (state.confirmModalData.toHideOtherAlerts) return
  state.confirmModalData = getDefaultConfirmModalData()
  state.isConfirmModalVisible = true
  state.confirmModalData.title = 'warningTitle'
  state.confirmModalData.message = message
  state.confirmModalData.type = 'warning'
  state.confirmModalData.secondDynamicString = dynamicString
  state.confirmModalData.thirdDynamicString = thirdDynamicString
  if (isStringTranslated === false) { state.confirmModalData.isStringTranslated = isStringTranslated }
}

export const CLOSE_CONFIRM_MODAL = state => state.isConfirmModalVisible = false

export const RESET_CONFIRM_MODAL_DATA = state => state.confirmModalData = getDefaultConfirmModalData()

// App Notifications
export const PUSH_NOTIFICATION = (state, notification) => {
  state.notifications.push({
    ...notification,
    id: (Math.random().toString(36) + Date.now().toString(36)).substr(2) // crate random ID by date
  })
}

export const REMOVE_NOTIFICATION = (state, notificationToRemove) => {
  state.notifications = state.notifications.filter(notification => notification.id !== notificationToRemove.id)
}
