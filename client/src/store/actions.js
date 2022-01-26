import { app } from '../main'

export const openConfirmModal = async (state, modalData) => await app.$confirm.openModal(modalData)

export const addNotification = ({ commit }, notification) => commit('PUSH_NOTIFICATION', notification)

export const removeNotification = ({ commit }, notification) => commit('REMOVE_NOTIFICATION', notification)
