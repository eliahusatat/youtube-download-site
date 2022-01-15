
const apiHostsMap = { // ENDPOINTS
  local: 'http://localhost:3001/'
}

const backEndUrl = apiHostsMap.local

module.exports = {
  backEndUrl
}

console.log(`PHP SERVER IS ON  ${backEndUrl}`)
