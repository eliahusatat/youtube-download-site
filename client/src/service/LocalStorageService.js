const setItem = (key, value) => {
  return window.localStorage.setItem(key, value)
}

const getItem = key => {
  return window.localStorage.getItem(key)
}

const removeItem = key => {
  return window.localStorage.removeItem(key)
}

export default { setItem, getItem, removeItem }
