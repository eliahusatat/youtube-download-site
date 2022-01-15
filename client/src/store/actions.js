import { app } from '../main'

export const openConfirmModal = async (state, modalData) => await app.$confirm.openModal(modalData)
